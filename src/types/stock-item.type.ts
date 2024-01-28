import { Account } from './account.type'

export interface StockItem {
  sectionId: string
  account: Account
  item: string
  qty: number
}
