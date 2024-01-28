import ms from 'ms'
import { Account } from './types/account.type'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)

export const getMaximumEndDate = (account: Account) => {
  const strDate = String(account.open_date)
  const yyyyMMdd = `${strDate.slice(0, 4)}-${strDate.slice(4, 6)}-${strDate.slice(6, 8)}`
  const date = new Date(`${yyyyMMdd}T00:00:00.000Z`)
  date.setUTCFullYear(date.getUTCFullYear() + 1)

  const maximumEndDate = new Date(date.getTime() - ms('1d'))

  let result = Number(maximumEndDate.toISOString().split('T')[0].replace(/-/g, ''))
  if (result > account.close_date) {
    result = account.close_date
  }

  const today = Number(dayjs().tz('Asia/Seoul').format().slice(0, 10).replace(/-/g, ''))
  if (result > today) {
    result = today
  }

  return result
}

// example: [TICKER=005930.KS]
export const getTicket = (memo: string) => {
  const match = memo.match(/\[TICKER=(.+)\]/)
  if (!match) return null

  return match[1]
}
