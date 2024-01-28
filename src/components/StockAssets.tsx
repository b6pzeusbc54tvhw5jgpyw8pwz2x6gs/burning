'use client'

import { useAtom } from 'jotai'
import { StockAsset, stockAssetsAtom } from '@/states/stock-assets.state'
import { StockAssetLabel } from './StockAssetLabel'

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
    </div>
  )
}
