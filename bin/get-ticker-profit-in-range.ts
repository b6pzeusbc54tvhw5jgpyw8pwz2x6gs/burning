/**
 * 실행 방법
 * npx ts-node -r tsconfig-paths/register -P bin/tsconfig.json bin/get-ticker-profit-in-range.ts [ticker] [from] [to]
 *
 * example:
npx ts-node -r tsconfig-paths/register -P bin/tsconfig.json bin/get-ticker-profit-in-range.ts "^IXIC" 2024-03-01 2024-03-31 "나스닥"
npx ts-node -r tsconfig-paths/register -P bin/tsconfig.json bin/get-ticker-profit-in-range.ts "^GSPC" 2024-03-01 2024-03-31 "S&P 500"
npx ts-node -r tsconfig-paths/register -P bin/tsconfig.json bin/get-ticker-profit-in-range.ts "^DJI" 2024-03-01 2024-03-31 "다우존스"
npx ts-node -r tsconfig-paths/register -P bin/tsconfig.json bin/get-ticker-profit-in-range.ts "^RUT" 2024-03-01 2024-03-31 "러셀 2000"
npx ts-node -r tsconfig-paths/register -P bin/tsconfig.json bin/get-ticker-profit-in-range.ts "^KS11" 2024-03-01 2024-03-31 "코스피"
npx ts-node -r tsconfig-paths/register -P bin/tsconfig.json bin/get-ticker-profit-in-range.ts "^KQ11" 2024-03-01 2024-03-31 "코스닥"
npx ts-node -r tsconfig-paths/register -P bin/tsconfig.json bin/get-ticker-profit-in-range.ts "000300.SS" 2024-03-01 2024-03-31 "CSI300"
npx ts-node -r tsconfig-paths/register -P bin/tsconfig.json bin/get-ticker-profit-in-range.ts "BTC-USD" 2024-03-01 2024-03-31 "비트코인"
npx ts-node -r tsconfig-paths/register -P bin/tsconfig.json bin/get-ticker-profit-in-range.ts "ETH-USD" 2024-03-01 2024-03-31 "이더리움"
npx ts-node -r tsconfig-paths/register -P bin/tsconfig.json bin/get-ticker-profit-in-range.ts "TLT" 2024-03-01 2024-03-31 "미국 장기채 ETF(TLT)"
npx ts-node -r tsconfig-paths/register -P bin/tsconfig.json bin/get-ticker-profit-in-range.ts "DX-Y.NYB" 2024-03-01 2024-03-31 "달러 인덱스"
npx ts-node -r tsconfig-paths/register -P bin/tsconfig.json bin/get-ticker-profit-in-range.ts "KRW=X" 2024-03-01 2024-03-31 "달러에 대한 원화 환율"
 */

import { listTickerPricesByRange } from "@/server/actions/yahoo-finance"

const run = async (ticker: string, from: string, to: string) => {
  const r = await listTickerPricesByRange(ticker, from, to)

  const keys = Object.keys(r).sort()
  const first = r[keys[0]]
  const last = r[keys[keys.length - 1]]

  if (!first) throw new Error('no first data')
  if (!last) throw new Error('no last data')

  const openPrice = first[0]
  const closePrice = last[3]
  const profit = ((closePrice - openPrice) / openPrice) * 100

  return {
    openPrice: Math.round(openPrice * 100) / 100,
    closePrice: Math.round(closePrice * 100) / 100,
    profit: (profit > 0 ? '+' : '') + Math.round(profit * 100) / 100,
  }
}

if (require.main === module) {
  const ticker = process.argv[2]
  const from = process.argv[3]
  const to = process.argv[4]
  const name = process.argv[5]
  // console.log("run with ticker:", ticker, "from:""", to)
  // - [나스닥](https://finance.yahoo.com/quote/%5EIXIC?.tsrc=fin-srch) 16109.83 -> 16379.46 (+1.67%)

  run(ticker, from, to)
    .then(res => console.log(`- [${name}](https://finance.yahoo.com/quote/${ticker}?.tsrc=fin-srch) ${res.openPrice} -> ${res.closePrice} (${res.profit}%)`))
    .catch(err => console.error(err))
}
