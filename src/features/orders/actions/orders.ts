"use server";

import { redirect } from "next/navigation";
import { createOrder } from "../db/orders";
import { InitialFormState } from "@/types/action";

export const checkoutAction = async (
  _prevState: InitialFormState,
  formData: FormData,
) => {
  const data = {
    address: formData.get("address") as string,
    phone: formData.get("phone") as string,
    note: formData.get("note") as string,
    useProfileData: formData.get("use-profile-data") as string,
  };

  const result = await createOrder(data);

  if (result && result.message && !result.orderId) {
    return {
      success: false,
      message: result.message,
      errors: result.error,
    };
  }

  redirect(`/my-orders/${result.orderId}`);
};
