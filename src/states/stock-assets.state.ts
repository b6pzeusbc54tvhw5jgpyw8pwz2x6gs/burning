import { atomWithStorage } from 'jotai/utils'
import { Account } from '../types/account.type'

export interface StockAsset {
  sectionId: string
  account: Account
  item?: string
  type?: '자산' | '거래처'
  ticker?: string
  from?: string  // 어느 계좌에서 샀는지
}

export const stockAssetsAtom = atomWithStorage<StockAsset[]>('stock-assets', [])
