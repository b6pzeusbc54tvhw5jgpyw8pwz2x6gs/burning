// import { useTransition } from 'react'

import { getAccounts, getUser } from '@/server/actions/whooing'
import { StockAssets } from '@/components/StockAssets'
import { AllAssets } from '@/components/AllAssets'
import { StockTable } from '@/components/StockTable'
import { Button } from "@/components/ui/button"
import { ItemsTable } from '@/components/ItemsTable'
import { GlobalTotalPrice } from '@/components/GlobalTotalPrice'

export default async function Home({ params }: {
  params: {
    sectionId: string
  }
}) {
  const { sectionId } = params
  const accounts = await getAccounts(sectionId)

  return (
    <div>
      <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight mb-2">
        {`투자 자산 목록`}
      </h3>

      <StockAssets sectionId={sectionId} />

      <div className="mt-12 mb-2 text-xl font-semibold">
        {`투자 자산 종목별 현황 (총 `}
        <GlobalTotalPrice />
        {`원)`}
      </div>
      <ItemsTable accounts={accounts} />
    </div>
    // </main>
  )
}
