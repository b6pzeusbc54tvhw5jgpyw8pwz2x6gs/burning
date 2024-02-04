import { useAtom, useSetAtom } from "jotai"
import { useEffect, useState } from 'react'
import { putTickerPriceAtom, tickerPricesAtom } from "../states/ticker-price"
import { Item } from "../types/item.type"
import { useTickerPrice } from "../data/hooks"
import { TableCell } from "./ui/table"
import { Input } from "./ui/input"
import { nonTickerEvaluatedPricesAtom, putNonTickerEvaluatedPricesAtom } from "@/states/non-ticker-evaluated-price"
import { useItemPrice } from "@/hooks/use-item-price"

const isAvailableAutoUpdate = (ticker: string) => {
  return !ticker.startsWith('비상장-')
}

export const ItemsTableCellEvaluatedTotalPrice = (props: {
  item: Item
}) => {
  const { item } = props
  const { name, sectionId, accountId, ticker, isFund, totalQty } = item
  const putTickerPrice = useSetAtom(putTickerPriceAtom)
  const [tickerPrices, setTickerPrices] = useAtom(tickerPricesAtom)
  const [editing, setEditing] = useState(false)
  const { data, dataUpdatedAt, isFetching, error, refetch } = useTickerPrice(
    ticker && isAvailableAutoUpdate(ticker) ? ticker : undefined
  )

  // const [nonTickerEvaluatedPrices] = useAtom(nonTickerEvaluatedPricesAtom)
  // const nonTickerEvaluatedPrice = nonTickerEvaluatedPrices.find(p => p.sectionId === sectionId && p.accountId === accountId && p.itemName === name)?.evaluatedPrice
  const putNonTickerEvaluatedPrice = useSetAtom(putNonTickerEvaluatedPricesAtom)
  const { evaluatedPrice } = useItemPrice(item)

  useEffect(() => {
    if (!ticker || !data) return

    putTickerPrice(ticker, data, 'yahoo')
  }, [putTickerPrice, ticker, data])

  const tickerPrice = tickerPrices.find(t => t.ticker === ticker)?.price

  if (!isFund && isFetching) {
    return (
      <TableCell className="text-right animate-pulse">Loading...</TableCell>
    )
  }

  return (
    <TableCell className="text-right">

      {isFund ? (
        <div className="flex text-right justify-end">
          <Input
            className="h-5 text-right px-1 w-full"
            type="text"
            value={evaluatedPrice?.toLocaleString()}
            onFocus={e => setEditing(true)}
            onChange={e => putNonTickerEvaluatedPrice({
              sectionId,
              accountId,
              itemName: name,
              evaluatedPrice: Number(e.target.value?.replace(/,/g,'')),
              source: "manual"
            })}
            onBlur={e => setEditing(false)}
          />
          <span>원</span>
        </div>
      ) : !ticker ? (
        'Ticker 정보 필요'
      ) : !tickerPrice ? (
        'Ticker 정보 로드 실패'
      ) : (
        <><b>{(evaluatedPrice).toLocaleString()}</b>원</>
      )}
    </TableCell>
  )
}
