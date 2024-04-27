"use server"

import { dateSum } from '@/utils/date.util'
// import { createSafeActionClient } from "next-safe-action"
import yahooFinance from 'yahoo-finance2'

// export const action = createSafeActionClient()

export const getRealtimeTickerPrice = async (ticker: string) => {
  const res = await yahooFinance.quoteSummary(ticker, {
    modules: ['price'],
  })
  // console.log("🚀 ~ getTickerPrice ~ price:", ticker, res.price)

  if (!res.price?.regularMarketPrice) {
    throw new Error('no price')
  }

  if (res.price.currency !== 'KRW' && res.price.exchange !== 'KSC') {
    const res2 = await yahooFinance.quoteSummary(`${res.price.currency}KRW=X`, {
      modules: ['price'],
    })

    const rate = res2?.price?.marketState === 'CLOSED'
      ? res2.price.regularMarketPreviousClose
      : res2?.price?.regularMarketPrice

    if (!rate) {
      throw new Error('no rate')
    }

    // 소수점 2번째 자리까지만. 3번째 자리에서 반올림
    return Math.round(res.price.regularMarketPrice * rate * 100) / 100
  }

  return res.price.regularMarketPrice
}

interface ItemHistorical {
  date: string
  open: number
  high: number
  low: number
  close: number
  adjClose: number
  volume: number
}

type ItemHistoricalByDate = Record<string, [number, number, number, number, number | undefined, number]>

/**
 *
 * @param ticker ex: AAPL
 * @param from ex: 2022-01-01
 * @param to ex: 2022-01-31
 * @returns
 */
export const listTickerPricesByRange = async (ticker: string, from: string, to: string) => {
  const result = await yahooFinance.historical(ticker, {
    period1: from,
    period2: dateSum(to, 1),
    interval: '1d',
  })

  const itemHistoricalByDate = result.reduce<ItemHistoricalByDate>((acc, cur) => {
    const date = cur.date.toISOString().split('T')[0].replace(/-/g, '')
    const open = cur.open
    const high = cur.high
    const low = cur.low
    const close = cur.close
    const adjClose = cur.adjClose
    const volume = cur.volume

    return {
      ...acc,
      [date]: [open, high, low, close, adjClose, volume],
    }

  }, {} as ItemHistoricalByDate)

  return itemHistoricalByDate
}
