import { useAtom } from "jotai"
import dayjs from "dayjs"
import { nonTickerEvaluatedPricesAtom } from "@/states/non-ticker-evaluated-price.state"
import { TableRowItem } from "@/types/item.type"
import { itemHistoricalsByTickerAtom } from "@/states/ticker-historical.state"
import { currentDateAtom } from "@/states/date.state"
import { getTickerPrice } from "@/utils/ticker-price.util"

export const useItemDetail = (item: TableRowItem) => {
  const [currentDate] = useAtom(currentDateAtom)
  const [itemHistoricalsByTicker] = useAtom(itemHistoricalsByTickerAtom)

  const { sectionId, accountId, name, ticker, totalQty, totalPrice } = item
  const [nonTickerEvaluatedPrices] = useAtom(nonTickerEvaluatedPricesAtom)
  // const [tickerPrices] = useAtom(tickerPricesAtom)

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

  // const tickerPrice = tickerPrices.find(t => t.ticker === ticker)?.price

  const itemHistoricals = itemHistoricalsByTicker[ticker || '']
  const date = dayjs(currentDate).format('YYYYMMDD')
  const tickerPrice = getTickerPrice(date, itemHistoricals)

  const evaluatedPrice = tickerPrice ? tickerPrice * totalQty : totalPrice
  const evaluatedProfit = evaluatedPrice - totalPrice
  return {
    nonTickerType: false,
    tickerPrice,
    evaluatedPrice,
    evaluatedProfit,
  }
}
