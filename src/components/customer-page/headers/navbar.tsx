import { UserType } from "@/types/user";
import MobileMenu from "./mobile-menu";
import CartIcon from "./cart-icon";
import { DesktopNavLinks } from "./navlinks";
import Link from "next/link";
import DesktopUserMenu from "./desktop-user-menu";
import { getUserCart } from "@/features/carts/db/carts";
import { LogIn } from "lucide-react";

interface NavbarProps {
  user: UserType | null;
}

export default async function Navbar({ user }: NavbarProps) {
  const cart = user ? await getUserCart(user.id) : null;
  const itemCount = cart ? cart.items.length : 0;

  return (
    <nav className="flex items-center gap-2">
      {/* Mobile */}
      {user && <CartIcon itemCount={itemCount} />}
      <MobileMenu user={user} />

      {/* Desktop */}
      <div className="hidden md:flex md:items-center gap-1">
        <DesktopNavLinks />

        <div className="w-px h-5 bg-blue-100 mx-2" />

        {user ? (
          <DesktopUserMenu user={user} itemCount={itemCount} />
        ) : (
          <Link
            href="/auth/signin"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors duration-150 shadow-md shadow-blue-200"
          >
            <LogIn size={15} />
            เข้าสู่ระบบ
          </Link>
        )}
      </div>
    </nav>
  );
}