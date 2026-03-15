import { UserType } from "@/types/user"
import MobileMenu from "./mobile-menu"

interface NavbarProps {
  user: UserType | null
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <nav className="flex items-center gap-3">
      {/* Mobile Navigation */}
      {user && <div>Cart</div>}
      <MobileMenu user={user}/>

      {/* Desktop Navigation */}
      <div className="hidden md:flex md:items-center md:gap-6">
        <div>Desktop Link</div>

        {user ? (
          <div>Desktop User Menu</div>
        ) : (
          <div>Go to signin button</div>
        )}
      </div>
    </nav>
  )
}