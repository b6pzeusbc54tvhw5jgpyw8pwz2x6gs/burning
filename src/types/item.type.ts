export interface TableRowItem {
  assetType: 'money' | 'stock'
  assetCategory: string // normal, client, floating 등

  sectionId: string
  accountId: string

  assetGroup: string  // 투자 자산으로 선택한 자산은 자산의 이름이고, 현금성 자산으로 선택하면 "현금성 자산"으로 표시.
  name: string
  perAccount: {  // 계좌별 수량
    [from: string]: number
  }
  totalQty: number
  totalPrice: number
  lastItemDate: string

  ticker?: string
  tickerFromMemos?: string

  tickerPrice: number | null
  evaluatedPrice: number | null
  evaluatedProfit: number | null
}

/*
 * date 일자의 하루 매수/매도 정보
 */
export interface DateTradingInfo {
  date: string         // 날짜. ex: 2021-01-01
  openQty: number      // 시작 수량
  // closeQty: number     // 종료 수량. 계산하면 되서 필요 없음
  openQtyPerAccount: {  // 계좌별 시작 수량
    [from: string]: number
  }
  closeQtyPerAccount: {  // 계좌별 끝 수량
    [from: string]: number
  }

  buy: {
    qty: number       // 매수 수량
    price: number     // 주당 매수 가격
    accountId: string // 매수한 계좌
  }[]
  sell: {
    qty: number       // 매도 수량
    price: number     // 주당 매도 가격
    accountId: string // 매도한 계좌
  }[]

  lastWrittenPrice: number  // 가계부에 기록된 마지막 가격

  // 이건 yahoo 에서 가져오는 API 결과 데이터로 따로 가지고 있으면 될듯.
  // openPrice: number    // 시작 가격
  // closePrice: number   // 종가
  // highPrice: number    // 최고가
  // lowPrice: number     // 최저가
  // volume: number       // 거래량

  // 이건 두 데이터의 파생 데이터.
  // totalPrice: number   // (openQty + sum(buy qty) - sum(sell qty)) x closePrice
}

export interface InvestableItem {
  sectionId: string    // 후잉 section id
  accountId: string    // item이 들어있는 account id
  itemName: string     // TIGER 나스닥100
  assetType: 'money' | 'stock'
  assetCategory: string // normal, client, floating 등
  tradingInfos: DateTradingInfo[]
  ticker?: string       // 156156.KS
  tickerFromMemos?: string // 메모에서 추출한 ticker. Ticker 입력 받을 때 자동 완성 시켜주는 용도.
}
