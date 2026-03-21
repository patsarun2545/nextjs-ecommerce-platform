import { UserType } from "@/types/user";
import MobileMenu from "./mobile-menu";
import CartIcon from "./cart-icon";
import { DesktopNavLinks } from "./navlinks";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DesktopUserMenu from "./desktop-user-menu";
import { getCartItemCount } from "@/features/carts/db/carts";

interface NavbarProps {
  user: UserType | null;
}

export default async function Navbar({ user }: NavbarProps) {
  const itemCount = user ? await getCartItemCount(user.id) : 0;

  // const cart = user ? await getUserCart(user.id) : null;
  // const itemCount = cart ? cart.items.length : 0;

  return (
    <nav className="flex items-center gap-3">
      {/* Mobile Navigation */}
      {user && <CartIcon itemCount={itemCount} />}
      <MobileMenu user={user} />

      {/* Desktop Navigation */}
      <div className="hidden md:flex md:items-center">
        <DesktopNavLinks />
        {user ? (
          <DesktopUserMenu user={user} />
        ) : (
          <Button size="sm" asChild>
            <Link href="/auth/signin">เข้าสู่ระบบ</Link>
          </Button>
        )}
      </div>
    </nav>
  );
};

