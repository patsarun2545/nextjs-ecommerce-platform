import { SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const NAV_LINKS = [
  { title: "หน้าหลัก", href: "/" },
  { title: "สินค้าทั้งหมด", href: "/products" },
  { title: "เกี่ยวกับ", href: "/about" },
  { title: "ติดต่อเรา", href: "/contact" },
]

export function MobileNavLinks({ links = NAV_LINKS }) {
  return (
    <div className="flex flex-col gap-2">
      {links.map((link, index) => (
        <SheetClose key={index} asChild>
          <Button
            variant='secondary'
            size='lg'
            asChild>
            <Link href={link.href}>{link.title}</Link>
          </Button>
        </SheetClose>
      ))}
    </div>
  )
}