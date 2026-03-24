import { db } from "@/lib/db";
import { cacheLife, cacheTag } from "next/cache";
import { getCategoryGlobalTag, revalidateCategoryCache } from "./cache";
import { categorySchema } from "@/features/categories/schemas/categories";
import { authCheck } from "@/features/auths/db/auths";
import {
  canCreateCategory,
  canUpdateCategory,
} from "@/features/categories/permissions/categories";
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
    return await db.category.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });
  } catch (error) {
    console.error("Error getting categories data:", error);
    return [];
  }
};

export const createCategory = async (input: CreateCategoryInput) => {
  const user = await authCheck();

  if (!user || !canCreateCategory(user)) {
    redirect("/");
  }

  try {
    const { success, data, error } = categorySchema.safeParse(input);

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
    return {
      message: "Something went wrong. Please try again later",
    };
  }
};

export const updateCategory = async (input: UpdateCategoryInput) => {
  const user = await authCheck();

  if (!user || !canUpdateCategory(user)) {
    redirect("/");
  }

  try {
    const { success, data, error } = categorySchema.safeParse(input);
    if (!success) {
      return {
        message: "Please enter valid data",
        error: error.flatten().fieldErrors,
      };
    }

    const existsingCategory = await db.category.findUnique({
      where: {
        id: input.id,
      },
    });

    if (!existsingCategory) {
      return {
        message: "Category not found",
      };
    }

    const duplicateCategory = await db.category.findFirst({
      where: {
        name: data.name,
        id: {
          not: input.id,
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
    const existsCategory = await db.category.findUnique({
      where: { id },
    });

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
