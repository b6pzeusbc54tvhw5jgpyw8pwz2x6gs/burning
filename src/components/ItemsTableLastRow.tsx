'use client'

import { useEffect, useMemo } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { stockAssetsAtom } from '@/states/stock-assets.state'
import { Account, AccountType } from '@/types/account.type'
import { tickerPricesAtom } from '../states/ticker-price.state'
import { TableRowItem } from '@/types/item.type'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Button } from './ui/button'
import { ChevronRight, RefreshCw } from 'lucide-react'
import { nonTickerEvaluatedPricesAtom, putNonTickerEvaluatedPricesAtom } from '@/states/non-ticker-evaluated-price.state'

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
  accounts: Record<string, Account[]>
}) => {
  const { items, accounts } = props
  const assets = accounts.assets
  const [stockAssets, setStockAssets] = useAtom(stockAssetsAtom)
  const getAssetName = (accountId: string) => {
    const found = assets.find(a => a.account_id === accountId)
    return found ? found.title : 'Unknown'
  }

  const [tickerPrices, setTickerPrices] = useAtom(tickerPricesAtom)

  const [nonTickerPrices] = useAtom(nonTickerEvaluatedPricesAtom)
  nonTickerPrices.find(v => v.evaluatedPrice)

  const lastTotalPrice = useMemo(() => {
    return items.reduce((acc, item) => {
      const price = item.totalPrice || 0
      return acc + price
    }, 0)
  }, [items])

  const currentTotalPrice = useMemo(() => {
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

      const tickerPrice = tickerPrices.find(t => t.ticker === item.ticker)?.price
      if (tickerPrice === undefined) {
        return acc + item.totalPrice
      }

      const price = item.totalQty * tickerPrice
      return acc + price
    }, 0)
  }, [items, tickerPrices, nonTickerPrices])

  const profit = currentTotalPrice - lastTotalPrice

  return (
    <TableRow className={`py-0`}>
      <TableCell className="font-medium py-0"></TableCell>
      <TableCell className=''></TableCell>
      <TableCell className='text-right'></TableCell>
      <TableCell className="text-right"></TableCell>

      {/* 가계부에 기록된 평가액 */}
      <TableCell className="text-right">
        <b>{Math.floor(lastTotalPrice).toLocaleString()}</b>원
      </TableCell>

      <TableCell className="text-right"></TableCell>

      {/* 현재 평가액	*/}
      <TableCell className="text-right">
        <b>{Math.floor(currentTotalPrice).toLocaleString()}</b>원
      </TableCell>

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
