'use client'

import Link from 'next/link'
import { useAtom } from 'jotai'
import { ExternalLink } from 'lucide-react'
import { stockAssetsAtom } from '@/states/selected-assets.state'
import { Account } from '@/types/account.type'
import { formatCurrency, includeDash, relativeDate } from '@/utils/date.util'
import { TableRowItem } from '@/types/item.type'
import { TableCell, TableRow } from './ui/table'
import { ItemsTableCellTickerPrice } from './ItemsTableCellTickerPrice'
import { ItemsTableCellActions } from './ItemsTableCellActions'
import { ItemsTableCellEvaluatedTotalPrice } from './ItemsTableCellEvaluatedTotalPrice'
import { ItemsTableCellEvaluatedProfit } from './ItemsTableCellEvaluatedProfit'
import { isAutoTicker, isManualTicker } from '@/utils/ticker-name.util'
import { externalWalletItemsAtom } from '@/states/ticker-name.state'

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
  item: TableRowItem
  accounts: Record<string, Account[]>
}) => {
  const { item, accounts } = props
  const { accountId, perAccount, name, ticker, totalQty, totalPrice, evaluatedPrice } = item
  const { assetGroup: assetTypeName } = item
  const [stockAssets, setStockAssets] = useAtom(stockAssetsAtom)
  const assets = accounts.assets
  const getAssetName = (accountId: string) => {
    const found = assets.find(a => a.account_id === accountId)
    return found ? found.title : 'Unknown'
  }

  const idx = stockAssets.findIndex(sa => sa.account_id === accountId)

  const [externalWalletItems] = useAtom(externalWalletItemsAtom)

  if (ticker && evaluatedPrice === 0 && item.totalPrice === 0) {
    return null
  }

  return (
    <TableRow className={`${colors[idx]} py-0`}>
      <TableCell className="font-medium py-0">{assetTypeName}</TableCell>
      <TableCell className=''>
        <div className='flex'>
          <span>
            {name}
          </span>
          {ticker && !ticker.startsWith('manual-ticker-') && (
            <Link
              href={`https://finance.yahoo.com/quote/${ticker}?p=${ticker}&.tsrc=fin-srch`}
              target="_blank"
            >
              <ExternalLink className="ml-1 h-4 w-4" />
            </Link>
          )}
        </div>
      </TableCell>

      {/* 계좌 별 수량 */}
      <TableCell className='text-right'>
        {(!externalWalletItems.includes(ticker || '') && (isAutoTicker(ticker) || isManualTicker(ticker))) ? (
          <>
            {Object.keys(perAccount).map(from => (
              <div key={from}>
                <span>
                  {getAssetName(from)}
                  {' '}
                  <b>{formatCurrency(perAccount[from])}</b>
                </span>
                <span>주</span>
              </div>
            ))}
          </>
        ) : '-'}
      </TableCell>

      {/* 총 수량 */}
      <TableCell className="text-right">
        {(isAutoTicker(ticker) || isManualTicker(ticker))
          ? <><b>{totalQty.toLocaleString()}</b>주</>
          : '-'
        }
      </TableCell>

      {/* 기록된 평가액 */}
      <TableCell className="text-right">
        <div>
          <b>{Math.floor(totalPrice).toLocaleString()}</b>원
        </div>
        <div className='text-gray-400 text-xs'>
          {includeDash(item.lastItemDate)}
        </div>
      </TableCell>

      {/* 현재 1주 가격 */}
      <ItemsTableCellTickerPrice
        item={item}
      />

      {/* 현재 평가액 */}
      <ItemsTableCellEvaluatedTotalPrice
        item={item}
      />

      {/* 현재 평가 손익 */}
      <ItemsTableCellEvaluatedProfit
        item={item}
      />

      <ItemsTableCellActions item={item} />

    </TableRow>
  )
}
