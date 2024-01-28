// import { useTransition } from 'react'
"use server"

import { getAccounts, getUser } from '@/app/actions'
import { StockAssets } from '../../../components/StockAssets'
import { AllAssets } from '../../../components/AllAssets'
import { StockTable } from '../../../components/StockTable'

export default async function Home({ params }: {
  params: {
    sectionId: string
  }
}) {
  const { sectionId } = params
  const { data: user } = await getUser()
  const { data: accounts } = await getAccounts(sectionId)

  return (
    <main className="flex min-h-screen flex-col p-12">
      <div className="mt-12 mb-2 text-xl font-semibold">
        {`나의 투자 자산`}
      </div>
      <StockAssets sectionId={sectionId} />

      <div className="mt-12 mb-2 text-xl font-semibold">
        {`투자 자산 또는 투자 자산이 들어있는 "거래처 관리 항목" 자산을 선택하세요.`}
      </div>
      <AllAssets sectionId={sectionId} assets={accounts.assets || []} />

      <div className="mt-12 mb-2 text-xl font-semibold">
        {`투자 자산 종목별 현황`}
      </div>
      <StockTable accounts={accounts} />
    </main>
  )
}
