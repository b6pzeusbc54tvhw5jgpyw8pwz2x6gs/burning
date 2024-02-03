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
import { formatCurrency, getTicket } from '../util'
import Link from 'next/link'
import { Item } from '@/types/item.type'
import { TickerPriceCell } from './TickerPriceCell'
import { globalTotalPriceAtom } from '../states/global-total-price.state'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { ItemsTableCellTickerPrice } from './ItemsTableCellTickerPrice'

const colors = [
  "md:bg-red-500/40",
  "md:bg-amber-500/40",
  "md:bg-lime-500/40",
  "md:bg-emerald-500/40",
  "md:bg-cyan-500/40",
  "md:bg-blue-500/40",
  "md:bg-violet-500/40",
  "md:bg-fuchsia-500/40",
  "md:bg-rose-500/40",
  "md:bg-orange-500/40",
  "md:bg-yellow-500/40",
  "md:bg-green-500/40",
  "md:bg-teal-500/40",
  "md:bg-sky-500/40",
  "md:bg-indigo-500/40",
  "md:bg-purple-500/40",
  "md:bg-pink-500/40",
]



export const ItemsTableRow = (props: {
  item: Item
  accounts: Record<string, Account[]>
}) => {
  const { item, accounts } = props
  const { accountId, perAccount, isFund, name } = item
  const assets = accounts.assets
  const [stockAssets, setStockAssets] = useAtom(stockAssetsAtom)
  const getAssetName = (accountId: string) => {
    const found = assets.find(a => a.account_id === accountId)
    return found ? found.title : 'Unknown'
  }
  const accontName = assets?.find(a => a.account_id === item.accountId)?.title

  return (
    <TableRow className="bg-orange-400 py-0">
      <TableCell className="font-medium py-0">{getAssetName(accountId)}</TableCell>
      <TableCell className=''>{item.name}</TableCell>

      <TableCell className='text-right'>
        {Object.keys(item.perAccount).map(from => (
          <div key={from}>
            <span>
              {getAssetName(from)}
              {' '}
              <b>{formatCurrency(item.perAccount[from])}</b>
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
          : <><b>{item.totalQty.toLocaleString()}</b>주</>
        }
      </TableCell>

      <TableCell className="text-right">
        {isFund
          ? '-'
          : <><b>{item.totalPrice.toLocaleString()}</b>원</>
        }
      </TableCell>

      <ItemsTableCellTickerPrice
        item={item}
      />

      <TableCell className="text-right">
        {isFund
          ? '-'
          : <><b>{item.totalPrice.toLocaleString()}</b>원</>
        }
      </TableCell>
    </TableRow>
  )
}
