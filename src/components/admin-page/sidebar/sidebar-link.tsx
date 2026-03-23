import { Button } from "@/components/ui/button"
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
    <Button
      variant={isActive ? 'secondary' : 'ghost'}
      onClick={onClose}
      asChild
    >
      <Link
        href={href}
        className={cn(
          'w-full justify-start gap-3 px-3',
          isActive
            ? 'font-semibold'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        {icon}
        <span>{label}</span>
      </Link>
    </Button>
  )
}