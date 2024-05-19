'use client'

import { useMemo, useState } from "react"
import { CommandForSelect } from "./CommandForSelect"
import { Input } from "./ui/input"
import { useAccounts } from "@/data/hooks"
import { Account } from "@/types/account.type"

export const AccountSelect = (props: {
  sectionId: string
  selectedAccounts: Account[]
  toggle: (account: Account) => void
}) => {
  const { sectionId, toggle, selectedAccounts } = props
  const [openedAccountSelect, setOpenedAccountSelect] = useState(false)

  const { data: accounts} = useAccounts(sectionId)

  const selectedItems = useMemo(() => {
    return selectedAccounts.map(a => a.account_id)
  }, [selectedAccounts])

  const items = useMemo(() => {
    return (accounts?.assets || []).map(a => ({
      value: a.account_id,
      label: a.title,
      type: a.type,
    }))
  }, [accounts?.assets])

  const handleSelect = (accountId: string) => {
    const account = accounts?.assets?.find(a => a.account_id === accountId)
    if (!account) return

    toggle(account)
  }

  return (
    <div className="w-full h-12 relative">
      {openedAccountSelect ? (
        <CommandForSelect
          placeHolder="+ 자산 선택"
          handleClose={() => setOpenedAccountSelect(false)}
          handleSelect={handleSelect}
          selectedItems={selectedItems}
          items={items}
          multi
        />
      ) : (
        <Input onClick={() => setOpenedAccountSelect(true)}
          placeholder="+ 자산 선택"
        />
      )}
    </div>
  )
}
