'use client'

import { useEffect, useMemo } from 'react'
import { useAtom } from 'jotai'
import { stockAssetsAtom } from '@/states/stock-assets.state'
import { AllAccounts } from '@/types/account.type'
import { AccountEntries, accountEntriesAtom } from '../states/acount-entries.state'
import { sum } from 'radash'
import { getManualTicker, getTicket, updateItem } from '../util'
import { Item } from '../types/item.type'
import { globalTotalPriceAtom } from '../states/global-total-price.state'
import { Table, TableBody, TableHead, TableHeader, TableRow } from './ui/table'
import { ItemsTableRow } from './ItemsTableRow'
import { ItemsTableLastRow } from './ItemsTableLastRow'
import { nonTickerEvaluatedPricesAtom } from '@/states/non-ticker-evaluated-price.state'
import { tickerPricesAtom } from '@/states/ticker-price.state'

export const ItemsTable = (props: {
  allAccounts: AllAccounts
}) => {
  const { allAccounts } = props
  const [accountEntries] = useAtom(accountEntriesAtom)
  const [stockAssets, setStockAssets] = useAtom(stockAssetsAtom)
  const [globalTotalPrice, setGlobalTotalPrice] = useAtom(globalTotalPriceAtom)
  const [nonTickerEvaluatedPrices] = useAtom(nonTickerEvaluatedPricesAtom)
  const [tickerPrices, setTickerPrices] = useAtom(tickerPricesAtom)

  const tableData = useMemo(() => {
    const isSelected = (ae: AccountEntries) => (
      !!stockAssets.find(sa => (
        sa.sectionId === ae.sectionId && sa.account.account_id === ae.accountId
      ))
    )

    return accountEntries
      .filter(ae => ae.entries)
      .filter(isSelected)
      .map(ae => (ae.entries || []).map(e => ({
        ...e,
        sectionId: ae.sectionId,
        accountId: ae.accountId,
      })))
      .flat()
      .map(o => {
        // console.log("🚀 ~ tableData ~ o:", o)
        return o
      })
      .reduce((acc, cur) => {
        const account = allAccounts.assets?.find(a => a.account_id === cur.accountId)
        if (!account) return acc

        const name = cur.item.split('(')[0]
        const idx = acc.findIndex(a => {
          if (account.category === 'normal') {
            return a.sectionId === cur.sectionId && a.accountId === cur.accountId
          }

          return a.sectionId === cur.sectionId
            && a.accountId === cur.accountId
            && a.name === name
        })

        if (account.category === 'normal') {
          const updatedItem: Item = {
            ...acc[idx],
            accountId: cur.accountId,
            sectionId: cur.sectionId,
            name: account.title,
            totalPrice: cur.total,
            perAccount: {},
            lastItemDate: cur.entry_date,
            totalQty: -1,
          }

          return updateItem(acc, updatedItem, idx)
        }

        const isManualTicker = tickerPrices.some(t => t.ticker === getManualTicker(name))
        const isTickerType = !nonTickerEvaluatedPrices.some(p => (
          p.sectionId === cur.sectionId
            && p.accountId === cur.accountId
            && p.itemName === name
        ))

        if (
          cur.l_account_id === cur.accountId
            && (cur.r_account === 'income' || cur.r_account === 'capital')
        ) {
          // 자산 가치 변동 또는 기초 잔액
          const updatedItem: Item = {
            ...acc[idx],
            sectionId: cur.sectionId,
            accountId: cur.accountId,
            name,
            totalPrice: (acc[idx]?.totalPrice || 0) + cur.money,
            perAccount: acc[idx]?.perAccount || {},
            totalQty: acc[idx]?.totalQty || 0,
            ticker: isManualTicker
              ? getManualTicker(cur.item)
              : getTicket(cur.memo) || acc[idx]?.ticker,
            lastItemDate: cur.entry_date,
          }

          return updateItem(acc, updatedItem, idx)
        }

        // 매수 또는 매도
        const type = cur.l_account_id === cur.accountId ? 'buy' : 'sell'
        const from = type === 'buy' ? cur.r_account_id : cur.l_account_id
        const qty = isTickerType
          ? Number(cur.item?.split('(')[1]?.split(/[),]/)[0] || 0)
          : type === 'buy' ? cur.money : -cur.money
        const totalQty = sum(Object.values(acc[idx]?.perAccount || [])) + qty
        const updatedItem: Item = {
          ...acc[idx],
          sectionId: cur.sectionId,
          accountId: cur.accountId,
          name,
          perAccount: {
            ...acc[idx]?.perAccount,
            [from]: ((acc[idx] || {}).perAccount?.[from] || 0) + qty
          },
          totalQty,
          totalPrice: type === 'buy'
            ? (acc[idx]?.totalPrice || 0) + cur.money
            : (acc[idx]?.totalPrice || 0) - cur.money,
          ticker: isManualTicker
            ? getManualTicker(cur.item)
            : getTicket(cur.memo) || acc[idx]?.ticker,
          lastItemDate: cur.entry_date,
        }

        if (updatedItem.perAccount[from] === 0) {
          delete updatedItem.perAccount[from]
        }

        return updateItem(acc, updatedItem, idx)
      }, [] as Item[])
      .filter(i => i.totalPrice > 0)

  }, [accountEntries, stockAssets, nonTickerEvaluatedPrices, tickerPrices, allAccounts])

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
