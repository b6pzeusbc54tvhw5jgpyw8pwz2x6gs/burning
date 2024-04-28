import { useAtom } from "jotai"
import { TableRowItem } from "@/types/item.type"
import { itemHistoricalsByTickerAtom, manualTickerItemHistoricalsByTickerAtom, nonTickerItemHistoricalsByTickerAtom } from "@/states/ticker-historical.state"
import { getTickerPrice } from "@/utils/ticker-price.util"
import { isManualTicker, isNonTickerTypeTicker, isUndefinedTicker } from "@/utils/ticker-name.util"

export const useItemDetail = (item: TableRowItem, date: Date) => {
  const { ticker, totalQty, totalPrice } = item
  const [itemHistoricalsByTicker] = useAtom(itemHistoricalsByTickerAtom)
  const [manualTickerItemHistoricalsByTicker] = useAtom(manualTickerItemHistoricalsByTickerAtom)
  const [nonTickerItemHistoricalsByTicker] = useAtom(nonTickerItemHistoricalsByTickerAtom)

  if (isUndefinedTicker(ticker)) {
    return {
      tickerPrice: 0,
      evaluatedPrice: totalPrice,
      evaluatedProfit: 0,
    }
  }

  const itemHistoricals =
    isManualTicker(ticker) ? manualTickerItemHistoricalsByTicker[ticker]
      : isNonTickerTypeTicker(ticker) ? nonTickerItemHistoricalsByTicker[ticker]
        : itemHistoricalsByTicker[ticker]

  const tickerPrice = getTickerPrice(date, itemHistoricals)
  const evaluatedPrice = tickerPrice ? tickerPrice * totalQty : totalPrice
  const evaluatedProfit = evaluatedPrice - totalPrice
  return {
    tickerPrice,
    evaluatedPrice,
    evaluatedProfit,
  }
}
