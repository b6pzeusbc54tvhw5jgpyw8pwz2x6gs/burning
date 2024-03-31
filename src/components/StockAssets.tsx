'use client'

import { useAtom } from 'jotai'
import { StockAsset, stockAssetsAtom } from '@/states/stock-assets.state'
import { StockAssetLabel } from './StockAssetLabel'
import { Button } from './ui/button'
import { Dialog, DialogTrigger } from './ui/dialog'
import { AllAssetsDialogContent } from './AllAssetsDialogContent'
import { AccountSelect } from './AccountSelect'

export const StockAssets = (props: {
  sectionId: string
}) => {
  const { sectionId } = props
  const [stockAssets, setStockAssets] = useAtom(stockAssetsAtom)

  return (
    <div className="flex max-w-5xl w-full gap-4">

      <div className='basis-1/5'>
        <AccountSelect sectionId={sectionId} />
      </div>

      <div className='flex flex-wrap basis-4/5 gap-1'>
        {stockAssets.map((a: StockAsset) => (
          <StockAssetLabel
            key={a.account.account_id}
            account={a.account}
            sectionId={sectionId}
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
