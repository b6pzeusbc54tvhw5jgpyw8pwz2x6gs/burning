'use client'

import Link from 'next/link'
import { LoginButton } from "./LoginButton"
import { useUser } from "../data/hooks"
import { ModeToggle } from './ui/mode-toggle'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function GlobalNav() {
  const { data: user } = useUser()

  return (
    <header
      className='border-b-gray-400 border-b-2'
    >
      <nav className="grid h-16 w-full grid-cols-2 items-center justify-center px-8 py-2">

        <div className="flex justify-start text-2xl">
        후잉 - 투자 자산 관리
        </div>

        <div className="flex justify-end gap-x-2">
          <ModeToggle />
          {user ? (
            <Avatar>
              <AvatarImage src={user.image_url} alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ) : (
            <LoginButton />
          )}
        </div>
      </nav>
    </header>
  )
}

export default GlobalNav
