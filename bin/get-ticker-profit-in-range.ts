/**
 * 실행 방법
 * npx ts-node -r tsconfig-paths/register -P bin/tsconfig.json bin/get-ticker-profit-in-range.ts [ticker] [from] [to]
 *
 * example:
npx ts-node -r tsconfig-paths/register -P bin/tsconfig.json bin/get-ticker-profit-in-range.ts "^IXIC" 2024-03-01 2024-03-31 "나스닥"
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
