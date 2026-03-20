import { Product, ProductImage } from "@prisma/client";
import { CategoryType } from "./category";

export interface ProductType extends Product {
  category: CategoryType;
  lowStock: number;
  sku: string;
  mainImage: Pick<ProductImage, "url"> | null;
}
