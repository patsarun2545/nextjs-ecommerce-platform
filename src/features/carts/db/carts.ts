import { redirect } from "next/navigation";
import { revalidateCartCache, getCartTag } from "./cache";
import { db } from "@/lib/db";
import { authCheck } from "@/features/auths/db/auths";
import { canUpdateUserCart } from "../permissions/carts";
import { cacheLife, cacheTag } from "next/cache";
import {
  AppError,
  NotFoundError,
  ValidationError,
  InsufficientStockError,
} from "@/lib/errors";
import { config } from "@/lib/config";

interface CartItem {
  id: string;
  count: number;
  price: number;
  product: {
    id: string;
    title: string;
    price: number;
    stock: number;
    status: string;
    images: { id: string; url: string; isMain: boolean }[];
    category: { id: string; name: string };
    mainImage: { id: string; url: string; isMain: boolean } | null;
    lowStock: number;
    sku: string;
  };
}

interface CartWithItems {
  id: string;
  cartTotal: number;
  orderedById: string;
  createdAt: Date;
  updatedAt: Date;
  items: CartItem[];
  itemCount: number;
}

interface AddToCartInput {
  productId: string;
  count: number;
}

interface UpdateCartInput {
  cartItemId: string;
  newCount: number;
}

interface OperationResult {
  success?: boolean;
  message?: string;
  error?: Record<string, string[]>;
}

export const getUserCart = async (
  userId: string | null,
): Promise<CartWithItems | null> => {
  "use cache";

  if (!userId) {
    redirect("/auth/signin");
  }

  cacheLife("hours");
  cacheTag(getCartTag(userId));

  try {
    const cart = await db.cart.findFirst({
      orderBy: {
        createdAt: "asc",
      },
      where: {
        orderedById: userId,
      },
      include: {
        products: {
          select: {
            id: true,
            count: true,
            price: true,
            productId: true,
            product: {
              select: {
                id: true,
                title: true,
                price: true,
                stock: true,
                status: true,
                images: {
                  select: {
                    id: true,
                    url: true,
                    isMain: true,
                  },
                },
                category: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cart) return null;

    const cartWithDetails = {
      ...cart,
      items: cart.products.map((item) => {
        const mainImage = item.product.images.find((image) => image.isMain);
        return {
          id: item.id,
          count: item.count,
          price: item.price,
          product: {
            ...item.product,
            mainImage: mainImage || null,
            lowStock: config.lowStockThreshold,
            sku: item.product.id.substring(0, 8).toUpperCase(),
          },
        };
      }),
      itemCount: cart.products.reduce((sum, item) => sum + item.count, 0),
    };

    return cartWithDetails;
  } catch (error) {
    console.error("Error getting user cart:", error);
    return null;
  }
};

export const getCartItemCount = async (
  userId: string | null,
): Promise<number> => {
  "use cache";

  if (!userId) {
    redirect("/auth/signin");
  }

  cacheLife("hours");
  cacheTag(getCartTag(userId));

  try {
    const result = await db.cartItem.aggregate({
      where: {
        cart: {
          orderedById: userId,
        },
      },
      _sum: {
        count: true,
      },
    });

    return result._sum.count ?? 0;
  } catch (error) {
    console.error("Error getting cart item count:", error);
    return 0;
  }
};

const recalculateCartTotal = async (cartId: string) => {
  const result = await db.cartItem.aggregate({
    where: { cartId },
    _sum: { price: true },
  });

  const cartTotal = result._sum.price ?? 0;

  await db.cart.update({
    where: { id: cartId },
    data: { cartTotal },
  });
};

export const addToCart = async (
  input: AddToCartInput,
): Promise<OperationResult> => {
  const user = await authCheck();
  if (!user || !canUpdateUserCart(user)) {
    redirect("/auth/signin");
  }

  try {
    const product = await db.product.findUnique({
      where: {
        id: input.productId,
        status: "Active",
      },
    });

    if (!product) {
      throw new NotFoundError("ไม่พบสินค้าหรือไม่มีจำหน่าย");
    }

    if (product.stock < input.count) {
      throw new InsufficientStockError("สต๊อกสินค้าไม่เพียงพอ");
    }

    let cart = await db.cart.findFirst({
      where: {
        orderedById: user.id,
      },
    });

    if (!cart) {
      cart = await db.cart.create({
        data: {
          cartTotal: 0,
          orderedById: user.id,
        },
      });
    }

    const existingProduct = await db.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: product.id,
      },
    });

    if (existingProduct) {
      await db.cartItem.update({
        where: {
          id: existingProduct.id,
        },
        data: {
          count: existingProduct.count + input.count,
          price: (existingProduct.count + input.count) * product.price,
        },
      });
    } else {
      await db.cartItem.create({
        data: {
          count: input.count,
          price: product.price * input.count,
          cartId: cart.id,
          productId: product.id,
        },
      });
    }

    await recalculateCartTotal(cart.id);

    revalidateCartCache(user.id);
    return { success: true };
  } catch (error) {
    console.error("Error adding to cart:", error);
    if (error instanceof AppError) {
      return { message: error.message };
    }
    if (error instanceof Error) {
      return { message: error.message };
    }
    return { message: "เกิดข้อผิดพลาดในการเพิ่มสินค้าลงในตะกร้า" };
  }
};

export const updateCartItem = async (
  input: UpdateCartInput,
): Promise<OperationResult> => {
  const user = await authCheck();
  if (!user || !canUpdateUserCart(user)) {
    redirect("/auth/signin");
  }

  try {
    if (input.newCount < 1) {
      throw new ValidationError("จำนวนสินค้าต้องมีอย่างน้อย 1 ชิ้น");
    }

    const cartItem = await db.cartItem.findUnique({
      where: { id: input.cartItemId },
      select: {
        id: true,
        cartId: true,
        productId: true,
        count: true,
        price: true,
        cart: {
          select: {
            orderedById: true,
          },
        },
        product: {
          select: {
            stock: true,
            price: true,
          },
        },
      },
    });

    if (!cartItem || cartItem.cart.orderedById !== user.id) {
      throw new NotFoundError("ไม่พบสินค้าในตะกร้า");
    }

    if (cartItem.product.stock < input.newCount) {
      throw new InsufficientStockError("สต๊อกสินค้าไม่เพียงพอ");
    }

    await db.cartItem.update({
      where: { id: input.cartItemId },
      data: {
        count: input.newCount,
        price: cartItem.product.price * input.newCount,
      },
    });

    await recalculateCartTotal(cartItem.cartId);

    revalidateCartCache(user.id);
    return { success: true };
  } catch (error) {
    console.error("Error updating cart:", error);
    if (error instanceof AppError) {
      return { message: error.message };
    }
    if (error instanceof Error) {
      return { message: error.message };
    }
    return { message: "เกิดข้อผิดพลาดในการอัพเดทตะกร้าสินค้า" };
  }
};

export const removeFromCart = async (
  cartItemId: string,
): Promise<OperationResult> => {
  const user = await authCheck();
  if (!user || !canUpdateUserCart(user)) {
    redirect("/auth/signin");
  }

  try {
    const cartItem = await db.cartItem.findUnique({
      where: { id: cartItemId },
      select: {
        id: true,
        cartId: true,
        cart: {
          select: {
            orderedById: true,
          },
        },
      },
    });

    if (!cartItem || cartItem.cart.orderedById !== user.id) {
      return {
        message: "ไม่พบสินค้าในตะกร้า",
      };
    }

    await db.cartItem.delete({
      where: { id: cartItemId },
    });

    await recalculateCartTotal(cartItem.cartId);

    revalidateCartCache(user.id);
    return { success: true };
  } catch (error) {
    console.error("Error removing from cart:", error);
    if (error instanceof AppError) {
      return { message: error.message };
    }
    if (error instanceof Error) {
      return { message: error.message };
    }
    return { message: "ไม่สามารถลบรายการสินค้านี้ออกจากตะกร้าได้" };
  }
};

export const clearCart = async (): Promise<OperationResult> => {
  const user = await authCheck();
  if (!user || !canUpdateUserCart(user)) {
    redirect("/auth/signin");
  }

  try {
    const cart = await db.cart.findFirst({
      where: {
        orderedById: user.id,
      },
    });

    if (!cart) {
      throw new NotFoundError("ตะกร้าของคุณว่างเปล่าแล้ว");
    }

    await db.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    await db.cart.update({
      where: { id: cart.id },
      data: { cartTotal: 0 },
    });

    revalidateCartCache(user.id);
    return { success: true };
  } catch (error) {
    console.error("Error clearing cart:", error);
    if (error instanceof AppError) {
      return { message: error.message };
    }
    if (error instanceof Error) {
      return { message: error.message };
    }
    return { message: "ไม่สามารถเคลียร์ตะกร้าได้" };
  }
};
