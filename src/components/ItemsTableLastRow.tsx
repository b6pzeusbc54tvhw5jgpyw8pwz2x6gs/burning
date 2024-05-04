'use client'

import { useEffect, useMemo } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { TableRowItem } from '@/types/item.type'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Button } from './ui/button'
import { ChevronRight, RefreshCw } from 'lucide-react'
import { nonTickerEvaluatedPricesAtom, putNonTickerEvaluatedPricesAtom } from '@/states/non-ticker-evaluated-price.state'
import { itemHistoricalsByTickerAtom } from '@/states/ticker-historical.state'
import { getTickerPrice } from '@/utils/ticker-price.util'
import { currentDateAtom } from '@/states/date.state'

const colors = [
  "md:bg-red-500/30",
  "md:bg-amber-500/30",
  "md:bg-lime-500/30",
  "md:bg-emerald-500/30",
  "md:bg-cyan-500/30",
  "md:bg-blue-500/30",
  "md:bg-violet-500/30",
  "md:bg-fuchsia-500/30",
  "md:bg-rose-500/30",
  "md:bg-orange-500/30",
  "md:bg-yellow-500/30",
  "md:bg-green-500/30",
  "md:bg-teal-500/30",
  "md:bg-sky-500/30",
  "md:bg-indigo-500/30",
  "md:bg-purple-500/30",
  "md:bg-pink-500/30",
]

export const ItemsTableLastRow = (props: {
  items: TableRowItem[]
}) => {
  const { items } = props
  const [date] = useAtom(currentDateAtom)
  const [nonTickerPrices] = useAtom(nonTickerEvaluatedPricesAtom)
  nonTickerPrices.find(v => v.evaluatedPrice)

  const [itemHistoricalsByTicker] = useAtom(itemHistoricalsByTickerAtom)

  // Date 기준 가장 최신 가계부에 기록된 평가액.
  const lastWrittenTotalPrice = useMemo(() => {
    return items.reduce((acc, item) => acc + item.totalPrice, 0)
  }, [items])

  const currentEvaluatedTotalPrice = useMemo(() => {
    return items.reduce((acc, item) => {
      const nonTickerPrice = nonTickerPrices.find(v => (
        v.sectionId === item.sectionId
        && v.accountId === item.accountId
        && v.itemName === item.name
      ))
      if (nonTickerPrice) {
        const evaluatedPrice = nonTickerPrice.evaluatedPrice || item.totalPrice
        return acc + evaluatedPrice
      }

      const tickerPrice = getTickerPrice(date, itemHistoricalsByTicker[item.ticker || ''])
      if (tickerPrice === undefined) {
        // tickerPrice가 없으면, 가계부 가격을 그대로 사용.
        return acc + item.totalPrice
      }

      const price = item.totalQty * tickerPrice
      return acc + price
    }, 0)
  }, [items, itemHistoricalsByTicker, nonTickerPrices, date])

  const profit = currentEvaluatedTotalPrice - lastWrittenTotalPrice

  return (
    <TableRow className={`py-0`}>
      <TableCell className="font-medium py-0"></TableCell>
      <TableCell className=''></TableCell>
      <TableCell className='text-right'></TableCell>
      <TableCell className="text-right"></TableCell>

      {/* 가계부에 기록된 평가액 */}
      <TableCell className="text-right">
        <b>{Math.floor(lastWrittenTotalPrice).toLocaleString()}</b>원
      </TableCell>

      <TableCell className="text-right"></TableCell>

      {/* 현재 평가액	*/}
      <TableCell className="text-right">
        <b>{Math.floor(currentEvaluatedTotalPrice).toLocaleString()}</b>원
      </TableCell>

      {/* 현재 평가 손익 */}
      <TableCell className="text-right">
        <span className={`${profit >= 0 ? 'text-green-600' : 'text-red-400'}`}>
          {profit >= 0 ? '+' : '-'} {Math.abs(Math.floor(profit)).toLocaleString()}원
        </span>
      </TableCell>

      <TableCell className="text-right flex gap-1 justify-end">
        <Button variant="outline" size="sm">
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm">
          📝
        </Button>
      </TableCell>

    </TableRow>
  )
}
