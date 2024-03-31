'use client'

import { useEffect, useMemo, useRef, useState } from "react"
import { CommandForSelect } from "./CommandForSelect"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useAccounts } from "@/data/hooks"
import { useAtom, useSetAtom } from "jotai"
import { stockAssetsAtom, toggleStockAssetAtom } from "@/states/stock-assets.state"

export const AccountSelect = (props: {
  sectionId: string
}) => {
  const { sectionId } = props
  const [openedAccountSelect, setOpenedAccountSelect] = useState(false)

  const { data: accounts} = useAccounts(sectionId)
  const [seletedAssets, setSelectedAssets] = useAtom(stockAssetsAtom)
  const toggleStockAsset = useSetAtom(toggleStockAssetAtom)

  const selectedItems = useMemo(() => {
    return seletedAssets.map(a => a.account.account_id)
  }, [seletedAssets])

  const items = useMemo(() => {
    return (accounts?.assets || []).map(a => ({
      value: a.account_id,
      label: a.title,
    }))
  }, [accounts?.assets])

  const handleSelect = (accountId: string) => {
    const account = accounts?.assets?.find(a => a.account_id === accountId)
    if (!account) return

    toggleStockAsset({ sectionId, account })
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
