import Link from "next/link"
import { cn } from "@/lib/utils"

interface SidebarLinkProps {
  href: string
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClose: () => void
}

export default function SidebarLink({ href, icon, label, isActive, onClose }: SidebarLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className={cn(
        "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
        isActive
          ? "bg-slate-100 text-slate-900"
          : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
      )}
    >
      {/* Blue left bar — active only */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-600 rounded-full" />
      )}

      <span className={cn(
        "flex-shrink-0",
        isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
      )}>
        {icon}
      </span>

      <span>{label}</span>
    </Link>
  )
}