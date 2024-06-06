/**
 * 실행 방법
 * npx ts-node -r tsconfig-paths/register -P bin/tsconfig.json bin/get-ticker-profit-in-range-using-trading-view.ts [ticker] [from] [to]
 *
 * example:
npx ts-node -r tsconfig-paths/register -P bin/tsconfig.json bin/get-ticker-profit-in-range-using-trading-view.ts "TVC:US02Y" 2024-05-01 2024-05-31 "미국 2년물 국채 금리"
npx ts-node -r tsconfig-paths/register -P bin/tsconfig.json bin/get-ticker-profit-in-range-using-trading-view.ts "TVC:US10Y" 2024-05-01 2024-05-31 "미국 10년물 국채 금리"
npx ts-node -r tsconfig-paths/register -P bin/tsconfig.json bin/get-ticker-profit-in-range-using-trading-view.ts "TVC:US30Y" 2024-05-01 2024-05-31 "미국 30년물 국채 금리"
 */

import { listTickerPricesByRange } from "@/server/actions/trading-view"

const run = async (ticker: string, from: string, to: string, fixed = 2) => {
  const r = await listTickerPricesByRange(ticker, from, to)

  const keys = Object.keys(r).sort()
  const first = r[keys[0]]
  const last = r[keys[keys.length - 1]]

  if (!first) throw new Error('no first data')
  if (!last) throw new Error('no last data')

  const openPrice = first[0]
  const closePrice = last[3]
  const profit = ((closePrice - openPrice) / openPrice) * 100

  const fixedRate = Math.pow(10, fixed)

  return {
    openPrice: Math.round(openPrice * fixedRate) / fixedRate,
    closePrice: Math.round(closePrice * fixedRate) / fixedRate,
    profit: (profit > 0 ? '+' : '') + Math.round(profit * fixedRate) / fixedRate,
  }
}

if (require.main === module) {
  const ticker = process.argv[2]
  const from = process.argv[3].trim()
  const to = process.argv[4].trim()
  const name = process.argv[5]
  // console.log("run with ticker:", ticker, "from:""", to)

  run(ticker, from, to, 3)
    //
    .then(res => console.log(`- [${name}](https://www.tradingview.com/chart/Q4UO7zCp/?symbol=${encodeURIComponent(ticker)}) ${res.openPrice} -> ${res.closePrice} (${res.profit}%)`))
    .catch(err => console.error(err))
}
