import Modal from "@/components/shared/modal";
import SubmitBtn from "@/components/shared/submit-btn";
import { Button } from "@/components/ui/button";
import { useForm } from "@/hooks/use-form";
import { ProductType } from "@/types/product";
import { RefreshCcw } from "lucide-react";
import Form from "next/form";
import { restoreProductAction } from "../actions/products";
import { useEffect } from "react";

interface RestoreProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ProductType | null;
}

const RestoreProductModal = ({
  open,
  onOpenChange,
  product,
}: RestoreProductModalProps) => {
  const { state, formAction, isPending } = useForm(restoreProductAction);

  useEffect(() => {
    if (state.success) {
      onOpenChange(false);
    }
  }, [state, onOpenChange]);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Restore Product"
      description={`Are you sure you want to restore the product "${product?.title}"`}
    >
      <Form action={formAction}>
        <input type="hidden" name="product-id" value={product?.id} />
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <SubmitBtn name="Restore" icon={RefreshCcw} pending={isPending} />
        </div>
      </Form>
    </Modal>
  );
};

export default RestoreProductModal;
