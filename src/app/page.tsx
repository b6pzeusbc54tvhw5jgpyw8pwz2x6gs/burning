"use server"

import { getSections } from '@/server/actions/whooing'
import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { isLogged } from '@/util.server'
import { ErrorNotLogged } from './error'

export default async function Home() {
  const { result: logged } = await isLogged()
  if (!logged) {
    return <ErrorNotLogged />
  }

  const sections = await getSections()

  return (
    <main className="flex flex-col gap-2 w-full">
      <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl first:mt-0 mb-4">
        가계부 섹션을 선택하세요.
      </h2>

      {sections.map(s => (
        <Card key={s.section_id}>
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
