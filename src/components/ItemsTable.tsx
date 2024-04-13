'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAtom } from 'jotai'
import { stockAssetsAtom } from '@/states/stock-assets.state'
import { AllAccounts } from '@/types/account.type'
import { entriesByAccountAtom, entriesByAccountLoadingAtom } from '../states/acount-entries.state'
import { sum, group, invert, last } from 'radash'
import { getManualTicker, getTicket, getTicketByMemos, updateItem } from '../util'
import { DateTradingInfo, TableRowItem, InvestableItem } from '../types/item.type'
import { globalTotalPriceAtom } from '../states/global-total-price.state'
import { Table, TableBody, TableHead, TableHeader, TableRow } from './ui/table'
import { ItemsTableRow } from './ItemsTableRow'
import { ItemsTableLastRow } from './ItemsTableLastRow'
import { nonTickerEvaluatedPricesAtom } from '@/states/non-ticker-evaluated-price.state'
import { tickerPricesAtom } from '@/states/ticker-price.state'
import { Entry } from '@/types/entry.type'
import { useTableData } from '@/hooks/use-table-data'

export const ItemsTable = (props: {
  allAccounts: AllAccounts
}) => {
  const { allAccounts } = props

  // local에 불러온 모든 account별 entry.
  const [entriesByAccount] = useAtom(entriesByAccountAtom)

  // 투자 자산 목록으로 선택된 Asset들. TODO: 나중에 유가 증권형 자산으로 바꿔야함.
  const [stockAssets, setStockAssets] = useAtom(stockAssetsAtom)
  const [globalTotalPrice, setGlobalTotalPrice] = useAtom(globalTotalPriceAtom)
  const [nonTickerEvaluatedPrices] = useAtom(nonTickerEvaluatedPricesAtom)
  const [tickerPrices, setTickerPrices] = useAtom(tickerPricesAtom)

  const [currentDate, setCurrentDate] = useState('20240413')

  // 유가 증권형 자산은 모두 "거래처" 타입.
  const investableEntries: Record<string, Entry[]> = useMemo(() => {
    const keys = Object.keys(entriesByAccount)
    return keys.reduce((acc, key) => {
      const [, accountId] = key.split('-')
      const selected = stockAssets.some(sa => sa.account.account_id === accountId)
      if (!selected) {
        return acc
      }

      if (allAccounts.assets?.find(a => a.account_id === accountId)?.category !== 'client') {
        return acc
      }

      return { ...acc, [key]: entriesByAccount[key] }
    }, {} satisfies Record<string, Entry[]>)
  }, [entriesByAccount, stockAssets, allAccounts])

  const investableItems: InvestableItem[] = useMemo(() => {
    const keys = Object.keys(investableEntries)

    // entriesByItemName의 key는 ${setiongId}-${accountId}-${itemName} 형태
    const entriesByItemName: Record<string, Entry[]> = keys.reduce((acc, key) => {
      const entries = investableEntries[key]
      return {
        ...acc,
        ...entries.reduce((acc, entry) => {
          const itemKey = `${key}-${entry.item.split('(')[0]}`
          return { ...acc, [itemKey]: [...(acc[itemKey] || []), entry] }
        }, {} as Record<string, Entry[]>)
      }
    }, {} as Record<string, Entry[]>)

    const itemKeys = Object.keys(entriesByItemName)
    return itemKeys.map(key => {
      const [sectionId, accountId, ...rest] = key.split('-')
      const itemName = rest.join('-')
      const entries = entriesByItemName[key]
      const ticker = getTicketByMemos(entries.map(e => e.memo)) || key

      const groupedByDate = group(entries, e => e.entry_date)
      const dates = Object.keys(groupedByDate)
      const tradingInfos = dates.reduce<DateTradingInfo[]>((acc, date) => {
        const prev = last(acc)
        const openQty = prev
          ? prev.openQty + sum(prev.buy.map(b => b.qty)) - sum(prev.sell.map(s => s.qty))
          : 0

        const entries = groupedByDate[date]!
        const buy = entries
          .filter(e => e.l_account_id === accountId)
          .map(entry => ({
            qty: Number(entry.item.split('(')[1]?.split(/[),]/)[0] || 0),
            price: entry.money,
            accountId: entry.r_account_id,
          }))
        const sell = entries
          .filter(e => e.r_account_id === accountId)
          .map(entry => ({
            qty: Number(entry.item.split('(')[1]?.split(/[),]/)[0] || 0),
            price: entry.money,
            accountId: entry.l_account_id,
          }))

        return [
          ...acc,
          { date, openQty, buy, sell },
        ]
      }, [])

      return { sectionId, accountId, ticker, itemName, tradingInfos }
    })
  }, [investableEntries])

  const tableData = useTableData(investableItems)

  useEffect(() => {
    setGlobalTotalPrice(sum(tableData.map(item => item.totalPrice)))
  }, [tableData, setGlobalTotalPrice])

  const getRowSpan = (idx: number) => {
    // 다음 항목들이 몇개나 동일한 accountId를 사용하는지 반환.
    // 각 accountId별로 첫번째 항목에만 rowSpan을 적용하고, 나머지는 null 반환.
    const accountIds = tableData.map(t => t.accountId)
    const accountId = accountIds[idx]

    if (accountIds[idx - 1] === accountId) return null

    return accountIds.filter(a => a === accountId).length
  }

  return (

    <Table className="min-w-[1024px]">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[120px]">자산군</TableHead>
          <TableHead>투자 자산</TableHead>
          <TableHead className='text-right'>계좌 별 수량</TableHead>
          <TableHead className="text-right min-w-[80px]">총 수량</TableHead>
          <TableHead className="text-right w-[120px]">기록된 평가액</TableHead>
          <TableHead className="text-right w-[120px]">현재 1주 가격</TableHead>
          <TableHead className="text-right w-[160px]">현재 평가액</TableHead>
          <TableHead className="text-right w-[160px]">현재 평가 손익</TableHead>
          <TableHead className="text-right">평가 손익 기록</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableData.map((item, idx) => (
          <ItemsTableRow
            accounts={allAccounts}
            key={item.accountId + '-' + item.name}
            item={item}
          />
        ))}

        <ItemsTableLastRow
          accounts={allAccounts}
          items={tableData}
        />
      </TableBody>
    </Table>

  )
}
