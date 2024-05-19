import { useAtom } from 'jotai'
import { getAllAccounts } from '@/server/actions/whooing'
import { StockAssets } from '@/components/StockAssets'
import { ItemsTable } from '@/components/ItemsTable'
import { GlobalTotalPrice } from '@/components/GlobalTotalPrice'
import { SubTitleAndDescription } from '@/components/SubTitleAndDescription'
import { DateSlider } from '@/components/DateSlider'
import { DayRangePicker } from '@/components/DayRangePicker'
import { GridCard } from '@/layouts/GridCard'

export default async function Home({ params }: {
  params: {
    sectionId: string
  }
}) {
  const { sectionId } = params
  const accounts = await getAllAccounts(sectionId)

  return (
    <div className='flex flex-col gap-6 w-full'>
      <GridCard
        className='flex-col'
      >
        <SubTitleAndDescription
          title={`투자 자산 목록`}
          description={`주식, ETF, 예금, 적금, RP, 개별 채권 등 투자 자산이 담긴 자산을 선택하세요.`}
        />
        <StockAssets sectionId={sectionId} />
      </GridCard>

      <GridCard
        className='flex-col'
      >
        <DayRangePicker />
        <DateSlider />
      </GridCard>

      <div className="mt-12 mb-2 text-xl font-semibold">
        {`투자 자산 종목별 현황 (총 `}
        <GlobalTotalPrice />
        {`원)`}
      </div>
      <ItemsTable
        sectionId={sectionId}
        allAccounts={accounts}
      />
    </div>
  )
}
