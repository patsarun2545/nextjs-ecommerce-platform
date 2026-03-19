import { Link } from "lucide-react"
import { ShoppingBag } from "lucide-react"

export default function CartIcon() {
  return (
    <Link href="/cart" className="md:hidden">
      <ShoppingBag size={20} />
    </Link>
  )
}