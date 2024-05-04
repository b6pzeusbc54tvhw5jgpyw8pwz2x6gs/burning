/**
 * example:
 * npx ts-node -r tsconfig-paths/register -P bin/tsconfig.json bin/get-ticker-price.ts "^IXIC"
 */

import yahooFinance from "yahoo-finance2"

const run = async (ticker: string) => {
  const res = await yahooFinance.quoteSummary(ticker, {
    modules: ['price'],
  })

  return res
}

if (require.main === module) {
  const ticker = process.argv[2]

  run(ticker)
    .then(res => console.log(res))
    .catch(err => console.error(err))
}

