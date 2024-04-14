import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

interface TickerInfo {
  ticker: string     // id. manual-ticker 는 `manual-ticker-${item.name}` 형태로 저장
  updatedAt: number
  source: 'manual' | 'yahoo'
  price: number
}

export const tickerPricesAtom = atomWithStorage<TickerInfo[]>('ticker-prices', [])

export const putTickerPriceAtom = atom(
  null,
  (get, set, ticker: string, price: number, source: 'manual' | 'yahoo') => {
    if (!ticker) return

    const prev = get(tickerPricesAtom)
    const idx = prev.findIndex(p => p.ticker === ticker)
    if (idx >= 0) {
      set(tickerPricesAtom, [
        ...prev.slice(0, idx),
        { ...prev[idx], price, source, updatedAt: Date.now() },
        ...prev.slice(idx + 1),
      ])
    } else {
      set(tickerPricesAtom, [
        ...prev,
        { ticker, price, source, updatedAt: Date.now() },
      ])
    }
  }
)

export const removeTickerPriceAtom = atom(
  null,
  (get, set, ticker: string) => {
    const prev = get(tickerPricesAtom)
    const idx = prev.findIndex(p => p.ticker === ticker)
    if (idx < 0) return

    set(tickerPricesAtom, [
      ...prev.slice(0, idx),
      ...prev.slice(idx + 1),
    ])
  }
)
