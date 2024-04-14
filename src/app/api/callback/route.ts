import axios from "axios"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = 'auto'
export const dynamicParams = true
export const revalidate = false
export const fetchCache = 'auto'
export const runtime = 'nodejs'
export const preferredRegion = 'auto'

const WHOOING_APP_ID = process.env.WHOOING_APP_ID || ''
const WHOOING_APP_SECRET = process.env.WHOOING_APP_SECRET || ''

export async function GET(req: NextRequest) {
  console.log('hello callback')
  const searchParams = req.nextUrl.searchParams
  const reqToken = searchParams.get('token')
  const reqPin = searchParams.get('pin')

  const accessTokenRes = await axios.get('https://whooing.com/app_auth/access_token', {
    params: {
      app_id: WHOOING_APP_ID,
      app_secret: WHOOING_APP_SECRET,
      token: reqToken,
      pin: reqPin,
    }
  })

  const { code, token, token_secret, user_id } = accessTokenRes.data

  const cookieStore = cookies()
  cookieStore.set('token', token)
  cookieStore.set('user_id', user_id)
  cookieStore.set('token_secret', token_secret)

  // console.log(accessTokenRes.data)

  redirect('/')
}
