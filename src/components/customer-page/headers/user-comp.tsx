'use client'

import Link from 'next/link'
import { SheetClose } from '@/components/ui/sheet'
import { useSignout } from '@/hooks/use-sign-out'
import { UserType } from '@/types/user'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogIn, UserPlus, LogOut } from 'lucide-react'

interface UserCompProps {
  user: UserType
}

export const AuthButtons = () => (
  <div className='flex flex-col gap-3 px-4'>
    <SheetClose asChild>
      <Link
        href='/auth/signup'
        className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors duration-150 shadow-md shadow-blue-200"
      >
        <UserPlus size={16} />
        ลงทะเบียน
      </Link>
    </SheetClose>
    <SheetClose asChild>
      <Link
        href='/auth/signin'
        className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl border-2 border-blue-200 text-blue-700 font-semibold hover:bg-blue-50 hover:border-blue-300 transition-colors duration-150"
      >
        <LogIn size={16} />
        เข้าสู่ระบบ
      </Link>
    </SheetClose>
  </div>
)

export const SignoutButton = ({ isMobile = false }) => {
  const { isPending, handleSignout } = useSignout()

  if (isMobile) {
    return (
      <SheetClose asChild>
        <button
          disabled={isPending}
          onClick={handleSignout}
          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-red-50 text-red-600 font-semibold border border-red-100 hover:bg-red-100 transition-colors duration-150 disabled:opacity-50"
        >
          <LogOut size={16} />
          ออกจากระบบ
        </button>
      </SheetClose>
    )
  }

  return (
    <button
      disabled={isPending}
      onClick={handleSignout}
      className="flex items-center justify-center gap-2 w-full px-3 py-2.5 mt-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100 hover:bg-red-100 transition-colors duration-150 disabled:opacity-50"
    >
      <LogOut size={14} />
      ออกจากระบบ
    </button>
  )
}

export const UserAvatar = ({ user }: UserCompProps) => (
  <div className='px-4'>
    <div className='flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-b from-blue-50 to-white border border-blue-100'>
      <div className="relative">
        <Image
          alt={user.name || 'Profile'}
          src={user.picture || '/images/no-user.png'}
          width={80}
          height={80}
          priority
          className='rounded-full border-4 border-white shadow-lg shadow-blue-100 object-cover'
        />
        <span className="absolute bottom-0 right-0 size-4 rounded-full bg-green-400 border-2 border-white" />
      </div>
      <div className="text-center">
        <p className='text-base font-bold text-slate-800'>{user.name || user.email}</p>
        {user.name && <p className='text-xs text-slate-500 mt-0.5'>{user.email}</p>}
      </div>
    </div>
  </div>
)

export const UserAvatarSmall = ({ user }: UserCompProps) => (
  <Avatar className='border-2 border-blue-200 shadow-sm'>
    <AvatarImage src={user.picture || undefined} alt={user.name || 'User'} />
    <AvatarFallback className='bg-gradient-to-br from-blue-600 to-blue-500 text-white text-xs font-bold'>
      {user.name
        ? user.name.slice(0, 2).toUpperCase()
        : user.email.slice(0, 2).toUpperCase()}
    </AvatarFallback>
  </Avatar>
)

export const UserDropdownAvatar = ({ user }: UserCompProps) => (
  <Avatar className='size-16 border-4 border-blue-100 shadow-md'>
    <AvatarImage src={user.picture || undefined} alt={user.name || 'User'} />
    <AvatarFallback className='text-lg bg-gradient-to-br from-blue-600 to-blue-500 text-white font-bold'>
      {user.name
        ? user.name.slice(0, 2).toUpperCase()
        : user.email.slice(0, 2).toUpperCase()}
    </AvatarFallback>
  </Avatar>
)