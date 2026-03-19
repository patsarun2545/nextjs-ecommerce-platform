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
          className='size-8 rounded-full'
        >
          <UserAvatarSmall user={user} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='end'
        sideOffset={4} // px
        className='w-56'
      >
        <DropdownMenuLabel className='flex flex-col items-center gap-2'>
          <UserDropdownAvatar user={user} />
          <span>สวัสดี, {user.name || user.email}</span>
        </DropdownMenuLabel>

        <DropdownMenuItem
          className='cursor-pointer'
          asChild
        >
          <Link href='/profile'>โปรไฟล์ของฉัน</Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          className='cursor-pointer'
          asChild
        >
          <Link href='/cart'>
            <span>ตะกร้าของฉัน</span>
            <Badge className='ml-auto'>0</Badge>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          className='cursor-pointer'
          asChild
        >
          <Link href='/my-orders'>ประวัติการสั่งซื้อ</Link>
        </DropdownMenuItem>

        {user.role === 'Admin' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className='cursor-pointer'
              asChild
            >
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