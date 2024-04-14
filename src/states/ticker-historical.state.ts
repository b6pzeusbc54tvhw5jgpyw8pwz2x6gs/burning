import axios from "axios"
import dayjs from "dayjs"
import { atom } from "jotai"

type Open = number
type High = number
type Low = number
type Close = number
type AdjClose = number | undefined
type Volume = number

// 종목의 일별 가격 정보
export type ItemHistorical = [Open, High, Low, Close, AdjClose, Volume]
export type ItemHistoricalByDate = Record<string, ItemHistorical> // key는 date. ex: 20220101

// TODO: Ticker가 많아지면 매번 fetch하는 것은 부담이되므로,
// 브라우저에 캐싱을 해두는 것이 좋을 것 같음.
export const itemHistoricalsByTickerLoadingAtom = atom<Record<string, boolean>>({}) // key는 ticker
export const itemHistoricalsByTickerAtom = atom<Record<string, ItemHistoricalByDate>>({}) // key는 ticker

export const putAndFetchItemHistoricalsAtom = atom(null, async (get, set, ticker: string) => {
  if (get(itemHistoricalsByTickerLoadingAtom)[ticker]) return

  // 이미 있으면 fetch하지 않음. 지금은 정적으로 2년 이상 데이터만 가져오도록 되어 있음.
  // 동적 데이터를 지원하면 이 부분도 날짜를 비교해서 fetch하도록 수정해야 함.
  if (get(itemHistoricalsByTickerAtom)[ticker]) return

  set(itemHistoricalsByTickerLoadingAtom, prev => ({ ...prev, [ticker]: true }))

  // TODO: 지금은 거의 정적으로 현재로부터 2년 이상 데이터만 가져오도록 되어 있음.
  const from = '2022-01-01'
  const to = dayjs().format('YYYY-MM-DD')
  const url = `/api/item-historicals/${ticker}?from=${from}&to=${to}`
  const { data } = await axios.get<ItemHistoricalByDate>(url)

  set(itemHistoricalsByTickerAtom, prev => ({ ...prev, [ticker]: data }))
  set(itemHistoricalsByTickerLoadingAtom, prev => ({ ...prev, [ticker]: false }))
  console.log(get(itemHistoricalsByTickerAtom))
})
