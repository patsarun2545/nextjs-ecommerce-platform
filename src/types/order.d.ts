import { Order, OrderItem } from "@prisma/client";
import { ProductType } from "./product";
import { UserType } from "./user";

export interface OrderType extends Order {
  items: (OrderItem & {
    product: ProductType;
  })[];
  customer: UserType;
  createdAtFormatted: string;
  paymentAtFormatted?: string | null;
  totalItems?: number;
}
