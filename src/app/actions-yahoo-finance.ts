"use server"

import yahooFinance from 'yahoo-finance2'

export const getTickerPrice = async (ticker: string) => {
  const res = await yahooFinance.quoteSummary(ticker, {
    modules: ['price'],
  })
  console.log("🚀 ~ getTickerPrice ~ res:", res)
  if (!res.price?.regularMarketPrice) {
    throw new Error('no price')
  }

  if (res.price.currency !== 'KRW') {
    const res2 = await yahooFinance.quoteSummary(`${res.price.currency}KRW=X`, {
      modules: ['price'],
    })
    console.log("🚀 ~ getTickerPrice ~ res2:", res2)
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
