import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface SubmitBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: string
  pending?: boolean
}

export default function SubmitBtn({ name, pending = false, ...props }: SubmitBtnProps) {
  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? <Loader2 size={16} className="animate-spin" /> : name}
    </Button>
  )
}