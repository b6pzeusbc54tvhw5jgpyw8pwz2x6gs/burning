'use server'

import crypto from 'node:crypto'
import axios from "axios"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const WHOOING_APP_ID = process.env.WHOOING_APP_ID || ''
const WHOOING_APP_SECRET = process.env.WHOOING_APP_SECRET || ''
const WHOOING_URL = process.env.WHOOING_URL || 'https://whooing.com'

export const getWhooingAPI = () => {
  const cookieStore = cookies()
  const userId = cookieStore.get('user_id')?.value
  const token = cookieStore.get('token')?.value
  const token_secret = cookieStore.get('token_secret')?.value

  if (!userId) {
    throw new Error('WAM_NOT_LOGGED_IN: not logged in yet')
  }

  const signiture = crypto.createHash('sha1')
    .update(`${WHOOING_APP_SECRET}|${token_secret}`)
    .digest('hex')

  const xApiKey = [
    `app_id=${WHOOING_APP_ID}`,
    `token=${token}`,
    `signiture=${signiture}`,
    `nounce=${+new Date()}-${Math.random()}`,
    `timestamp=${Math.floor(Date.now() / 1000)}`,
  ].join(',')

  const whooingAPI = axios.create({
    baseURL: WHOOING_URL,
    headers: {
      'x-api-key': xApiKey,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  })

  return whooingAPI
}
