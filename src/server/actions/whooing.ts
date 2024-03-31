"use server"

import axios from "axios"
import { redirect } from "next/navigation"
import { z } from 'zod'
import { getWhooingAPI } from "@/util.server"
import { zUser } from "../../types/user.type"
import { Account, zAccount, zAccountType, zAllAccounts } from '../../types/account.type'
import { zSection } from "../../types/section.type"
import { Entry, zEntry } from "../../types/entry.type"
import { getMaximumEndDate } from "../../util"

const APP_URL = process.env.APP_URL
const WHOOING_APP_ID = process.env.WHOOING_APP_ID || ''
const WHOOING_APP_SECRET = process.env.WHOOING_APP_SECRET || ''
const WHOOING_URL = process.env.WHOOING_URL || 'https://whooing.com'

export async function requestToken() {
  const query = new URLSearchParams({
    app_id: WHOOING_APP_ID,
    app_secret: WHOOING_APP_SECRET,
    // TODO: 이거 있어야 하나?
    callback: new URL('/api/callback', APP_URL).toString(),
  }).toString()

  const url = new URL(`/app_auth/request_token?${query}`, WHOOING_URL).toString()
  const res = await axios.get(url)
  const token = res.data.token

  const query2 = new URLSearchParams({
    token,
    callbackuri: new URL('/api/callback', APP_URL).toString(),
  }).toString()

  redirect(`${WHOOING_URL}/app_auth/authorize?${query2}`)
}

export async function getUser() {
  const whooingAPI = getWhooingAPI()
  const res = await whooingAPI.get('/api/user.json_array')
  if (res.data.code !== 200) {
    throw new Error(`${res.data.code} ${res.data.message}`)
  }

  return zUser.parse(res.data.results)
}

export async function getSections() {
  const whooingAPI = getWhooingAPI()
  const res = await whooingAPI.get('/api/sections.json_array')

  return zSection.array().parse(res.data.results)
}

export const getAllAccounts = async (sectionId: string) => {
  const whooingAPI = getWhooingAPI()
  const params = { section_id: sectionId }
  const res = await whooingAPI.get('/api/accounts.json_array', { params })

  const addedSectionId = Object.keys(res.data.results).reduce((acc, key) => {
    return {
      ...acc,
      [key]: res.data.results[key].map((a: any) => ({ ...a, sectionId }))
    }
  }, {})

  return zAllAccounts.parse(addedSectionId)
}

export const getEntries = async (params: {
  sectionId: string
  accountId: string
  startDate: number
  endDate: number
}) => {
  const whooingAPI = getWhooingAPI()
  const res = await whooingAPI.get('/api/entries.json_array', { params: {
    section_id: params.sectionId,
    account: 'assets',
    account_id: params.accountId,
    start_date: params.startDate,
    end_date: params.endDate,
    limit: 9999,
  }})

  if (res.data.code !== 200) {
    throw new Error(`${res.data.code} ${res.data.message}`)
  }

  return zEntry.array().parse(res.data.results.rows)
}

export async function getAllEntries(account: Account, initialDate?: number) {
  let startDate = initialDate || Number(account.open_date)
  let endDate = getMaximumEndDate(account)
  let result: Entry[] = []

  while (startDate <= endDate) {
    const data = await getEntries({
      sectionId: account.sectionId,
      accountId: account.account_id,
      startDate,
      endDate,
    })

    result = [...result, ...data.reverse()!]

    startDate = endDate + 1
    endDate = getMaximumEndDate(account)
  }

  return result
}

export async function postEntry(entry: {
  sectionId: string
  entryDate: number
  lAccount: 'assets' | 'expenses'
  lAccountId: string
  rAccount: 'assets' | 'income'
  rAccountId: string
  item: string
  money: number
  memo?: string
  attachmentIds?: string[]
}) {
  const whooingAPI = getWhooingAPI()
  const body = {
    section_id: entry.sectionId,
    entry_date: entry.entryDate,
    l_account: entry.lAccount,
    l_account_id: entry.lAccountId,
    r_account: entry.rAccount,
    r_account_id: entry.rAccountId,
    item: entry.item,
    money: entry.money,
    memo: entry.memo,
    attachment_ids: entry.attachmentIds?.join(','),
  }

  const res = await whooingAPI.post('/api/entries.json', body)
  if (res.data.code !== 200) {
    throw new Error(`${res.data.code} ${res.data.message}`)
  }

  return res.data
}
