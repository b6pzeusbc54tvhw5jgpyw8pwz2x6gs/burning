// import { useTransition } from 'react'
"use server"

import { getAccounts, getSections, getUser } from '@/server/actions/whooing'
import Link from "next/link"

export default async function Home() {
  const { data: sections } = await getSections()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="">
          {sections.map(s => (
            <Link
              href={`/sections/${s.section_id}`}
              key={s.section_id}
              className="bg-gray-200 dark:bg-zinc-800/30 rounded-xl p-4 m-4"
            >
              {s.title}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
