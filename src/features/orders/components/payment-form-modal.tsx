import InputForm from "@/components/shared/input-form";
import Modal from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload } from "lucide-react";
import Form from "next/form";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { updatePaymentAction } from "../actions/orders";
import { useForm } from "@/hooks/use-form";

interface PaymentFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
}

export default function PaymentFormModal({
  open,
  onOpenChange,
  orderId,
}: PaymentFormModalProps) {
  const [preview, setPreview] = useState<string | null>(null);

  const { formAction, isPending } = useForm(updatePaymentAction);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // 5MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error("ไฟล์มีขนาดใหญ่เกินไป (ไม่เกิน 5MB)");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="อัพโหลดหลักฐานการชำระเงิน"
      description=""
    >
      <Form action={formAction}>
        <input type="hidden" name="order-id" value={orderId} />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <InputForm
              label="รูปภาพหลักฐานการชำระเงิน"
              id="payment-image"
              type="file"
              accept="image/*"
              required
              onChange={(event) => handleFileChange(event)}
            />
          </div>

          <ScrollArea className="max-h-[400px] sm:max-h-[480px]">
            {preview && (
              <div className="relative aspect-square w-full rounded-md overflow-hidden border">
                <Image
                  alt="Payment preview"
                  src={preview}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </ScrollArea>

          <div className="flex justify-end space-x-2 pt-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                setPreview(null);
                onOpenChange(false);
              }}
              disabled={isPending}
            >
              ยกเลิก
            </Button>
            <Button type="submit" disabled={!preview || isPending}>
              <Upload size={16} />
              <span>{isPending ? "กำลังอัพโหลด..." : "อัพโหลด"}</span>
            </Button>
          </div>
        </div>
      </Form>
    </Modal>
  );
};


