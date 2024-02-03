// import { useTransition } from 'react'
"use server"

import { getAccounts, getUser } from '@/server/actions/whooing'
import { StockAssets } from '@/components/StockAssets'
import { AllAssets } from '@/components/AllAssets'
import { StockTable } from '@/components/StockTable'
import { Button } from "@/components/ui/button"
import { ItemsTable } from '@/components/ItemsTable'

// import { useAtom } from 'jotai'
// import { globalTotalPriceAtom } from '../../../states/global-total-price.state'
// import { Box } from '@radix-ui/themes'

export default async function Home({ params }: {
  params: {
    sectionId: string
  }
}) {
  const { sectionId } = params
  const accounts = await getAccounts(sectionId)

  return (
    // <main className="flex min-h-screen flex-col p-12">
    <div>
      <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight mb-2">
        {`투자 자산 목록`}
      </h3>

      <StockAssets sectionId={sectionId} />

      {/* <StockTable accounts={accounts} /> */}
      <ItemsTable accounts={accounts} />
    </div>
    // </main>
  )
}
