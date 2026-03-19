import { CategoryType } from "@/types/category"
import Form from "next/form"
import { Button } from "@/components/ui/button"
import SubmitBtn from "@/components/shared/submit-btn"
import { Trash2 } from "lucide-react"
import { useForm } from "@/hooks/use-form"
import { deleteCategoryAction } from "../actions/categories"
import { useEffect } from "react"
import Modal from "../../../components/shared/modal"

interface DeleteCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: CategoryType | null
}

export default function DeleteCategoryModal({
  open,
  onOpenChange,
  category,
}: DeleteCategoryModalProps) {
  const { state, formAction, isPending } = useForm(deleteCategoryAction)

  useEffect(() => {
    if (state.success) {
      onOpenChange(false)
    }
  }, [state, onOpenChange])

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Category"
      description="Are you sure want to delete the category?"
    >
      <Form action={formAction}>
        <input type="hidden" name="category-id" value={category?.id} />

        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <SubmitBtn
            name="Delete"
            icon={Trash2}
            className="bg-destructive hover:bg-destructive/80"
            pending={isPending}
          />
        </div>
      </Form>
    </Modal>
  )
}