
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

export const getManualTicker = (itemKey: string) => {
  return `manual-${itemKey}`.replace(/ /g, '-')
}

/**
 * non-ticker 타입 항목의 ticker를 반환.
 * ticker는 항목의 key 같은 것. 그래서 non-ticker도 ticker가 있다.
 * (TODO: 이름을 바꿔야하나)
 */
export const getNonTickerTypeTicker = (itemKey: string) => {
  return `non-ticker-${itemKey}`.replace(/ /g, '-')
}

export const isManualTicker = (ticker?: string): ticker is string => !!ticker?.startsWith('manual-')
export const isNonTickerTypeTicker = (ticker?: string): ticker is string => !!ticker?.startsWith('non-ticker-')
export const isUndefinedTicker = (ticker?: string): ticker is undefined => typeof ticker === 'undefined'
export const isAutoTicker = (ticker?: string): ticker is string => !isManualTicker(ticker) && !isNonTickerTypeTicker(ticker) && !isUndefinedTicker(ticker)
