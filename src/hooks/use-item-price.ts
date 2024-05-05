import { useAtom } from "jotai"
import { TableRowItem } from "@/types/item.type"
import { itemHistoricalsByTickerAtom, manualTickerItemHistoricalsByTickerAtom, nonTickerItemHistoricalsByTickerAtom } from "@/states/ticker-historical.state"
import { getTickerPrice } from "@/utils/ticker-price.util"
import { isAutoTicker, isManualTicker, isNonTickerTypeTicker, isUndefinedTicker } from "@/utils/ticker-name.util"

// TODO: 이거 없애고, useTableRowItems 이런 곳에 녹여야한다.
export const useItemDetail = (item: TableRowItem, dateOrTimestamp: number | Date) => {
  const date = typeof dateOrTimestamp === 'number' ? new Date(dateOrTimestamp) : dateOrTimestamp
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
  if (tickerPrice === null) {
    return {
      tickerPrice: null,
      evaluatedPrice: null,
      evaluatedProfit: null,
    }
  }

  const isTickerType = isAutoTicker(ticker) || isManualTicker(ticker)

  const evaluatedPrice = isTickerType
    ? tickerPrice * totalQty
    : tickerPrice

  const evaluatedProfit = evaluatedPrice - totalPrice

  return {
    tickerPrice,
    evaluatedPrice,
    evaluatedProfit,
  }
}
