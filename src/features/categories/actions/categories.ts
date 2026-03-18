"use server";

import { InitialFormState } from "@/types/action";
import {
  createCategory,
  updateCategory,
  removeCategory,
  restoreCategory,
} from "@/features/categories/db/categories";

export const categoryAction = async (
  _prevState: InitialFormState,
  formData: FormData,
) => {
  const rawData = {
    id: formData.get("category-id") as string,
    name: formData.get("category-name") as string,
  };

  const result = rawData.id
    ? await updateCategory(rawData)
    : await createCategory(rawData);

  const response =
    result && result.message
      ? {
          success: false,
          message: result.message,
          errors: result.error,
        }
      : {
          success: true,
          message: rawData.id ? "Updated Success" : "Created Success",
        };

  return response;
};

export const deleteCategoryAction = async (
  _prevState: InitialFormState,
  formData: FormData,
) => {
  const id = formData.get("category-id") as string;

  const result = await removeCategory(id);

  return result && result.message
    ? {
        success: false,
        message: result.message,
      }
    : {
        success: true,
        message: "Category deleted successfully",
      };
};

export const restoreCategoryAction = async (
  _prevState: InitialFormState,
  formData: FormData,
) => {
  const id = formData.get("category-id") as string;

  const result = await restoreCategory(id);

  return result && result.message
    ? {
        success: false,
        message: result.message,
      }
    : {
        success: true,
        message: "Category restored successfully",
      };
};
