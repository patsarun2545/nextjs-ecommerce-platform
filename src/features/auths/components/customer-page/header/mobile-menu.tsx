import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { UserType } from "@/types/user"
import { Separator } from "@/components/ui/separator"
import { MobileNavLinks } from "./navlinks"

interface MobileMenuProps {
  user: UserType | null
}

export default function MobileMenu({ user }: MobileMenuProps) {
  return (
    <Sheet>

      <SheetTrigger className="md:hidden" asChild>
        <Button variant="ghost" size="icon">
          <Menu className="size-5 text-foreground" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="flex flex-col w-full md:max-w-sm bg-background">
        <SheetHeader className="text-left pb-4">
          <SheetTitle className="text-primary text-xl">{user ? 'โปรไฟล์ของคุณ' : 'ยินดีต้อนรับ'}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 flex flex-col gap-6 py-4">
          {user ? <div>User Picture</div> : <div>Auth Buttons</div>}
          <Separator />
          <div className="px-4">
            <MobileNavLinks />
            {user && user.role === 'Admin' && (
              <div>go to admin page button</div>
            )}
          </div>
        </div>
        {user && (
          <SheetFooter>
            <div> sign out button</div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}