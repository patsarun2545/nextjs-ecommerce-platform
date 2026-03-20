'use client'

import InputForm from "@/components/shared/input-form"
import SubmitBtn from "@/components/shared/submit-btn"
import ErrorMessage from "@/components/shared/error-message"
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

export default function EditCategoryModal({
  open,
  onOpenChange,
  category,
}: EditCategoryModalProps) {
  const { state, errors, formAction, isPending, clearErrors } =
    useForm(categoryAction)

  useEffect(() => {
    if (state.success) onOpenChange(false)
  }, [state, onOpenChange])

  useEffect(() => {
    if (open) clearErrors()
  }, [open, clearErrors])

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Update Category"
      description="Update your category information"
    >
      <Form action={formAction} onChange={clearErrors} className="space-y-4">
        <input type="hidden" name="category-id" value={category?.id} />

        <div className="space-y-2">
          <InputForm
            label="Category name"
            id="category-name"
            placeholder="Enter category name"
            required
            defaultValue={category?.name}
          />
          {/* Error Message */}
          {errors.name && <ErrorMessage error={errors.name[0]} />}
        </div>

        <SubmitBtn
          name="Update Category"
          icon={Save}
          className="w-full"
          pending={isPending}
        />
      </Form>
    </Modal>
  )
}

