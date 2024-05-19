import { atomWithStorage } from 'jotai/utils'
import { atom } from 'jotai'
import { Account } from '../types/account.type'

export interface Asset {
  sectionId: string
  account: Account
  // item?: string
  // type?: '자산' | '거래처'
  // ticker?: string
  // from?: string  // 어느 계좌에서 샀는지
}

export const stockAssetsAtom = atomWithStorage<Account[]>('stock-assets', [])

export const toggleStockAssetAtom = atom(null, (get, set, account: Account) => {
  const prev = get(stockAssetsAtom)
  const found = prev.find(p => p.sectionId === account.sectionId && p.account_id === account.account_id)
  if (!found) {
    set(stockAssetsAtom, [...prev, account])
  } else {
    set(stockAssetsAtom, prev.filter(p => p.sectionId !== account.sectionId || p.account_id !== account.account_id))
  }
})

export const removeStockAssetAtom = atom(null, (get, set, account: Account) => {
  set(stockAssetsAtom, prev => prev.filter(p => p.sectionId !== account.sectionId || p.account_id !== account.account_id))
})

export const moneyAssetsAtom = atomWithStorage<Account[]>('money-assets', [])

export const toggleMoneyAssetAtom = atom(null, (get, set, account: Account) => {
  const prev = get(moneyAssetsAtom)
  const found = prev.find(p => p.sectionId === account.sectionId && p.account_id === account.account_id)
  if (!found) {
    set(moneyAssetsAtom, [...prev, account])
  } else {
    set(moneyAssetsAtom, prev.filter(p => p.sectionId !== account.sectionId || p.account_id !== account.account_id))
  }
})

export const removeMoneyAssetAtom = atom(null, (get, set, account: Account) => {
  set(moneyAssetsAtom, prev => prev.filter(p => p.sectionId !== account.sectionId || p.account_id !== account.account_id))
})
