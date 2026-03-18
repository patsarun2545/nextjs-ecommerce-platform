import { db } from "@/lib/db";
import { cacheLife, cacheTag } from "next/cache";
import { getCategoryGlobalTag, revalidateCategoryCache } from "./cache";
import { createCategorySchema } from "@/features/auths/schemas/categories";
import { authCheck } from "@/features/auths/db/auths";
import {
  canCreateCategory,
  canUpdateCategory,
} from "../permissions/categories";
import { redirect } from "next/navigation";
import { CategoryStatus } from "@prisma/client";

interface CreateCategoryInput {
  name: string;
}

interface UpdateCategoryInput {
  id: string;
  name: string;
}

export const getCategories = async () => {
  "use cache";
  cacheLife("days");
  cacheTag(getCategoryGlobalTag());
  try {
    const categories = await db.category.findMany({
      select: {
        id: true,
        name: true,
        status: true,
      },
    });

    return categories;
  } catch (error) {
    console.error("Error getting categories data:", error);
    return [];
  }
};

export const getCategoryById = async (id: string) => {
  "use cache";
  cacheLife("days");
  cacheTag(getCategoryGlobalTag());
  try {
    const category = await db.category.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });

    return category;
  } catch (error) {
    console.error("Error getting category data:", error);
    return null;
  }
};

export const createCategory = async (input: CreateCategoryInput) => {
  const user = await authCheck();

  if (!user || !canCreateCategory(user)) {
    redirect("/");
  }

  try {
    const { success, data, error } = createCategorySchema.safeParse(input);

    if (!success) {
      return {
        message: "Please enter valid data",
        error: error.flatten().fieldErrors,
      };
    }

    const category = await db.category.findFirst({
      where: {
        name: data.name,
      },
    });

    if (category) {
      return {
        message: "A category with this name already exists",
      };
    }

    const newCategory = await db.category.create({
      data: {
        name: data.name,
      },
    });

    revalidateCategoryCache(newCategory.id);
  } catch (error) {
    console.error("Error creating new category:", error);
    return { message: "Something went wrong. Please try again later" };
  }
};

export const updateCategory = async (input: UpdateCategoryInput) => {
  try {
    const { success, data, error } = createCategorySchema.safeParse(input);

    if (!success) {
      return {
        message: "Please enter valid data",
        error: error.flatten().fieldErrors,
      };
    }

    const existingCategory = await db.category.findUnique({
      where: {
        id: input.id,
      },
    });

    if (!existingCategory) {
      return {
        message: "Category not found",
      };
    }

    const duplicateCategory = await db.category.findFirst({
      where: {
        name: data.name,
        NOT: {
          id: input.id,
        },
      },
    });

    if (duplicateCategory) {
      return {
        message: "A category with this name already exists",
      };
    }

    const updatedCategory = await db.category.update({
      where: {
        id: input.id,
      },
      data: {
        name: data.name,
      },
    });
    revalidateCategoryCache(updatedCategory.id);
  } catch (error) {
    console.error("Error updating category:", error);
    return {
      message: "Something went wrong. Please try again later",
    };
  }
};

export const changeCategoryStatus = async (
  id: string,
  status: CategoryStatus,
) => {
  const user = await authCheck();
  if (!user || !canUpdateCategory(user)) {
    redirect("/");
  }

  try {
    const existsCategory = await getCategoryById(id);

    if (!existsCategory) {
      return {
        message: "Category not found",
      };
    }

    if (existsCategory.status === status) {
      return {
        message: `Category is already ${status.toLowerCase()}`,
      };
    }

    const updatedCategory = await db.category.update({
      where: { id },
      data: { status },
    });

    revalidateCategoryCache(updatedCategory.id);

    return {
      message: "Category status updated successfully",
    };
  } catch (error) {
    console.error("Error changing category status:", error);

    return {
      message: "Something went wrong. Please try again later",
    };
  }
};

export const removeCategory = async (id: string) => {
  return await changeCategoryStatus(id, "Inactive");
};

export const restoreCategory = async (id: string) => {
  return await changeCategoryStatus(id, "Active");
};
