'use client'

import { useEffect, useMemo } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { stockAssetsAtom } from '@/states/stock-assets.state'
import { Account, AccountType } from '@/types/account.type'
import { AccountEntries, accountEntriesAtom } from '../states/acount-entries.state'
import { sum, unique } from 'radash'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  Column,
  ColumnDef
} from '@tanstack/react-table'
import { putTickerPriceAtom, tickerPricesAtom } from '../states/ticker-price'
import { formatCurrency, getTicket, relativeDate } from '../util'
import Link from 'next/link'
import { Item } from '@/types/item.type'
import { TickerPriceCell } from './TickerPriceCell'
import { globalTotalPriceAtom } from '../states/global-total-price.state'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { ItemsTableCellTickerPrice } from './ItemsTableCellTickerPrice'
import { ItemsTableCellActions } from './ItemsTableCellActions'
import { ExternalLink } from 'lucide-react'

const colors = [
  "bg-amber-500/30",
  "bg-lime-500/30",
  "bg-emerald-500/30",
  "bg-cyan-500/30",
  "bg-blue-500/30",
  "bg-violet-500/30",
  "bg-fuchsia-500/30",
  "bg-rose-500/30",
  "bg-orange-500/30",
  "bg-yellow-500/30",
  "bg-green-500/30",
  "bg-teal-500/30",
  "bg-sky-500/30",
  "bg-indigo-500/30",
  "bg-purple-500/30",
  "bg-pink-500/30",
  "bg-red-500/30",
]

export const ItemsTableRow = (props: {
  item: Item
  accounts: Record<string, Account[]>
}) => {
  const { item, accounts } = props
  const { accountId, perAccount, isFund, name, ticker, totalQty, totalPrice } = item
  const assets = accounts.assets
  const [stockAssets, setStockAssets] = useAtom(stockAssetsAtom)
  const getAssetName = (accountId: string) => {
    const found = assets.find(a => a.account_id === accountId)
    return found ? found.title : 'Unknown'
  }
  const idx = stockAssets.findIndex(sa => sa.account.account_id === accountId)

  const [tickerPrices, setTickerPrices] = useAtom(tickerPricesAtom)
  const tickerPrice = tickerPrices.find(t => t.ticker === item.ticker)?.price

  const currentPrice = (tickerPrice || 0) * totalQty
  const profit = currentPrice - totalPrice

  return (
    <TableRow className={`${colors[idx]} py-0`}>
      <TableCell className="font-medium py-0">{getAssetName(accountId)}</TableCell>
      <TableCell className=''>
        <div className='flex'>
          <span>
            {name}
          </span>
          {ticker && (
            <Link
              href={`https://finance.yahoo.com/quote/${ticker}?p=${ticker}&.tsrc=fin-srch`}
              target="_blank"
            >
              <ExternalLink className="ml-1 h-4 w-4" />
            </Link>
          )}
        </div>
      </TableCell>

      <TableCell className='text-right'>
        {Object.keys(perAccount).map(from => (
          <div key={from}>
            <span>
              {getAssetName(from)}
              {' '}
              <b>{formatCurrency(perAccount[from])}</b>
            </span>
            <span>
              {isFund ? '원' : '주'}
            </span>
          </div>
        ))}
      </TableCell>

      <TableCell className="text-right">
        {isFund
          ? '-'
          : <><b>{totalQty.toLocaleString()}</b>주</>
        }
      </TableCell>

      {/* 기록된 평가액 */}
      <TableCell className="text-right">
        <div>
          <b>{totalPrice.toLocaleString()}</b>원
        </div>
        <div className='text-gray-400'>
          {relativeDate(item.lastItemDate)}
        </div>
      </TableCell>

      {/* 현재 1주 가격 */}
      <ItemsTableCellTickerPrice
        item={item}
      />

      <TableCell className="text-right">
        {isFund
          ? '-'
          : tickerPrice
            ? <><b>{(totalQty * tickerPrice).toLocaleString()}</b>원</>
            : 'Ticker 정보 필요'
        }
      </TableCell>

      <TableCell className="text-right">
        {ticker ? (
          <span className={`${profit >= 0 ? 'text-green-600' : 'text-red-400'}`}>
            {profit >= 0 ? '+' : '-'} {Math.abs(profit).toLocaleString()}원
          </span>
        ) : (
          '-'
        )}
      </TableCell>
      <ItemsTableCellActions item={item} />

    </TableRow>
  )
}
