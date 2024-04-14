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

  // let result = Number(maximumEndDate.toISOString().split('T')[0].replace(/-/g, ''))
  let result = Number(dayjs(maximumEndDate).format('YYYYMMDD'))

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

export const getTicketByMemos = (memo: string[]) => {
  while (memo.length > 0) {
    const ticker = getTicket(memo.shift()!)
    if (ticker) return ticker
  }

  return null
}

export const formatCurrency = (value: number) => {
  return value.toLocaleString()
}

export const relativeDate = (value: string, base?: string) => {
  const yyyyMMdd = value.split('.')[0]
  const yyyy = yyyyMMdd.slice(0, 4)
  const MM = yyyyMMdd.slice(4, 6)
  const dd = yyyyMMdd.slice(6, 8)

  const date = dayjs(`${yyyy}-${MM}-${dd}`)

  const now = base || dayjs().format()
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

export const getManualTicker = (sectionId: string, accountId: string, itemName: string) => {
  const onlyItemName = itemName.split('(')[0]
  return `manual-${sectionId}-${accountId}-${onlyItemName}`.replace(/ /g, '-')
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
export const dateSum = <T extends string | number | Date>(base: T, days: number): T => {
  const baseStr = base instanceof Date
    ? dayjs(base).format('YYYYMMDD') // 로컬 시간의 날짜가 나옴
    : String(base)

  const date = new Date(`${baseStr.slice(0, 4)}-${baseStr.slice(4, 6)}-${baseStr.slice(6, 8)}`)
  date.setHours(0, 0, 0, 0)

  const result = new Date(date.getTime() + ms(`${days}d`))

  return typeof base === 'string'
    ? dayjs(result).format('YYYYMMDD') as T
    : typeof base === 'number'
      ? (Number(dayjs(result).format('YYYYMMDD')) as T)
      : (result as T)
}
