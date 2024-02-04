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
  const { ticker } = item

  const { isFetching } = useTickerPrice(
    ticker && isAvailableAutoUpdate(ticker) ? ticker : undefined
  )

  const { evaluatedProfit } = useItemPrice(item)

  if (ticker && isFetching) {
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
