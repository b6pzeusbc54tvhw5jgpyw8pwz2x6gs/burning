'use client'

import Link from 'next/link'
import { LoginButton } from "./LoginButton"
import { useUser } from "../data/hooks"
import { ModeToggle } from './ui/mode-toggle'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from 'react'

export function GlobalNav() {
  const { data: user } = useUser()

  const [mouseOn, setMouseOn] = useState(false)

  return (
    <header className='border-b-gray-400 border-b-2 h-16 w-full'>
      <nav className="grid h-16 w-full grid-cols-2 items-center justify-center px-8 py-2">

        <div className="flex justify-start text-2xl">
          <Link
            href="/"
            onMouseEnter={() => setMouseOn(true)}
            onMouseLeave={() => setMouseOn(false)}
          >
            {mouseOn ? '🏠 버닝' : '🔥 버닝'}
          </Link> - 후잉 연동 투자 자산 관리 시스템
        </div>

        <div className="flex justify-end gap-x-2">
          <ModeToggle />
          <Avatar >
            <AvatarImage src={user?.image_url} alt="user profile"/>
            <AvatarFallback>A</AvatarFallback>
          </Avatar>
        </div>
      </nav>
    </header>
  )
}

export default GlobalNav
