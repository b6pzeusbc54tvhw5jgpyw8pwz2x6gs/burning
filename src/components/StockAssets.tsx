'use client'

import { useAtom, useSetAtom } from 'jotai'
import { removeStockAssetAtom, stockAssetsAtom, toggleStockAssetAtom } from '@/states/selected-assets.state'
import { StockAssetLabel } from './StockAssetLabel'
import { AccountSelect } from './AccountSelect'
import { Account } from '@/types/account.type'

export const StockAssets = (props: {
  sectionId: string
}) => {
  const { sectionId } = props
  const [stockAssets] = useAtom(stockAssetsAtom)
  const toggle = useSetAtom(toggleStockAssetAtom)
  const unselect = useSetAtom(removeStockAssetAtom)

  return (
    <div className="flex max-w-5xl w-full gap-4">

      <div className='basis-1/5'>
        <AccountSelect sectionId={sectionId} toggle={toggle} selectedAccounts={stockAssets} />
      </div>

      <div className='flex flex-wrap basis-4/5 gap-1'>
        {stockAssets.map((a: Account) => (
          <StockAssetLabel
            key={`${a.sectionId}-${a.account_id}`}
            account={a}
            unselect={unselect}
          />
        ))}
      </div>

      {/* <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            + 자산 추가
          </Button>
        </DialogTrigger>
        <AllAssetsDialogContent sectionId={sectionId} />
      </Dialog> */}
    </div>
  )
}
