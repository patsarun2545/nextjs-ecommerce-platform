'use client'

import InputForm from "@/components/shared/input-form"
import SubmitBtn from "@/components/shared/submit-btn"
import ErrorMessage from "@/components/shared/error-message"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CategoryType } from "@/types/category"
import { Save } from "lucide-react"
import Form from "next/form"
import { categoryAction } from "@/features/categories/actions/categories"
import { useForm } from "@/hooks/use-form"
import { useEffect } from "react"
import Modal from "../../../components/shared/modal"

interface EditCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: CategoryType | null
}

const EditCategoryModal = ({
  open,
  onOpenChange,
  category,
}: EditCategoryModalProps) => {
  const { state, errors, formAction, isPending, hideErrors } =
    useForm(categoryAction)

  useEffect(() => {
    if (state.success) onOpenChange(false)
  }, [state, onOpenChange])

  useEffect(() => {
    if (open) hideErrors()
  }, [open, hideErrors])

  if (!category) return null

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Category"
      description="Update your category information."
    >
      <form action={formAction} onChange={hideErrors} className="space-y-4">
        {/* Hidden ID Field */}
        <input type="hidden" name="category-id" value={category?.id} />

        <div className="space-y-2">
          <InputForm
            label="Category name"
            id="category-name"
            placeholder="Enter category name"
            defaultValue={category?.name}
            required
          />

          {/* Error Message */}
          {errors?.name && <ErrorMessage error={errors.name[0]} />}
        </div>

        <div className="pt-4">
          <SubmitBtn
            name="Update Category"
            icon={Save}
            className="w-full"
            pending={isPending}
          />
        </div>
      </form>
    </Modal>
  )
}

export default EditCategoryModal