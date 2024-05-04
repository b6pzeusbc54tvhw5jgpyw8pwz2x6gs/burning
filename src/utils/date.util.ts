import ms from 'ms'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault()

/**
 * openDate 기준으로 1년 간의 날짜와 closeDate 중 가까운 날짜를 반환.
 * 1년간의 날짜란 openDate가 20230303이면 20230303 ~ 20240302까지를 의미.
 */
export const getMaximumEndDate = (params: {
  openDate: number
  closeDate: number
}) => {
  const { openDate, closeDate } = params
  const strDate = String(openDate)
  const yyyyMMdd = `${strDate.slice(0, 4)}-${strDate.slice(4, 6)}-${strDate.slice(6, 8)}`

  const date = new Date(`${yyyyMMdd}T00:00:00.000Z`)
  const t1 = date.getTime()
  date.setUTCFullYear(date.getUTCFullYear() + 1)
  const t2 = date.getTime()

  const after1Year = dateSum(openDate, (t2 - t1) / ms('1d'))

  // local 시간대가 서버 시간대가 다를 수 있으므로 여유이게 1일을 더해줌.
  const today = Number(dateSum(dayjs().format('YYYYMMDD'), 1))

  return (
    after1Year > closeDate ? closeDate
      : after1Year > today ? today
        : after1Year
  )
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

// 20240303 같은 base 날짜에 days를 더한 날짜를 반환
// 예를들어 20240303에 3을 더하면 20240306을 반환.
// number 타입은 Timestamp가 아닌 20240303 같은 10진수.
export const dateSum = <T extends string | number | Date>(base: T, days: number): T => {
  const isIncludeHyphen = typeof base === 'string' && base.split('-').length === 3
  const baseStr = base instanceof Date
    ? dayjs(base).format('YYYYMMDD') // 로컬 시간의 날짜가 나옴
    : isIncludeHyphen
      ? String(base.split('-').join(''))
      : String(base)

  // 날짜만 다룰 것 이므로 시간을 0으로 설정
  const date = new Date(`${baseStr.slice(0, 4)}-${baseStr.slice(4, 6)}-${baseStr.slice(6, 8)}`)
  date.setHours(0, 0, 0, 0)

  const result = new Date(date.getTime() + ms(`${days}d`))

  return typeof base === 'string'
    ? dayjs(result).format(isIncludeHyphen ? 'YYYY-MM-DD' : 'YYYYMMDD') as T
    : typeof base === 'number'
      ? (Number(dayjs(result).format('YYYYMMDD')) as T)
      : (result as T)
}

/**
 * 20240303 같은 날짜를 받아서 2024-03-03 형태로 반환
 */
export const includeDash = (value: string | number) => {
  let result = typeof value === 'number' ? String(value) : value
  return `${result.slice(0, 4)}-${result.slice(4, 6)}-${result.slice(6, 8)}`
}
