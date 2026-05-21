import { ProductImage } from "@prisma/client";
import { CategoryType } from "./category";

export interface ProductType {
  id: string;
  title: string;
  description: string;
  cost: number;
  basePrice: number;
  price: number;
  stock: number;
  sold: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  categoryId: string;
  category: CategoryType;
  lowStock: number;
  sku: string;
  mainImage?: ProductImage | null;
  mainImageIndex?: number;
  images: ProductImage[];
}
