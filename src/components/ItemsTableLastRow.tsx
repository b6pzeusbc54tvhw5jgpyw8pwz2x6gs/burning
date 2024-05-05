'use client'

import { useEffect, useMemo } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { TableRowItem } from '@/types/item.type'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Button } from './ui/button'
import { ChevronRight, RefreshCw } from 'lucide-react'
import { itemHistoricalsByTickerAtom, manualTickerItemHistoricalsByTickerAtom, nonTickerItemHistoricalsByTickerAtom } from '@/states/ticker-historical.state'
import { getTickerPrice } from '@/utils/ticker-price.util'
import { currentDateAtom } from '@/states/date.state'
import { isAutoTicker, isManualTicker } from '@/utils/ticker-name.util'

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
  // const [nonTickerPrices] = useAtom(nonTickerEvaluatedPricesAtom)
  // nonTickerPrices.find(v => v.evaluatedPrice)

  const [nonTickerItemHistoricalsByTicker] = useAtom(nonTickerItemHistoricalsByTickerAtom)
  const [manualTickerItemHistoricalsByTicker] = useAtom(manualTickerItemHistoricalsByTickerAtom)
  const [itemHistoricalsByTicker] = useAtom(itemHistoricalsByTickerAtom)

  // Date 기준 가장 최신 가계부에 기록된 평가액.
  const lastWrittenTotalPrice = useMemo(() => {
    return items.reduce((acc, item) => acc + item.totalPrice, 0)
  }, [items])

  const currentEvaluatedTotalPrice = useMemo(() => {
    return items.reduce((acc, item) => {
      const { ticker } = item
      if (acc === null || !ticker) {
        return null
      }

      const isTickerType = isAutoTicker(ticker) || isManualTicker(ticker)
      if (isTickerType) {
        const tickerPrice = isAutoTicker(ticker)
          ? getTickerPrice(date, itemHistoricalsByTicker[ticker])
          : getTickerPrice(date, manualTickerItemHistoricalsByTicker[ticker])

        return tickerPrice !== null
          ? acc + tickerPrice * item.totalQty
          : null
      }

      const evaluatedPrice = getTickerPrice(date, nonTickerItemHistoricalsByTicker[ticker])
      return evaluatedPrice !== null
        ? acc + evaluatedPrice
        : null
    }, 0 as number | null)
  }, [items, date, itemHistoricalsByTicker, manualTickerItemHistoricalsByTicker, nonTickerItemHistoricalsByTicker])

  const profit = currentEvaluatedTotalPrice !== null
    ? currentEvaluatedTotalPrice - lastWrittenTotalPrice
    : null

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

      {/* 현재 평가액 */}
      <TableCell className="text-right">
        {currentEvaluatedTotalPrice === null ? (
          '평가액을 모르는 항목이 있어요'
        ) : (
          <>
            <b>{Math.floor(currentEvaluatedTotalPrice).toLocaleString()}</b>원
          </>
        )}
      </TableCell>

      {/* 현재 평가 손익 */}
      <TableCell className="text-right">
        {profit !== null ? (
          <span className={`${profit >= 0 ? 'text-green-600' : 'text-red-400'}`}>
            {profit >= 0 ? '+' : '-'} {Math.abs(Math.floor(profit)).toLocaleString()}원
          </span>
        ) : (
          <span>-</span>
        )}
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
