import axios from "axios"
import dayjs from "dayjs"
import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

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
})

/**
 * 비상장 주식이나 비트 모빅 같이 Yahoo API로 1주당 가격을 불러올 수 없는 자산의
 * 티커별 날짜별 가격 정보를 저장하는 atom.
 */
export const manualTickerItemHistoricalsByTickerAtom = atomWithStorage<
  Record<string, Record<string, ItemHistorical>>
>('manual-ticker-item-historicals-by-ticker', {})

export const putManualTickerItemHistoricalAtom = atom(null, async (get, set, ticker: string, dateOrTimestamp: Date | number, price: number) => {
  const dateStr = dayjs(dateOrTimestamp).format('YYYYMMDD')

  set(manualTickerItemHistoricalsByTickerAtom, prev => {

    return {
      ...prev,
      [ticker]: {
        ...prev[ticker],
        [dateStr]: [price, price, price, price, price, 0],
      },
    }
  })
})

export const deleteManualTickerItemHistoricalAtom = atom(null, async (get, set, ticker: string, dateOrTimestamp: Date | number) => {
  const dateStr = dayjs(dateOrTimestamp).format('YYYYMMDD')

  set(manualTickerItemHistoricalsByTickerAtom, prev => {
    const newHistoricals = { ...prev[ticker] }
    delete newHistoricals[dateStr]
    return {
      ...prev,
      [ticker]: newHistoricals,
    }
  })
})

/**
 * 1주의 가격이 있는게 아닌 전체 평가액의 수익률로 관리하는 자산의 가격을 저장하는 atom.
 * 예를들어 펀드나 예금, 혹은 계좌 내 주식을 따로 관리하지 않고 계좌를 통으로 관리하는 경우.
 */
export const nonTickerItemHistoricalsByTickerAtom = atomWithStorage<
  Record<string, Record<string, ItemHistorical>>
>('non-ticker-item-historicals-by-ticker', {})

export const putNonTickerItemHistoricalAtom = atom(null, async (get, set, ticker: string, dateOrTimestamp: Date | number, price: number) => {
  const dateStr = dayjs(dateOrTimestamp).format('YYYYMMDD')

  set(nonTickerItemHistoricalsByTickerAtom, prev => {
    return {
      ...prev,
      [ticker]: {
        ...prev[ticker],
        // ticker price와 같은 타입을 쓸 이유가 없음. number[]가 아닌 number 타입이면 족함.
        [dateStr]: [price, price, price, price, price, 0],
      },
    }
  })
})

export const deleteNonTickerItemHistoricalAtom = atom(null, async (get, set, ticker: string, dateOrTimestamp: Date | number) => {
  const dateStr = dayjs(dateOrTimestamp).format('YYYYMMDD')

  set(nonTickerItemHistoricalsByTickerAtom, prev => {
    const newHistoricals = { ...prev[ticker] }
    delete newHistoricals[dateStr]
    return {
      ...prev,
      [ticker]: newHistoricals,
    }
  })
})
