import { listTickerPricesByRange } from "@/server/actions/yahoo-finance"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams

  const ticker = req.nextUrl.pathname.split('/').pop()
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  if (!ticker || !from || !to) {
    return NextResponse.error()
  }

  const rrr = await listTickerPricesByRange(ticker, from, to)

  return NextResponse.json(rrr)
}
