import { useAtom, useSetAtom } from "jotai"
import { useEffect, useState } from 'react'
import { putTickerPriceAtom, tickerPricesAtom } from "../states/ticker-price.state"
import { Item } from "../types/item.type"
import { useTickerPrice } from "../data/hooks"
import { TableCell } from "./ui/table"
import { Input } from "./ui/input"
import { putNonTickerEvaluatedPricesAtom } from "@/states/non-ticker-evaluated-price.state"
import { useItemPrice } from "@/hooks/use-item-price"

export const ItemsTableCellEvaluatedTotalPrice = (props: {
  item: Item
}) => {
  const { item } = props
  const { name, sectionId, accountId, ticker, totalQty } = item
  const putTickerPrice = useSetAtom(putTickerPriceAtom)
  const [tickerPrices, setTickerPrices] = useAtom(tickerPricesAtom)
  const [editing, setEditing] = useState(false)
  const { data, dataUpdatedAt, isFetching, error, refetch } = useTickerPrice(ticker)

  const putNonTickerEvaluatedPrice = useSetAtom(putNonTickerEvaluatedPricesAtom)
  const { evaluatedPrice } = useItemPrice(item)

  useEffect(() => {
    if (!ticker || !data) return

    putTickerPrice(ticker, data, 'yahoo')
  }, [putTickerPrice, ticker, data])

  const tickerPrice = tickerPrices.find(t => t.ticker === ticker)?.price

  if (isFetching) {
    return (
      <TableCell className="text-right animate-pulse">Loading...</TableCell>
    )
  }

  return (
    <TableCell className="text-right">

      {(!ticker || ticker.startsWith('manual-ticker-')) ? (
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
