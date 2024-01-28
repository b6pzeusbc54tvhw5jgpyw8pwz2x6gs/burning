'use client'

import { useMemo } from 'react'
import { useAtom } from 'jotai'
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

const colors = [
  "md:bg-red-500/50",
  "md:bg-amber-500/50",
  "md:bg-lime-500/50",
  "md:bg-emerald-500/50",
  "md:bg-cyan-500/50",
  "md:bg-blue-500/50",
  "md:bg-violet-500/50",
  "md:bg-fuchsia-500/50",
  "md:bg-rose-500/50",
  "md:bg-orange-500/50",
  "md:bg-yellow-500/50",
  "md:bg-green-500/50",
  "md:bg-teal-500/50",
  "md:bg-sky-500/50",
  "md:bg-indigo-500/50",
  "md:bg-purple-500/50",
  "md:bg-pink-500/50",
]

interface Item {
  sectionId: string
  accountId: string
  name: string
  isFund: boolean
  perAccount: {  // 계좌별 수량
    [from: string]: number
  }
  totalQty: number
  totalPrice: number
}

const columnHelper = createColumnHelper<Item>()

const columns: ColumnDef<Item, any>[] = [
  columnHelper.accessor('accountId', {
    header: () => '자산',
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('name', {
    cell: info => info.getValue(),
  }),
  columnHelper.accessor('perAccount', {
    header: () => 'perAccount',
  }),
  columnHelper.accessor('totalQty', {
    header: () => <span>totalQty</span>,
    cell: info => `${info.row.original.totalQty.toLocaleString()}${info.row.original.isFund ? '원' : '주'}`,
    // cell: info => `${info.getValue().toLocaleString()}${info.row.original.isFund ? '원' : '주'}`,
  }),
  columnHelper.accessor('totalPrice', {
    header: () => <span>마지막 기록 가격</span>,
    // 3자리마다 `,` 찍는다
    // cell: info => info.getValue() + '원',
    cell: info => info.getValue().toLocaleString() + '원',
  }),
]

export const StockTable = (props: {
  accounts: Record<string, Account[]>
}) => {
  const { accounts } = props
  const income = useMemo(() => accounts.income || [], [accounts])
  const assets = useMemo(() => accounts.assets || [], [accounts])
  const capital = useMemo(() => accounts.capital || [], [accounts])
  const [accountEntries] = useAtom(accountEntriesAtom)
  const [stockAssets, setStockAssets] = useAtom(stockAssetsAtom)

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
        const name = cur.item.split('(')[0]
        const isFund = cur.item.startsWith('펀드 ')
        console.log(cur)
        const idx = acc.findIndex(a =>
          a.sectionId === cur.sectionId
            && a.accountId === cur.accountId
            && a.name === name
        )

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
            isFund,
            totalPrice: (acc[idx]?.totalPrice || 0) + cur.money,
            perAccount: acc[idx]?.perAccount || {},
            totalQty: acc[idx]?.totalQty || 0,
          }
          console.log("🚀 ~ .reduce ~ updatedItem:", updatedItem)

          if (idx === -1) {
            return [...acc, updatedItem]
          }

          return [
            ...acc.slice(0, idx),
            updatedItem,
            ...acc.slice(idx + 1)
          ]
        }

        // 매수 또는 매도
        const type = cur.l_account_id === cur.accountId ? 'buy' : 'sell'
        const from = type === 'buy' ? cur.r_account_id : cur.l_account_id
        const qty = isFund
          ? cur.money
          : Number(cur.item?.split('(')[1]?.split(/[),]/)[0] || 0)
        const totalQty = sum(Object.values(acc[idx]?.perAccount || [])) + qty
        const updatedItem: Item = {
          ...acc[idx],
          sectionId: cur.sectionId,
          accountId: cur.accountId,
          name,
          isFund,
          perAccount: {
            ...acc[idx]?.perAccount,
            [from]: ((acc[idx] || {}).perAccount?.[from] || 0) + qty
          },
          totalQty,
          totalPrice: type === 'buy'
            ? (acc[idx]?.totalPrice || 0) + cur.money
            : (acc[idx]?.totalPrice || 0) - cur.money
        }
        console.log("🚀 ~ .reduce ~ updatedItem:", updatedItem)

        if (updatedItem.perAccount[from] === 0) {
          delete updatedItem.perAccount[from]
        }

        if (idx === -1) {
          return [...acc, updatedItem]
        }

        return [
          ...acc.slice(0, idx),
          updatedItem,
          ...acc.slice(idx + 1)
        ]
      }, [] as Item[])
      .filter(i => i.totalQty > 0)

  }, [accountEntries, stockAssets])

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const assetIds = useMemo(() => (
    unique(stockAssets.map(sa => sa.account.account_id))
  ), [stockAssets])

  const getBGColorCN = (accountId: string) => {
    const found = assets.find(a => a.account_id === accountId)
    if (!found) return 'transparent'

    const idx = assetIds.findIndex(a => a === accountId)
    return colors[idx]
  }

  const getAssetName = (accountId: string) => {
    const found = assets.find(a => a.account_id === accountId)
    return found ? found.title : 'Unknown'
  }

  const getRowSpan = (idx: number) => {
    // 다음 항목들이 몇개나 동일한 accountId를 사용하는지 반환.
    // 각 accountId별로 첫번째 항목에만 rowSpan을 적용하고, 나머지는 null 반환.
    const accountIds = tableData.map(t => t.accountId)
    const accountId = accountIds[idx]

    if (accountIds[idx - 1] === accountId) return null

    return accountIds.filter(a => a === accountId).length
  }

  return (
    <div className="p-2">
      <table
        className="table-auto w-full"
      >
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </th>
              ))}

              <th>
                현재 1주 가격
              </th>
              <th>
                평가 손익
              </th>
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map(row => {
            const rowSpan = getRowSpan(row.index)
            return (

              <tr
                key={row.id}
                className={`border-b-2 p-4 m-2 ${getBGColorCN(row.original.accountId)}`}
              >
                {row.getVisibleCells().map(cell => {
                  if (cell.column.id === 'perAccount') {
                    return (
                      <td key={cell.id} className='p-4'>
                        {Object.keys(cell.getValue()!).map(from => (
                          <div key={from}>
                            <span>
                              {getAssetName(from)} : {(cell.getValue() as Record<string, number>)[from]}
                            </span>
                            <span>
                              {cell.row.original.isFund ? '원' : '주'}
                            </span>
                          </div>
                        ))}
                      </td>
                    )
                  }

                  if (cell.column.id === 'accountId') {
                    return rowSpan ? (
                      <td
                        key={cell.id}
                        className='p-4 border-r-2'
                        rowSpan={rowSpan}
                      >
                        {getAssetName(cell.getValue() as string)}
                      </td>
                    ) : null
                  }
                  return (
                    <td
                      key={cell.id}
                      className={`p-2 ${cell.column.id === 'name' ? 'text-left' : 'text-right'}`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  )
                })}

                <td className='text-right'>
                  {row.original.isFund ? '-' : row.original.totalPrice / row.original.totalQty}원
                </td>

                <td className='text-right'>
                  {row.original.isFund ? '-' : row.original.totalPrice / row.original.totalQty}원
                </td>

                {rowSpan ? (
                  <td
                    className='p-4 border-l-2 text-center'
                    rowSpan={rowSpan}
                  >
                    <button>현재 가격 반영</button>
                  </td>
                ) : null}
              </tr>
            )})}
        </tbody>
      </table>
    </div>
  )

  //   <div className="flex flex-col max-w-5xl w-full gap-2">
  //     <div className="flex flex-row">
  //       <h3>주식이름</h3>
  //       <h3>계좌</h3>
  //       <h3>수량</h3>
  //     </div>
  //     {items.map(item => (
  //       <div key={item.sectionId + item.accountId + item.name}>
  //         <h3>{item.name}</h3>
  //         <table>
  //           <thead>
  //             <tr>
  //               <th>계좌</th>
  //               <th>수량</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {Object.entries(item.perAccount).map(([from, qty]) => (
  //               <tr key={from}>
  //                 <td>{from}</td>
  //                 <td>{qty}</td>
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //       </div>
  //     ))}
  //   </div>
  // )
}
