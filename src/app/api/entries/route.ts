import { getAllEntries } from "@/server/actions/whooing"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams

  const sectionId = searchParams.get('sectionId')
  const accountId = searchParams.get('accountId')
  const accountOpenDate = searchParams.get('accountOpenDate')
  const accountCloseDate = searchParams.get('accountCloseDate')
  const initialDate = searchParams.get('initialDate')
  if (!sectionId || !accountId || !accountOpenDate || !accountCloseDate) {
    return NextResponse.error()
  }

  const rrr = await getAllEntries({
    sectionId,
    accountId,
    accountOpenDate: Number(accountOpenDate),
    accountCloseDate: Number(accountCloseDate),
    initialDate: initialDate ? Number(initialDate) : undefined,
  })

  return NextResponse.json(rrr)
}
