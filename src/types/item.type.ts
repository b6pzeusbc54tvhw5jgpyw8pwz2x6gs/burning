export interface Item {
  sectionId: string
  accountId: string
  name: string
  isFund: boolean
  perAccount: {  // 계좌별 수량
    [from: string]: number
  }
  totalQty: number
  totalPrice: number
  ticker?: string
}
