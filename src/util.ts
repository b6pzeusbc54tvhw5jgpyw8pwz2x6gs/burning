import ms from 'ms'
import { Account } from './types/account.type'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault()

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

  const today = Number(dayjs().format().slice(0, 10).replace(/-/g, ''))
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

export const formatCurrency = (value: number) => {
  return value.toLocaleString()
}

export const relativeDate = (value: string) => {
  const yyyyMMdd = value.split('.')[0]
  const yyyy = yyyyMMdd.slice(0, 4)
  const MM = yyyyMMdd.slice(4, 6)
  const dd = yyyyMMdd.slice(6, 8)

  const date = dayjs(`${yyyy}-${MM}-${dd}`)

  const now = dayjs().format()
  const todayYYYY = now.slice(0, 4)
  const todayMM = now.slice(5, 7)
  const todaydd = now.slice(8, 10)

  const today = dayjs(`${todayYYYY}-${todayMM}-${todaydd}`)

  const diff = today.diff(date, 'day')

  if (diff === 0) {
    return '오늘'
  } else if (diff === 1) {
    return '어제'
  } else if (diff === 2) {
    return '그제'
  } else {
    return `${diff}일 전`
  }
}

export const today = () => {
  return Number(dayjs().format('YYYYMMDD'))
}

export const getManualTicker = (itemName: string) => {
  const onlyItemName = itemName.split('(')[0]
  return `manual-ticker-${onlyItemName}`.replace(/ /g, '-')
}

export const updateItem = <T>(acc: T[], cur: T, idx: number) => {
  if (idx === -1) {
    return [...acc, cur]
  }
  return [
    ...acc.slice(0, idx),
    cur,
    ...acc.slice(idx + 1)
  ]
}

// 20240303 같은 base 날짜에 days를 더한 날짜를 반환
// 예를들어 20240303에 3을 더하면 20240306을 반환
export const dateSum = (base: string, days: number) => {
  const date = new Date(`${base.slice(0, 4)}-${base.slice(4, 6)}-${base.slice(6, 8)}T00:00:00.000Z`)
  const result = new Date(date.getTime() + ms(`${days}d`))
  return result.toISOString().split('T')[0].replace(/-/g, '')
}
