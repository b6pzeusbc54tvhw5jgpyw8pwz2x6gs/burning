// import { useTransition } from 'react'
"use server"

import Image from "next/image"
import { getAccounts, getSections, getUser } from '@/server/actions/whooing'
import { LoginButton } from "@/components/LoginButton"
import Link from "next/link"

export default async function Home() {
  const { data: user } = await getUser()
  // const { data: accounts } = await getAccounts()
  const { data: sections } = await getSections()
  console.log("🚀 ~ Home ~ sections:", sections)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          {user ? (
            <p className="text-2xl font-bold">Hello {user.username}</p>
          ) : (
            <LoginButton />
          )}
        </div>

        <Link href="/sections">
          Sections
        </Link>
      </div>
    </main>
  )
}
