'use client'

import { useAtom, useSetAtom } from 'jotai'
import { StockAsset, stockAssetsAtom } from '@/states/stock-assets.state'
import { getEntries } from '../server/actions/whooing'
import { Account } from '../types/account.type'
import { getMaximumEndDate } from '../util'
import { accountEntriesAtom, fetchAccountEntriesAtom, removeAccountEntriesAtom } from '../states/acount-entries.state'
import { startTransition, useEffect, useRef, useTransition } from 'react'
// import { accountEntriesAtom } from '../states/acount-entries.state'

export const StockAssetLabel = (props: {
  sectionId: string
  account: Account
}) => {
  const { account, sectionId } = props
  const [stockAssets, setStockAssets] = useAtom(stockAssetsAtom)
  const removeAccountEntries = useSetAtom(removeAccountEntriesAtom)
  // const { data } = await getEntries({
  //   sectionId,
  //   accountId: account.account_id,
  //   startDate: account.open_date,
  //   endDate: getMaximumEndDate(account),
  // })

  // const [stockAssets, setStockAssets] = useAtom(stockAssetsAtom)
  // const [isPending, startTransition] = useTransition()
  const [isPending, startTransition] = useTransition()
  // const [accountEntries, setAccountEntries] = useAtom(accountEntriesAtom)

  const fetchAccountEntries = useSetAtom(fetchAccountEntriesAtom)
  const handleRemove = (a: Account) => {
    setStockAssets(prev => prev.filter(p => p.account.account_id !== a.account_id))
    removeAccountEntries(a)
  }

  const didFetch = useRef(false)

  useEffect(() => {
    startTransition(async () => {
      if (didFetch.current) return

      didFetch.current = true
      fetchAccountEntries(account)
    })
  }, [fetchAccountEntries, account])

  return (
    <div
      className="bg-gray-200 dark:bg-zinc-300/30 rounded-lg p-2 whitespace-nowrap cursor-pointer"
      onClick={() => handleRemove(account)}
    >
      {account.title}
    </div>
  )
}
