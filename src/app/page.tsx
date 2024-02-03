// import { useTransition } from 'react'
"use server"

import Image from "next/image"
import { getAccounts, getSections, getUser } from '@/server/actions/whooing'
import { LoginButton } from "@/components/LoginButton"
import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "../components/ui/card"

export default async function Home() {
  const user = await getUser()
  // const { data: accounts } = await getAccounts()
  const sections = await getSections()
  console.log("🚀 ~ Home ~ sections:", sections)

  return (
    <main className="flex min-h-screen flex-col gap-2">
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
        섹션들
      </h2>

      {sections.map(s => (
        <Card
          key={s.section_id}
          className="w-full"
        >
          <CardHeader>
            <CardTitle>
              <Link
                href={`/sections/${s.section_id}`}
                key={s.section_id}
              >
                {s.title}
              </Link>

            </CardTitle>
            <CardDescription>{s.memo}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </main>
  )
}
