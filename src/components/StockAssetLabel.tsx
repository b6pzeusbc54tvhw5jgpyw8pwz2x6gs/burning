'use client'

import { useSetAtom } from 'jotai'
import { Account } from '../types/account.type'
import { fetchEntriesByAccountAtom, removeAccountEntriesAtom } from '../states/acount-entries.state'
import { useEffect, useRef, useTransition } from 'react'
import { Button } from './ui/button'

export const StockAssetLabel = (props: {
  account: Account
  unselect: (a: Account) => void
}) => {
  const { account, unselect } = props
  const removeAccountEntries = useSetAtom(removeAccountEntriesAtom)
  const [isPending, startTransition] = useTransition()

  const fetchAccountEntries = useSetAtom(fetchEntriesByAccountAtom)
  const handleRemove = (a: Account) => {
    unselect(a)
    removeAccountEntries(a)
  }

  const didFetch = useRef(false)

  useEffect(() => {
    startTransition(async () => {
      if (didFetch.current) return

      didFetch.current = true
      console.log('call fetch')
      fetchAccountEntries(account)
    })
  }, [fetchAccountEntries, account])

  return (
    <Button
      onClick={() => handleRemove(account)}
    >
      {account.title}
    </Button>
  )
}
