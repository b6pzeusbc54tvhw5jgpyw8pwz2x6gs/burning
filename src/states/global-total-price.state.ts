import { atom } from 'jotai'
import { TableRowItem } from '../types/item.type'
import { sum } from 'radash'

export const globalTotalPriceAtom = atom<number>(0)

export const setGlobalTotalPriceAtom = atom(
  null,
  (get, set, items: TableRowItem[]) => {
    set(globalTotalPriceAtom, sum(items.map(item => item.totalPrice)))
  }
)
