import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CartIconProps {
  itemCount: number;
}

export default function CartIcon({ itemCount }: CartIconProps) {
  return (
    <Link href="/cart" className="md:hidden relative">
      <ShoppingBag size={20} />
      {itemCount >= 0 && (
        <Badge className="absolute -top-2 -right-2 size-5 rounded-full p-0 flex items-center justify-center text-[10px]">
          {itemCount > 99 ? "99+" : itemCount}
        </Badge>
      )}
    </Link>
  );
};

