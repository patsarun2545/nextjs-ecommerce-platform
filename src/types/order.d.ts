import { OrderItem, OrderStatus } from "@prisma/client";
import { UserType } from "./user";

export interface OrderType {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  paymentAt?: Date | null;
  paymentImage?: string | null;
  address?: string | null;
  phone?: string | null;
  note?: string | null;
  shippingFee: number;
  trackingNumber?: string | null;
  customerId: string;
  items: (OrderItem & {
    lowStock: number;
    sku: string;
    mainImage: { url: string; isMain: boolean } | null;
  })[];
  customer: UserType;
  createdAtFormatted: string;
  paymentAtFormatted?: string | null;
  totalItems?: number;
}
