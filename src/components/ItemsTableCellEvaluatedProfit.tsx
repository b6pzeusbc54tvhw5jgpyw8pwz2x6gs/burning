import { useAtom, useSetAtom } from "jotai"
import { useEffect, useState } from 'react'
import { putTickerPriceAtom, tickerPricesAtom } from "../states/ticker-price"
import { Item } from "../types/item.type"
import { useTickerPrice } from "../data/hooks"
import { TableCell } from "./ui/table"
import { nonTickerEvaluatedPricesAtom } from "@/states/non-ticker-evaluated-price"
import { useItemPrice } from "@/hooks/use-item-price"

const isAvailableAutoUpdate = (ticker: string) => {
  return !ticker.startsWith('비상장-')
}

export const ItemsTableCellEvaluatedProfit = (props: {
  item: Item
}) => {
  const { item } = props
  const { name, sectionId, accountId, ticker, isFund, totalQty, totalPrice } = item

  // const putTickerPrice = useSetAtom(putTickerPriceAtom)
  // const [tickerPrices, setTickerPrices] = useAtom(tickerPricesAtom)
  const { data, dataUpdatedAt, isFetching, error, refetch } = useTickerPrice(
    ticker && isAvailableAutoUpdate(ticker) ? ticker : undefined
  )
  // const [nonTickerEvaluatedPrices] = useAtom(nonTickerEvaluatedPricesAtom)
  // const nonTickerEvaluatedPrice = nonTickerEvaluatedPrices.find(p => p.sectionId === sectionId && p.accountId === accountId && p.itemName === name)?.evaluatedPrice

  // useEffect(() => {
  //   if (!ticker || !data) return

  //   putTickerPrice(ticker, data, 'yahoo')
  // }, [putTickerPrice, ticker, data])

  const { evaluatedProfit } = useItemPrice(item)
  console.log("🚀 ~ item:", item)
  console.log("🚀 ~ evaluatedProfit:", evaluatedProfit)

  // const tickerPrice = tickerPrices.find(t => t.ticker === ticker)?.price
  // const currentPrice = (tickerPrice || 0) * totalQty
  // const profit = tickerPrice && !nonTickerEvaluatedPrice
  //   ? currentPrice - totalPrice
  //   : isFund && nonTickerEvaluatedPrice
  //     ? nonTickerEvaluatedPrice - totalPrice
  //     : null

  if (!isFund && isFetching) {
    return (
      <TableCell className="text-right animate-pulse">Loading...</TableCell>
    )
  }

  return (
    <TableCell className="text-right">
      <span className={`${evaluatedProfit >= 0 ? 'text-green-600' : 'text-red-400'}`}>
        {evaluatedProfit >= 0 ? '+' : '-'} {Math.abs(evaluatedProfit).toLocaleString()}원
      </span>
    </TableCell>
  )
}
