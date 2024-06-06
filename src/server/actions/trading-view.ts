// @ts-ignore
import TradingView from '@mathieuc/tradingview'
import dayjs from 'dayjs'
import ms from 'ms'
/**
 * This example tests fetching chart data of a number
 * of candles before or after a timestamp
 */

type Period = {
  time: number // 1715547600
  open: number // 4.49
  close: number // 4.488
  max: number // 4.496
  min: number // 4.459
  volume: number // NaN or number (금리 차트 같은 경우는 NaN)
}

type ItemHistoricalByDate = Record<string, [number, number, number, number, number | null, number | null]>

// copilot이 만든 코드인데 테스트 해봐야함
// const getPeriods = async (ticker: string, from: string, to: string) => {
//   const client = new TradingView.Client()
//   const chart = new client.Session.Chart()
//   chart.setMarket(ticker, {
//     timeframe: '1D',
//     to: new Date(to).getTime() / 1000,
//     from: new Date(from).getTime() / 1000,
//   })

//   const periods = await new Promise<number>((resolve) => {
//     chart.onUpdate(() => {
//       resolve(chart.periods)
//       client.end()
//     })
//   })

//   return periods
// }

const getPeriods = (ticker: string, from: string, to: string) => new Promise((resolve) => {

  const client = new TradingView.Client()
  const chart = new client.Session.Chart()

  chart.setMarket(ticker, {
    timeframe: '1D',
    range: 20, // Can be positive to get before or negative to get after
    to: new Date('2024-06-01').getTime() / 1000,
    // to: new Date(to).getTime() / 1000,
    // from: new Date(from).getTime() / 1000,

    // timeframe: '240',
    // range: 2, // Can be positive to get before or negative to get after
    // to: 1600000000,
  })

  TradingView.getIndicator('STD;Supertrend').then((indic: any) => {
    console.log("🚀 ~ TradingView.getIndicator ~ indic:", indic)
    console.log(`Loading '${indic.description}' study...`)
    const SUPERTREND = new chart.Study(indic)

    SUPERTREND.onUpdate(() => {
    // console.log('Prices periods:', chart.periods)
    // console.log('Study periods:', SUPERTREND.periods)
      console.log('onUpdate')
      client.end()
        .then(() => resolve(chart.periods))
        .catch(() => console.log('end catch'))
    })
  }).catch(() => console.log('getIndicator catch'))
})

export const listTickerPricesByRange = async (ticker: string, from: string, to: string, convertTo?: 'KRW') => {
  const client = new TradingView.Client()
  const chart = new client.Session.Chart()

  chart.setMarket(ticker, {
    timeframe: '1D',
    // range: 20, // Can be positive to get before or negative to get after
    from: new Date(from).getTime() / 1000,
    to: new Date(to + ms('1d')).getTime() / 1000 ,

    // timeframe: '240',
    // range: 2, // Can be positive to get before or negative to get after
    // to: 1600000000,
  })

  const indic = await TradingView.getIndicator('STD;Supertrend')
  const periods: Period[] = await new Promise((resolve) => {
    const SUPERTREND = new chart.Study(indic)
    SUPERTREND.onUpdate(() => {
      client.end()
      resolve(chart.periods)
    })
  })

  const prefixesNeedPlus1D = [
    'TVC:US02Y', 'TVC:US10Y', 'TVC:US30Y', 'FX_IDC:USDKRW', 'FX_IDC:JPYKRW', 'TVC:DXY',
  ]

  const ItemHistoricalByDate: ItemHistoricalByDate = periods.reduce((acc, cur) => {
    // ticker별 보정값. 거래소별로 다를 수 있음.

    const fixNumber = prefixesNeedPlus1D.some(prefix => ticker.startsWith(prefix)) ? ms('1d') : 0
    const date = new Date(cur.time * 1000 + fixNumber).toISOString().split('T')[0].replace(/-/g, '')

    if (date < from.replace(/-/g, '').slice(0, 8)) return acc
    if (date > to.replace(/-/g, '').slice(0, 8)) return acc

    const open = cur.open
    const high = cur.max
    const low = cur.min
    const close = cur.close
    const adjClose = null
    const volume = cur.volume || null

    return {
      ...acc,
      [date]: [open, high, low, close, adjClose, volume],
      // [`${date}-${cur.time}`]: [open, high, low, close, adjClose, volume],
    }
  }, {} as ItemHistoricalByDate)

  // console.log("🚀 ~ listTikkerPricesByRange ~ ItemHistoricalByDate:", ItemHistoricalByDate)
  return ItemHistoricalByDate
}
