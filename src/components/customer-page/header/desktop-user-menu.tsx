import { UserType } from "@/types/user";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignoutButton, UserAvatarSmall } from "./user-comp";
import { UserDropdownAvatar } from "./user-comp";
import { Badge } from "@/components/ui/badge";

interface DesktopUserMenuProps {
  user: UserType
}
export default function DesktopUserMenu({ user }: DesktopUserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className="size-8 rounded-full">
          <UserAvatarSmall user={user} />
        </Button>
      </DropdownMenuTrigger>
      {/* Content Dropdown */}
      <DropdownMenuContent
        align="end"
        sideOffset={4}
        className="w-56">

        {/* Label */}
        <DropdownMenuLabel className="flex flex-col items-center gap-3 py-4">
          <UserDropdownAvatar user={user} />
          <span>สวัสดี, {user.name || user.email}</span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Item */}
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="#">
            <span>โปรไฟล์ของคุณ</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="#">
            <span>ตะกล้าของฉัน</span>
            <Badge className="ml-auto">
              0
            </Badge>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href="#">
            <span>ประวัติการสั่งซื้อ</span>
          </Link>
        </DropdownMenuItem>
        {user.role === 'Admin' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href='/admin'>หลังบ้าน</Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <div>
          <SignoutButton />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}