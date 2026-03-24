import { SheetClose } from '@/components/ui/sheet'
import Link from 'next/link'

const NAV_LINKS = [
  { title: 'หน้าหลัก', href: '/' },
  { title: 'สินค้าทั้งหมด', href: '/products' },
  { title: 'เกี่ยวกับ', href: '/about' },
  { title: 'ติดต่อเรา', href: '/contact' },
]

export const MobileNavLinks = () => (
  <div className='flex flex-col gap-2'>
    {NAV_LINKS.map((link, index) => (
      <SheetClose key={index} asChild>
        <Link
          href={link.href}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 font-medium hover:bg-blue-50 hover:text-blue-700 active:bg-blue-100 transition-colors duration-150"
        >
          <span className="size-1.5 rounded-full bg-blue-400" />
          {link.title}
        </Link>
      </SheetClose>
    ))}
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