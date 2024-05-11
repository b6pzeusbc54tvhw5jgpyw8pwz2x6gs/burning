"use client"

import { toast } from "react-toastify"
import dayjs from "dayjs"
import { useAtom } from "jotai"
import { endDateAtom, startDateAtom } from "@/states/date.state"
import { DayPicker } from "./DayPicker"
import { WhooingStyleSelect } from "./ShortcutSelects"
import { useState } from "react"

const nowYear = dayjs().format('YYYY')
const nowMonth = dayjs().format('YYYY-MM')
const nowQuarter = `${nowYear} ${Math.floor(dayjs().month() / 3) + 1}/4`

const yearOptions = Array.from({ length: 17 }, (_, i) => String(Number(nowYear) - 15 + i))
// 분기별. yearOptions이 ['2021','2022'] 일 때 분기별은 ['2021 1/4','2021 2/4','2021 3/4','2021 4/4','2022 1/4','2022 2/4','2022 3/4','2022 4/4']
const quarterOptions = yearOptions.flatMap(year => (
  Array.from({ length: 4 }, (_, i) => `${year} ${i + 1}/4`)
))
// 월별. yearOptions이 ['2021','2022'] 일 때 월별은 ['2021-01','2021-02','2021-03',...,'2022-12']
const monthOptions = yearOptions.flatMap(year => (
  Array.from({ length: 12 }, (_, i) => `${year}-${String(i + 1).padStart(2, '0')}`)
))
const recentOptions = [
  '36 ←ㅇ', '24 ←ㅇ', '12 ←ㅇ', '6 ←ㅇ', '3 ←ㅇ', '1 ←ㅇ',
  'ㅇ→ 1', 'ㅇ→ 3', 'ㅇ→ 6', 'ㅇ→ 12', 'ㅇ→ 24', 'ㅇ→ 36',
  '1 ←ㅇ→ 1', '3 ←ㅇ→ 3', '6 ←ㅇ→ 6', '12←ㅇ→12', '24←ㅇ→24', '36←ㅇ→36',
  '6←ㅇ→3', '12←ㅇ→3', '24←ㅇ→3', '36←ㅇ→3'
]

export function DayRangePicker() {
  const [startDate, setStartDate] = useAtom(startDateAtom)
  const [endDate, setEndDate] = useAtom(endDateAtom)

  const [year, setYear] = useState<string | null>(null)
  const [quarter, setQuarter] = useState<string | null>(null)
  const [month, setMonth] = useState<string | null>(null)
  const [recent, setRecent] = useState<string | null>(null)

  const clearAll = () => {
    setYear(null)
    setQuarter(null)
    setMonth(null)
    setRecent(null)
  }

  return (
    <div className="flex items-center">
      <div className="flex items-center gap-1 flex-grow">
        <DayPicker
          date={startDate}
          setDate={setStartDate}
          checkAndGetInvalidMessage={(date) => (
            date > endDate ? "시작일은 종료일보다 이전이어야 합니다." : null
          )}
        />
        <span>~</span>
        <DayPicker
          date={endDate}
          setDate={setEndDate}
          checkAndGetInvalidMessage={(date) => (
            date < startDate ? "종료일은 시작일보다 이후이어야 합니다." : null
          )}
        />
      </div>
      <div className="flex bg-[#646464] p-[1px] gap-[1px]">
        <WhooingStyleSelect
          title="연도별"
          options={yearOptions}
          now={nowYear}
          value={year}
          setValue={v => {
            clearAll()
            setYear(v)
          }}
        />
        <WhooingStyleSelect
          title="분기별"
          options={quarterOptions}
          now={nowQuarter}
          value={quarter}
          setValue={v => {
            clearAll()
            setQuarter(v)
          }}
        />
        <WhooingStyleSelect
          title="월별"
          options={monthOptions}
          now={nowMonth}
          value={month}
          setValue={v => {
            clearAll()
            setMonth(v)
          }}
        />
        <WhooingStyleSelect
          title="최근"
          options={recentOptions}
          value={recent}
          setValue={v => {
            clearAll()
            setRecent(v)
          }}
        />
      </div>
    </div>
  )
}
