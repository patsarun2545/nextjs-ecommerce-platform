'use client'

import { UserType } from "@/types/user";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SheetClose } from "@/components/ui/sheet";
import { useSignout } from "@/hooks/use-signout";
import { Loader2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserCompProps {
  user: UserType;
}
export function UserAvater({ user }: UserCompProps) {
  return (
    <div className="p-4">
      <Card className="border-primary/50">
        <CardContent className="flex flex-col items-center gap-3">
          <div>
            <Image
              alt={user.name || "Profile"}
              src={user.picture || "/images/no-user2.png"}
              width={128}
              height={128}
              priority
              className="rounded-full border-2 border-primary object-cover"
            />
          </div>

          <h2 className="text-xl font-semibold text-card-foreground">
            {user.name || user.email}
          </h2>
        </CardContent>
      </Card>
    </div>
  )
}

export function UserAvatarSmall({ user }: UserCompProps) {
  return (
    <Avatar className="border-2 border-primary">
      {user.picture ? (
        <AvatarImage src={user.picture} alt={user.name || "User"} />
      ) : (
        <AvatarFallback className="bg-primary text-primary-foreground">
          {user.name
            ? user.name.slice(0, 2).toUpperCase()
            : user.email.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      )}
    </Avatar>
  )
}

export function UserDropdownAvatar({ user }: UserCompProps) {
  return (
    <Avatar className="size-16 border-2 border-primary">
      {user.picture ? (
        <AvatarImage
          src={user.picture}
          alt={user.name || "User"}
        />
      ) : (
        <AvatarFallback className="text-lg">
          {user.name
            ? user.name.slice(0, 2).toUpperCase()
            : user.email.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      )}
    </Avatar>
  )
}

export function AuthButton() {
  return (
    <div className="flex justify-center gap-3 w-full">
      <Button size='lg' asChild>
        <SheetClose>
          <Link href='/auth/signup'>ลงทะเบียน</Link>
        </SheetClose>
      </Button>
      <Button variant='outline' size='lg' asChild>
        <SheetClose>
          <Link href='/auth/signin'>เข้าสู่ระบบ</Link>
        </SheetClose>
      </Button>
    </div>
  )
}

export function SignoutButton({ isMobile = false }) {
  const { isPending, handleSignout } = useSignout()

  if (isMobile) {
    return (
      <SheetClose asChild>
        <Button
          variant="destructive"
          size="lg"
          disabled={isPending}
          onClick={handleSignout}
        >
          ออกจากระบบ
        </Button>
      </SheetClose>
    );
  }

  return (
    <Button
      variant="destructive"
      className="w-full mt-4"
      disabled={isPending}
      onClick={handleSignout}
    >
      ออกจากระบบ
    </Button>
  )
}