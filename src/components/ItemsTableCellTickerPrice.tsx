import { useAtom, useSetAtom } from "jotai"
import { startTransition, useEffect, useRef, useState, useTransition } from 'react'
import { putTickerPriceAtom, tickerPricesAtom } from "../states/ticker-price"
import { Item } from "../types/item.type"
import Link from "next/link"
import { getTickerPrice } from "../server/actions/yahoo-finance"
import { useTickerPrice } from "../data/hooks"
import { Box, TextField } from '@radix-ui/themes'
import { TableCell } from "./ui/table"
import { Input } from "./ui/input"
import { ChevronRight, RotateCw } from "lucide-react"

const isAvailableAutoUpdate = (ticker: string) => {
  return !ticker.startsWith('비상장-')
}

export const ItemsTableCellTickerPrice = (props: {
  item: Item
}) => {
  const { item } = props
  const { ticker, isFund } = item
  const putTickerPrice = useSetAtom(putTickerPriceAtom)
  const [tickerPrices, setTickerPrices] = useAtom(tickerPricesAtom)
  // const [isPending, startTransition] = useTransition()
  const [defaultValue, setDefaultValue] = useState(() => tickerPrices.find(t => t.ticker === ticker)?.price || '')
  const [editing, setEditing] = useState(false)
  const { data, dataUpdatedAt, isFetching, error, refetch } = useTickerPrice(
    ticker && isAvailableAutoUpdate(ticker) ? ticker : undefined
  )

  useEffect(() => {
    if (!ticker || !data) return

    putTickerPrice(ticker, data, 'yahoo')
  }, [putTickerPrice, ticker, data])

  const tickerPrice = tickerPrices.find(t => t.ticker === ticker)?.price

  if (isFund) {
    return <td className='text-right'>-</td>
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
  // const value = tickerPrice?.toLocaleString() || ''

  // https://finance.yahoo.com/quote/360750.KS?p=360750.KS&.tsrc=fin-srch
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
