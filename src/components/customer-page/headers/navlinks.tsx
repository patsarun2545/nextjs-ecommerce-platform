import { SheetClose } from '@/components/ui/sheet'
import Link from 'next/link'
import { Home, Package } from "lucide-react"

const NAV_LINKS = [
  { title: 'หน้าหลัก', href: '/', icon: Home },
  { title: 'สินค้าทั้งหมด', href: '/products', icon: Package },
]

export const MobileNavLinks = () => (
  <div className='flex flex-col gap-1.5'>
    {NAV_LINKS.map((link, index) => {
      const Icon = link.icon
      return (
        <SheetClose key={index} asChild>
          <Link
            href={link.href}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150"
          >
            <Icon size={16} className="text-blue-500 shrink-0" />
            <span className="text-sm font-medium text-slate-700">{link.title}</span>
          </Link>
        </SheetClose>
      )
    })}
  </div>
)

export const DesktopNavLinks = () => (
  <div className='flex items-center gap-0.5'>
    {NAV_LINKS.map((link, index) => (
      <Link
        key={index}
        href={link.href}
        className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors duration-150"
      >
        {link.title}
      </Link>
    ))}
  </div>
)