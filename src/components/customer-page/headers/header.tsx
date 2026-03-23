import Link from "next/link";
import { ShoppingBagIcon } from "lucide-react";
import Navbar from "./navbar";
import { UserType } from "@/types/user";

interface HeaderCustomerProps {
  user: UserType | null;
}

export default function HeaderCustomer({ user }: HeaderCustomerProps) {
  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-[0_2px_20px_rgba(37,99,235,0.08)]">
      <div className="max-w-7xl mx-auto px-4 xl:px-0 flex justify-between items-center h-16">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
        >
          <div className="flex items-center justify-center size-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 shadow-md shadow-blue-200 group-hover:shadow-blue-300 transition-shadow duration-300">
            <ShoppingBagIcon size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
            Tle Store
          </span>
        </Link>

        {/* Menu */}
        <Navbar user={user} />
      </div>
    </header>
  );
}