'use client'

import { useAtom } from 'jotai'
import { StockAsset, stockAssetsAtom } from '@/states/stock-assets.state'
import { StockAssetLabel } from './StockAssetLabel'
import { Button } from './ui/button'
import { Dialog, DialogTrigger } from './ui/dialog'
import { AllAssetsDialogContent } from './AllAssetsDialogContent'

export const StockAssets = (props: {
  sectionId: string
}) => {
  const { sectionId } = props
  const [stockAssets, setStockAssets] = useAtom(stockAssetsAtom)

  return (
    <div className="flex flex-wrap max-w-5xl w-full gap-2">
      {stockAssets.map((a: StockAsset) => (
        <StockAssetLabel
          key={a.account.account_id}
          account={a.account}
          sectionId={sectionId}
        />
      ))}

      <Dialog >
        <DialogTrigger asChild>
          <Button variant="outline">
            + 자산 추가
          </Button>
        </DialogTrigger>
        <AllAssetsDialogContent sectionId={sectionId} />

      </Dialog>
    </div>
  )
}
