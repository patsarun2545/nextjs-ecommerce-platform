import { Cart } from "@prisma/client";

export interface CartProduct {
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
}

export interface CartItem {
  id: string;
  count: number;
  price: number;
  product: CartProduct;
}

export interface CartType extends Cart {
  items: CartItem[];
  itemCount: number;
}
