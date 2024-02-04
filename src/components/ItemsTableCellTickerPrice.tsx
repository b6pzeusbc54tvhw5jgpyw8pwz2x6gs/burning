import { useAtom, useSetAtom } from "jotai"
import { useEffect, useState } from 'react'
import { putTickerPriceAtom, tickerPricesAtom } from "../states/ticker-price.state"
import { Item } from "../types/item.type"
import { useTickerPrice } from "../data/hooks"
import { TableCell } from "./ui/table"
import { Input } from "./ui/input"

export const ItemsTableCellTickerPrice = (props: {
  item: Item
}) => {
  const { item } = props
  const { ticker, tickerType } = item
  const putTickerPrice = useSetAtom(putTickerPriceAtom)
  const [tickerPrices] = useAtom(tickerPricesAtom)
  const [editing, setEditing] = useState(false)
  const { data, dataUpdatedAt, isFetching, error, refetch } = useTickerPrice(ticker)

  useEffect(() => {
    if (!ticker || !data) return

    putTickerPrice(ticker, data, 'yahoo')
  }, [putTickerPrice, ticker, data])

  const tickerPrice = tickerPrices.find(t => t.ticker === ticker)?.price

  if (!tickerType) {
    return <td className='text-right'></td>
  }

  if (!ticker) {
    return (
      <TableCell className="text-right">
        Ticker 정보 필요
      </TableCell>
    )
  }


  if (isFetching) {
    return (
      <TableCell className="text-right animate-pulse">Loading...</TableCell>
    )
  }

  return (
    <TableCell className="text-right">

      <div className="flex text-right justify-end">
        <Input
          className="h-5 text-right px-1 w-full"
          type="text"
          value={tickerPrice?.toLocaleString() || ''}
          onFocus={e => setEditing(true)}
          onChange={e => putTickerPrice(ticker, Number(e.target.value?.replace(/,/g,'')), 'manual')}
          onBlur={e => setEditing(false)}
        />
        <span>원</span>
      </div>
    </TableCell>
  )
}
