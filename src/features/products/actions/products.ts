"use server";

import { InitialFormState } from "@/types/action";
import { createProduct } from "../db/products";
import { uploadToImageKit } from "@/lib/imageKit";

export const productAction = async (
  _prevState: InitialFormState,
  formData: FormData,
) => {
  const rawData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    categoryId: formData.get("category-id") as string,
    cost: formData.get("cost") as string,
    basePrice: formData.get("base-price") as string,
    price: formData.get("price") as string,
    stock: formData.get("stock") as string,
    images: formData.getAll("images") as File[],
    mainImageIndex: formData.get("main-image-index") as string,
  };

  const processedData = {
    ...rawData,
    cost: rawData.cost ? parseFloat(rawData.cost) : undefined,
    basePrice: rawData.basePrice ? parseFloat(rawData.basePrice) : 0,
    price: rawData.price ? parseFloat(rawData.price) : 0,
    stock: rawData.stock ? parseInt(rawData.stock) : 0,
    mainImageIndex: rawData.mainImageIndex
      ? parseInt(rawData.mainImageIndex)
      : 0,
  };

  const uploadedImages = [];

  for (const imageFile of processedData.images) {
    const uploadResult = await uploadToImageKit(imageFile, "product");
    if (uploadResult && !uploadResult.message) {
      uploadedImages.push({
        url: uploadResult.url || "",
        fileId: uploadResult.fileId || "",
      });
    }
  }

  const result = await createProduct({
    ...processedData,
    images: uploadedImages,
  });

  return result && result.message
    ? {
        success: false,
        message: result.message,
        errors: result.error,
      }
    : {
        success: true,
        message: "Product created successfully",
      };
};
