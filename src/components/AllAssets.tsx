'use client'

import { useMemo } from 'react'
import { useAtom, useSetAtom } from 'jotai'
import { stockAssetsAtom } from '@/states/stock-assets.state'
import { Account } from '@/types/account.type'
import { removeAccountEntriesAtom } from '../states/acount-entries.state'

export const AllAssets = (props: {
  sectionId: string
  assets: Account[]
}) => {
  const { assets, sectionId } = props
  const [stockAssets, setStockAssets] = useAtom(stockAssetsAtom)
  const removeAccountEntries = useSetAtom(removeAccountEntriesAtom)

  const handleAdd = (a: Account) => {
    const found = stockAssets.find(p => p.account.account_id === a.account_id)
    if (!found) {
      setStockAssets(prev => [...prev, { account: a, sectionId }])
      return
    }

    setStockAssets(prev => prev.filter(p => p.account.account_id !== a.account_id))
    removeAccountEntries(a)
  }

  const stockAssetsWithSelected = useMemo(() => {
    return assets
      .filter(as => as.type !== 'group')
      .map(asset => {
        const found = stockAssets.find(sa => sa.account.account_id === asset.account_id)
        return {
          ...asset,
          selected: !!found,
        }
      })
  }, [stockAssets, assets])

  return (
    <div className="flex flex-wrap max-w-5xl w-full gap-2">
      {stockAssetsWithSelected.map(a => (
        <span
          key={a.account_id}
          className={a.selected
            ? "bg-gray-400 dark:bg-zinc-600/30 rounded-lg p-2 whitespace-nowrap cursor-pointer"
            : "bg-gray-200 dark:bg-zinc-300/30 rounded-lg p-2 whitespace-nowrap cursor-pointer"
          }
          onClick={() => handleAdd(a)}
        >
          {a.title}
        </span>
      ))}
    </div>
  )
}
