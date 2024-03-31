import { atomWithStorage } from 'jotai/utils'
import { atom } from 'jotai'
import { Account } from '../types/account.type'

export interface StockAsset {
  sectionId: string
  account: Account
  // item?: string
  // type?: '자산' | '거래처'
  // ticker?: string
  // from?: string  // 어느 계좌에서 샀는지
}

export const stockAssetsAtom = atomWithStorage<StockAsset[]>('stock-assets', [])

export const toggleStockAssetAtom = atom(null, (get, set, stockAsset: StockAsset) => {
  const prev = get(stockAssetsAtom)
  const found = prev.find(p => p.account.account_id === stockAsset.account.account_id)
  if (!found) {
    set(stockAssetsAtom, [...prev, stockAsset])
  } else {
    set(stockAssetsAtom, prev.filter(p => p.account.account_id !== stockAsset.account.account_id))
  }
})
