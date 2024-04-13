import { useAtom } from "jotai"
import { nonTickerEvaluatedPricesAtom } from "@/states/non-ticker-evaluated-price.state"
import { tickerPricesAtom } from "@/states/ticker-price.state"
import { TableRowItem } from "@/types/item.type"

export const useItemDetail = (item: TableRowItem) => {
  const { sectionId, accountId, name, ticker, totalQty, totalPrice } = item
  const [nonTickerEvaluatedPrices] = useAtom(nonTickerEvaluatedPricesAtom)
  const [tickerPrices] = useAtom(tickerPricesAtom)

  const itemAsNonTicker = nonTickerEvaluatedPrices.find(n => (
    n.sectionId === sectionId && n.accountId === accountId && n.itemName === name
  ))

  if (itemAsNonTicker) {
    return {
      nonTickerType: true,
      tickerPrice: undefined,
      evaluatedPrice: itemAsNonTicker.evaluatedPrice,
      evaluatedProfit: itemAsNonTicker.evaluatedPrice - totalPrice,
    }
  }

  const tickerPrice = tickerPrices.find(t => t.ticker === ticker)?.price
  const evaluatedPrice = tickerPrice ? tickerPrice * totalQty : totalPrice
  const evaluatedProfit = evaluatedPrice - totalPrice
  return {
    nonTickerType: false,
    tickerPrice,
    evaluatedPrice,
    evaluatedProfit,
  }
}
