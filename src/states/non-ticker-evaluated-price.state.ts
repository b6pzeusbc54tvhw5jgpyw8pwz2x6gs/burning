import { TableRowItem } from '@/types/item.type'
import { updateItem } from '@/util'
import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

interface NonTickerEvaluatedPrice {
  sectionId: string
  accountId: string
  itemName: string
  updatedAt: number
  source: 'manual'
  evaluatedPrice: number
}

export const nonTickerEvaluatedPricesAtom = atomWithStorage<NonTickerEvaluatedPrice[]>('non-ticker-evaluated-prices', [])

export const putNonTickerEvaluatedPricesAtom = atom(
  null,
  (get, set, params: {
    sectionId: string
    accountId: string
    itemName: string
    evaluatedPrice: number
    source: 'manual'
  }) => {
    const { accountId, itemName, evaluatedPrice, sectionId, source } = params
    set(nonTickerEvaluatedPricesAtom, prev => {
      const idx = prev.findIndex(p => (
        p.sectionId === sectionId && p.accountId === accountId && p.itemName === itemName
      ))

      const updatedItem = {
        ...prev[idx],
        sectionId,
        accountId,
        itemName,
        evaluatedPrice,
        source,
        updatedAt: Date.now(),
      }

      return updateItem(prev, updatedItem, idx)
    })
  }
)

export const removeNonTickerEvaluatedPriceAtom = atom(
  null,
  (get, set, item: TableRowItem) => {
    const { accountId, name, sectionId } = item
    const prev = get(nonTickerEvaluatedPricesAtom)
    const idx = prev.findIndex(p => (
      p.sectionId === sectionId
        && p.accountId === accountId
        && p.itemName === name
    ))
    if (idx < 0) return

    set(nonTickerEvaluatedPricesAtom, [
      ...prev.slice(0, idx),
      ...prev.slice(idx + 1),
    ])
  }
)

