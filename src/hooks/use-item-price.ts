import { nonTickerEvaluatedPricesAtom } from "@/states/non-ticker-evaluated-price"
import { tickerPricesAtom } from "@/states/ticker-price"
import { Item } from "@/types/item.type"
import { useAtom } from "jotai"

export const useItemPrice = (item: Item) => {
  const { sectionId, accountId, name, ticker, totalQty, totalPrice, isFund } = item
  const [nonTickerEvaluatedPrices] = useAtom(nonTickerEvaluatedPricesAtom)
  const [tickerPrices] = useAtom(tickerPricesAtom)

  const itemAsNonTicker = nonTickerEvaluatedPrices.find(n => (
    n.sectionId === sectionId && n.accountId === accountId && n.itemName === name
  ))

  if (itemAsNonTicker) {
    return {
      tickerPrice: undefined,
      evaluatedPrice: itemAsNonTicker.evaluatedPrice,
      evaluatedProfit: itemAsNonTicker.evaluatedPrice - totalPrice,
    }
  }

  const tickerPrice = tickerPrices.find(t => t.ticker === ticker)?.price
  const evaluatedPrice = tickerPrice ? tickerPrice * totalQty : totalPrice
  const evaluatedProfit = evaluatedPrice - totalPrice
  return {
    tickerPrice,
    evaluatedPrice,
    evaluatedProfit,
  }
}
