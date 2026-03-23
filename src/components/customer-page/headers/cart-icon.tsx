import Link from "next/link";
import { ShoppingBag } from "lucide-react";

interface CartIconProps {
  itemCount: number;
}

export default function CartIcon({ itemCount }: CartIconProps) {
  return (
    <Link
      href="/cart"
      className="md:hidden relative flex items-center justify-center size-9 rounded-xl hover:bg-blue-50 transition-colors duration-150"
    >
      <ShoppingBag size={20} className="text-slate-600" />
      {itemCount >= 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center size-5 rounded-full bg-blue-600 text-white text-[10px] font-bold shadow-sm shadow-blue-300">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}