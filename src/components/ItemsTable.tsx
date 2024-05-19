'use client'

import { useEffect, useRef, useState } from 'react'
import { useAtom } from 'jotai'
import { AllAccounts } from '@/types/account.type'
import { sum } from 'radash'
import { globalTotalPriceAtom } from '../states/global-total-price.state'
import { Table, TableBody, TableHead, TableHeader, TableRow } from './ui/table'
import { ItemsTableRow } from './ItemsTableRow'
import { ItemsTableLastRow } from './ItemsTableLastRow'
import { useTableRowItems } from '@/hooks/use-table-row-items'
import { useInvestableItems } from '@/hooks/use-investable-items'
import { useInvestableEntries } from '@/hooks/use-investable-entries'
import { PieChart } from '@/components/PieChart'
import { GridCard } from '@/layouts/GridCard'

export const ItemsTable = (props: {
  sectionId: string
  allAccounts: AllAccounts
}) => {
  const { allAccounts, sectionId } = props

  const [, setGlobalTotalPrice] = useAtom(globalTotalPriceAtom)

  const investableEntries = useInvestableEntries(allAccounts)
  const investableItems = useInvestableItems(investableEntries)
  const tableRowItems = useTableRowItems(investableItems, allAccounts)

  useEffect(() => {
    setGlobalTotalPrice(sum(tableRowItems.map(item => item.totalPrice)))
  }, [tableRowItems, setGlobalTotalPrice])

  // const getRowSpan = (idx: number) => {
  //   // 다음 항목들이 몇개나 동일한 accountId를 사용하는지 반환.
  //   // 각 accountId별로 첫번째 항목에만 rowSpan을 적용하고, 나머지는 null 반환.
  //   const accountIds = tableData.map(t => t.accountId)
  //   const accountId = accountIds[idx]

  //   if (accountIds[idx - 1] === accountId) return null

  //   return accountIds.filter(a => a === accountId).length
  // }

  return (

    <div>
      <GridCard
        title='자산군별 비중'
        className='flex-col'
      >
        <PieChart tableRowItems={tableRowItems} />
      </GridCard>

      <GridCard
        className='flex-col'
      >
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
            {tableRowItems.map(item => (
              <ItemsTableRow
                key={item.sectionId + '-' + item.accountId + '-' + item.name}
                item={item}
                accounts={allAccounts}
              />
            ))}

            <ItemsTableLastRow items={tableRowItems} />
          </TableBody>
        </Table>
      </GridCard>

    </div>

  )
}
