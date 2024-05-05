import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

/**
 * key는 `${sectionId}-${accountId}-${itemName}` 형태
 * value는 아래 타입들 중 하나의 ticker.
 * - auto-ticker: ex) 005930.KS
 * - manual-ticker: ex) manual-156156-1234-TIGER-나스닥100
 * - non-ticker: ex) non-ticker-156156-1234-TIGER-나스닥100
 *
 * - 아직 위 3개 중 어떤 것인지 결정되지 않은 경우,
 * - undefined-ticker: ex) undefined-156156-1234-TIGER-나스닥100
 *
 * TODO: tickerName이 아니라 nonTicker 타입이 있어서 itemId 로 가는게 좋을 것 같음.
 */
export const tickerNameByItemKeyAtom = atomWithStorage<Record<string, string>>('ticker-name-by-item-name', {})

export const addTickerNameAtom = atom(null, async (get, set, itemKey: string, ticker: string) => {
  set(tickerNameByItemKeyAtom, prev => ({ ...prev, [itemKey]: ticker }))
})

export const removeTickerNameAtom = atom(null, async (get, set, itemKey: string ) => {
  set(tickerNameByItemKeyAtom, prev => {
    const { [itemKey]: _, ...rest } = prev
    return rest
  })
})

export const externalWalletItemsAtom = atomWithStorage<string[]>('external-wallet-items', [])

export const toggleExternalWalletItemAtom = atom(null, async (get, set, itemId: string) => {
  set(externalWalletItemsAtom, prev => {
    if (prev.includes(itemId)) {
      return prev.filter(id => id !== itemId)
    }

    return [...prev, itemId]
  })
})
