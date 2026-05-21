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
import { config } from "@/lib/config";
import {
  AppError,
  ValidationError,
  InsufficientStockError,
  ForbiddenError,
} from "@/lib/errors";
import { generateSKU } from "@/lib/productUtils";

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
      throw new ValidationError("ไม่มีสินค้าในตะกร้า");
    }

    const shippingFee = config.shippingFee;

    const orderNumber = generateOrderNumber();

    const totalAmount = cart.cartTotal + shippingFee;

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

      const productIds = cart.products.map((item) => item.productId);
      const products = await prisma.product.findMany({
        where: { id: { in: productIds } },
        include: { images: true },
      });
      const productMap = new Map(products.map((p) => [p.id, p]));

      for (const item of cart.products) {
        const product = productMap.get(item.productId);

        if (!product || product.stock < item.count) {
          throw new InsufficientStockError(
            `สินค้า ${product?.title} มีไม่เพียงพอ`,
          );
        }

        const mainImage = product.images.find((image) => image.isMain);

        await Promise.all([
          prisma.orderItem.create({
            data: {
              quantity: item.count,
              price: product.price,
              totalPirce: item.price,
              productTitle: product.title,
              productImage: mainImage?.url || null,
              orderId: order.id,
              productId: item.productId,
            },
          }),
          prisma.product.update({
            where: {
              id: item.productId,
            },
            data: {
              sold: product.sold + item.count,
              stock: product.stock - item.count,
            },
          }),
        ]);
      }

      return order;
    });

    if (!newOrder) {
      throw new AppError(
        "เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ",
        "ORDER_CREATION_FAILED",
      );
    }

    await clearCart();

    revalidateOrderCache(newOrder.id, newOrder.customerId);

    return {
      orderId: newOrder.id,
    };
  } catch (error) {
    console.error("Error creating order:", error);
    if (error instanceof AppError) {
      return { message: error.message };
    }
    if (error instanceof Error) {
      return { message: error.message };
    }
    return {
      message: "เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ กรุณาลองใหม่ในภายหลัง",
    };
  }
};

export const getAllOrders = async (status?: OrderStatus) => {
  "use cache";

  cacheLife("hours");
  cacheTag(getOrderGlobalTag());

  try {
    const orders = await db.order.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        totalAmount: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        paymentAt: true,
        paymentImage: true,
        address: true,
        phone: true,
        note: true,
        shippingFee: true,
        trackingNumber: true,
        customerId: true,
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            picture: true,
            address: true,
            tel: true,
          },
        },
        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            totalPirce: true,
            productTitle: true,
            productImage: true,
            productId: true,
            orderId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    return orders.map((order) => ({
      ...order,
      items: order.items.map((item) => ({
        ...item,
        lowStock: config.lowStockThreshold,
        sku: generateSKU(item.productId),
        mainImage: item.productImage
          ? { url: item.productImage, isMain: true }
          : null,
      })),
      createdAtFormatted: formatDate(order.createdAt),
      paymentAtFormatted: order.paymentAt ? formatDate(order.paymentAt) : null,
      totalItems: order.items.reduce((sum, item) => sum + item.quantity, 0),
    }));
  } catch (error) {
    console.error("Error getting all orders:", error);
    return [];
  }
};

export const getOrderById = async (orderId: string) => {
  "use cache";

  cacheLife("hours");
  cacheTag(getOrderIdTag(orderId));

  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        orderNumber: true,
        totalAmount: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        paymentAt: true,
        paymentImage: true,
        address: true,
        phone: true,
        note: true,
        shippingFee: true,
        trackingNumber: true,
        customerId: true,
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            picture: true,
            address: true,
            tel: true,
          },
        },
        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            totalPirce: true,
            productTitle: true,
            productImage: true,
            productId: true,
            orderId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!order) return null;

    return {
      ...order,
      items: order.items.map((item) => ({
        ...item,
        lowStock: config.lowStockThreshold,
        sku: generateSKU(item.productId),
        mainImage: item.productImage
          ? { url: item.productImage, isMain: true }
          : null,
      })),
      createdAtFormatted: formatDate(order.createdAt),
      paymentAtFormatted: order.paymentAt ? formatDate(order.paymentAt) : null,
    };
  } catch (error) {
    console.error(`Error getting order ${orderId}:`, error);
    return null;
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
      throw new ValidationError("ไม่พบคำสั่งซื้อนี้");
    }

    if (order.customerId !== user.id) {
      throw new ForbiddenError("คุณไม่มีสิทธิ์ในคำสั่งซื้อนี้");
    }

    if (order.status !== "Pending") {
      throw new ValidationError(
        "ไม่สามารถอัพโหลดหลักฐานการชำระเงินได้ คำสั่งซื้อได้ชำระเงินแล้ว",
      );
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
    if (error instanceof AppError) {
      return { message: error.message };
    }
    if (error instanceof Error) {
      return { message: error.message };
    }
    return { message: "เกิดข้อผิดพลาดในการอัพโหลดสลิปการชำระเงิน" };
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
      select: {
        id: true,
        customerId: true,
        status: true,
        items: {
          select: {
            productId: true,
            quantity: true,
          },
        },
      },
    });

    if (!order) {
      throw new ValidationError("ไม่พบคำสั่งซื้อนี้");
    }

    if (order.customerId !== user.id) {
      throw new ForbiddenError("คุณไม่มีสิทธิ์ในคำสั่งซื้อนี้");
    }

    if (order.status !== "Pending") {
      throw new ValidationError(
        "ไม่สามารถยกเลิกคำสั่งซื้อได้ เนื่องจากคำสั่งซื้อนี้ได้ชำระเงินแล้ว กรุณาติดต่อเราเพื่อสอบถามเพื่มเติม",
      );
    }

    await db.$transaction(async (prisma) => {
      await Promise.all(
        order.items.map((item) =>
          prisma.product.update({
            where: { id: item.productId },
            data: {
              stock: { increment: item.quantity },
              sold: { decrement: item.quantity },
            },
          }),
        ),
      );

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
    if (error instanceof AppError) {
      return { message: error.message };
    }
    if (error instanceof Error) {
      return { message: error.message };
    }
    return { message: "เกิดข้อผิดพลาดในการยกเลิกคำสั่งซื้อ" };
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
      throw new ValidationError("ไม่พบคำสั่งซื้อนี้");
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
    if (error instanceof AppError) {
      return { message: error.message };
    }
    if (error instanceof Error) {
      return { message: error.message };
    }
    return { message: "เกิดข้อผิดพลาดในการอัพเดตสถานะคำสั่งซื้อ" };
  }
};

export const getMyOrders = async (userId: string) => {
  "use cache";

  if (!userId) redirect("/auth/signin");

  cacheLife("hours");
  cacheTag(getOrderGlobalTag());

  try {
    const orders = await db.order.findMany({
      where: { customerId: userId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        orderNumber: true,
        totalAmount: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        paymentAt: true,
        shippingFee: true,
        customerId: true,
        items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            totalPirce: true,
            productTitle: true,
            productImage: true,
            productId: true,
            orderId: true,
            createdAt: true,
            updatedAt: true,
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
        lowStock: config.lowStockThreshold,
        sku: generateSKU(item.productId),
        mainImage: item.productImage
          ? { url: item.productImage, isMain: true }
          : null,
      })),
    }));
  } catch (error) {
    console.error("Error getting my orders:", error);
    return [];
  }
};
