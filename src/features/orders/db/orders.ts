import { authCheck } from "@/features/auths/db/auths";
import { redirect } from "next/navigation";
import {
  canCancelOrder,
  canCreateOrder,
  canUpdateStatusOrder,
} from "../permissions/orders";
import { checkoutSchema } from "../schemas/orders";
import { db } from "@/lib/db";
import { generateOrderNumber } from "@/lib/generateOrderNumber";
import { clearCart } from "@/features/carts/db/carts";
import {
  getOrderGlobalTag,
  getOrderIdTag,
  revalidateOrderCache,
} from "./cache";
import { cacheLife, cacheTag } from "next/cache";
import formatDate from "@/lib/formatDate";
import { uploadToImageKit } from "@/lib/imageKit";
import { OrderStatus } from "@prisma/client";

interface CheckoutInput {
  address: string;
  phone: string;
  note?: string;
  useProfileData?: string;
}

interface UpdateOrderStatus {
  orderId: string;
  status: string;
  trackingNumber?: string;
}

export const createOrder = async (input: CheckoutInput) => {
  const user = await authCheck();

  if (!user || !canCreateOrder(user)) {
    redirect("/auth/signin");
  }

  try {
    const useProfileData = input.useProfileData === "on";

    if (useProfileData && user.address && user.tel) {
      input.address = user.address;
      input.phone = user.tel;
    }

    const { success, data, error } = checkoutSchema.safeParse(input);

    if (!success) {
      return {
        message: "กรุณากรอกข้อมูลให้ถูกต้อง",
        error: error.flatten().fieldErrors,
      };
    }

    const cart = await db.cart.findFirst({
      where: { orderedById: user.id },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.products.length === 0) {
      return {
        message: "ไม่มีสินค้าในตะกร้า",
      };
    }

    const shippingFee = 50;

    const orderNumber = generateOrderNumber();

    const totalAmount = cart.cartTotal + shippingFee;

    // สร้างคำสั่งซื้อใหม่
    const newOrder = await db.$transaction(async (prisma) => {
      const order = await prisma.order.create({
        data: {
          orderNumber,
          totalAmount,
          status: "Pending",
          address: data.address,
          phone: data.phone,
          note: data.note,
          shippingFee,
          customerId: user.id,
        },
      });

      for (const item of cart.products) {
        const product = await prisma.product.findUnique({
          where: {
            id: item.productId,
          },
          include: {
            images: true,
          },
        });

        if (!product || product.stock < item.count) {
          throw new Error(`สินค้า ${product?.title} มีไม่เพียงพอ`);
        }

        const mainImage = product.images.find((image) => image.isMain);

        await prisma.orderItem.create({
          data: {
            quantity: item.count,
            price: product.price,
            totalPirce: item.price,
            productTitle: product.title,
            productImage: mainImage?.url || null,
            orderId: order.id,
            productId: item.productId,
          },
        });

        await prisma.product.update({
          where: {
            id: item.productId,
          },
          data: {
            sold: product.sold + item.count,
            stock: product.stock - item.count,
          },
        });
      }

      return order;
    });

    if (!newOrder) {
      return {
        message: "เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ",
      };
    }

    await clearCart();

    revalidateOrderCache(newOrder.id, newOrder.customerId);

    return {
      orderId: newOrder.id,
    };
  } catch (error) {
    console.error("Error creating order:", error);

    if (error instanceof Error) {
      return {
        message: error.message,
      };
    }

    return {
      message: "เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ กรุณาลองใหม่ในภายหลัง",
    };
  }
};

export const getOrderById = async (userId: string, orderId: string) => {
  "use cache";

  if (!userId) {
    redirect("/auth/signin");
  }

  cacheLife("minutes");
  cacheTag(getOrderIdTag(orderId));

  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        items: {
          include: {
            product: {
              include: {
                category: true,
                images: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return null;
    }

    const items = order.items.map((item) => {
      const mainImage = item.product.images.find((image) => image.isMain);

      return {
        ...item,
        product: {
          ...item.product,
          mainImage,
          lowStock: 5,
          sku: item.product.id.substring(0, 8).toUpperCase(),
        },
      };
    });

    return {
      ...order,
      items,
      createdAtFormatted: formatDate(order.createdAt),
      paymentAtFormatted: order.paymentAt ? formatDate(order.paymentAt) : null,
    };
  } catch (error) {
    console.error(`Error getting order ${orderId}:`, error);
    return null;
  }
};

export const getAllOrders = async (userId: string, status?: OrderStatus) => {
  "use cache";

  if (!userId) {
    redirect("/auth/signin");
  }

  cacheLife("minutes");
  cacheTag(getOrderGlobalTag());

  try {
    const orders = await db.order.findMany({
      where: status ? { status } : {},
      include: {
        customer: true,
        items: {
          include: {
            product: {
              include: {
                category: true,
                images: true,
              },
            },
          },
        },
      },
    });

    const orderDetails = orders.map((order) => {
      return {
        ...order,
        items: order.items.map((item) => {
          const mainImage = item.product.images.find((image) => image.isMain);

          return {
            ...item,
            product: {
              ...item.product,
              lowStock: 5,
              sku: item.productId.substring(0, 8).toUpperCase(),
              mainImage,
            },
          };
        }),
        createdAtFormatted: formatDate(order.createdAt),
        paymentAtFormatted: order.paymentAt
          ? formatDate(order.paymentAt)
          : null,
        totalItems: order.items.reduce((sum, item) => sum + item.quantity, 0),
      };
    });

    return orderDetails;
  } catch (error) {
    console.error("Error getting all orders:", error);
    return [];
  }
};

export const uploadPaymentSlip = async (orderId: string, file: File) => {
  const user = await authCheck();
  if (!user) {
    redirect("/auth/signin");
  }

  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return {
        message: "ไม่พบคำสั่งซื้อนี้",
      };
    }

    if (order.customerId !== user.id) {
      return {
        message: "คุณไม่มีสิทธิ์ในคำสั่งซื้อนี้",
      };
    }

    if (order.status !== "Pending") {
      return {
        message:
          "ไม่สามารถอัพโหลดหลักฐานการชำระเงินได้ คำสั่งซื้อได้ชำระเงินแล้ว",
      };
    }

    const uploadResult = await uploadToImageKit(file, "payment");

    if (!uploadResult || uploadResult.message) {
      return {
        message: uploadResult.message || "อัพโหลดรูปภาพไม่สำเร็จ",
      };
    }

    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: {
        paymentImage: uploadResult.url,
        status: "Paid",
        paymentAt: new Date(),
      },
    });

    revalidateOrderCache(updatedOrder.id, updatedOrder.customerId);
  } catch (error) {
    console.error("Error uploading payment slip:", error);
    return {
      message: "เกิดข้อผิดพลาดในการอัพโหลดสลิปการชำระเงิน",
    };
  }
};

export const cancelOrderStatus = async (orderId: string) => {
  const user = await authCheck();
  if (!user || !canCancelOrder(user)) {
    redirect("/auth/signin");
  }

  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      },
    });

    if (!order) {
      return {
        message: "ไม่พบคำสั่งซื้อนี้",
      };
    }

    if (order.customerId !== user.id) {
      return {
        message: "คุณไม่มีสิทธิ์ในคำสั่งซื้อนี้",
      };
    }

    if (order.status !== "Pending") {
      return {
        message:
          "ไม่สามารถยกเลิกคำสั่งซื้อได้ เนื่องจากคำสั่งซื้อนี้ได้ชำระเงินแล้ว กรุณาติดต่อเราเพื่อสอบถามเพื่มเติม",
      };
    }

    await db.$transaction(async (prisma) => {
      for (const item of order.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            stock: { increment: item.quantity },
            sold: { decrement: item.quantity },
          },
        });
      }

      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "Cancelled",
        },
      });
    });

    revalidateOrderCache(orderId, user.id);
  } catch (error) {
    console.error("Error cancelling order:", error);
    return {
      message: "เกิดข้อผิดพลาดในการยกเลิกคำสั่งซื้อ",
    };
  }
};

export const updateOrderStatus = async (input: UpdateOrderStatus) => {
  const user = await authCheck();

  if (!user || !canUpdateStatusOrder(user)) {
    redirect("/");
  }

  try {
    const order = await db.order.findUnique({
      where: { id: input.orderId },
    });

    if (!order) {
      return {
        message: "ไม่พบคำสั่งซื้อนี้",
      };
    }

    if (input.status === "Cancelled") {
      await cancelOrderStatus(order.id);
    }

    const updatedOrder = await db.order.update({
      where: { id: order.id },
      data: {
        status: input.status as OrderStatus,
        trackingNumber: input.trackingNumber || null,
      },
    });

    revalidateOrderCache(updatedOrder.id, updatedOrder.customerId);
  } catch (error) {
    console.error("Error updating order status:", error);
    return {
      message: "เกิดข้อผิดพลาดในการอัพเดตสถานะคำสั่งซื้อ",
    };
  }
};

export const getMyOrders = async (userId: string) => {
  "use cache";

  if (!userId) redirect("/auth/signin");

  cacheLife("minutes");
  cacheTag(getOrderGlobalTag());

  try {
    const orders = await db.order.findMany({
      where: { customerId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              include: { images: true },
            },
          },
        },
      },
    });

    return orders.map((order) => ({
      ...order,
      createdAtFormatted: formatDate(order.createdAt),
      paymentAtFormatted: order.paymentAt ? formatDate(order.paymentAt) : null,
      totalItems: order.items.reduce((sum, item) => sum + item.quantity, 0),
      items: order.items.map((item) => ({
        ...item,
        product: {
          ...item.product,
          mainImage: item.product.images.find((img) => img.isMain) ?? null,
          lowStock: 5,
          sku: item.productId.substring(0, 8).toUpperCase(),
        },
      })),
    }));
  } catch (error) {
    console.error("Error getting my orders:", error);
    return [];
  }
};
