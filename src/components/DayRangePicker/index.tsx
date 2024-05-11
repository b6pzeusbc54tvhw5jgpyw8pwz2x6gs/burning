"use client"

import { toast } from "react-toastify"
import dayjs from "dayjs"
import { useAtom } from "jotai"
import { currentDateAtom, endDateAtom, initialRecent, monthAtom, quarterAtom, recentAtom, startDateAtom, yearAtom } from "@/states/date.state"
import { DayPicker } from "./DayPicker"
import { WhooingStyleSelect } from "./WhooingStyleSelect"
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
  const [date, setDate] = useAtom(currentDateAtom)

  const [year, setYear] = useAtom(yearAtom)
  const [quarter, setQuarter] = useAtom(quarterAtom)
  const [month, setMonth] = useAtom(monthAtom)
  const [recent, setRecent] = useAtom(recentAtom)

  const [startDate, setStartDate] = useAtom(startDateAtom)
  const [endDate, setEndDate] = useAtom(endDateAtom)

  const clearAll = () => {
    setYear(null)
    setQuarter(null)
    setMonth(null)
    setRecent(null)
  }

  const setRangeAndDate = (updatedStartDate: Date, updatedEndDate: Date) => {
    setStartDate(updatedStartDate)
    setEndDate(updatedEndDate)
    if (updatedEndDate.getTime() < date) {
      setDate(updatedEndDate.getTime())
    } else if (updatedStartDate.getTime() > date) {
      setDate(updatedStartDate.getTime())
    }
  }

  const handleSelectYear = (value: string) => {
    clearAll()
    setYear(value)
    const updatedStartDate = dayjs(`${value}-01-01`).toDate()
    const updatedEndDate = dayjs(`${value}-12-31`).toDate()
    setRangeAndDate(updatedStartDate, updatedEndDate)
  }

  const handleSelectQuarter = (value: string) => {
    clearAll()
    setQuarter(value)
    const [year, quarter] = value.split(' ')
    const quarterStartMonth = (Number(quarter.split('/')[0]) - 1) * 3 + 1
    const updatedStartDate = dayjs(`${year}-${String(quarterStartMonth).padStart(2, '0')}-01`).toDate()
    const updatedEndDate = dayjs(`${year}-${String(quarterStartMonth + 2).padStart(2, '0')}-31`).toDate()
    setRangeAndDate(updatedStartDate, updatedEndDate)
  }

  const handleSelectMonth = (value: string) => {
    clearAll()
    setMonth(value)
    const updatedStartDate = dayjs(`${value}-01`).toDate()
    const updatedEndDate = dayjs(`${value}`).endOf('month').toDate()
    setRangeAndDate(updatedStartDate, updatedEndDate)
  }

  const handleSelectRecent = (value: string) => {
    clearAll()
    setRecent(value)
    const now = dayjs().format('YYYY-MM-DD')
    // 3 ←ㅇ, 일 때 3개월 같은 날짜로 돌리고, 만약 5월 31일일때, 2월 31이 되어야하는데
    // 2월이 29일까지밖에 없으므로 31-29=2일 만큼 더해서 3월 2일로 만들어준다. (잘 되는지 확인 필요.)
    let updatedStartDate: Date
    let updatedEndDate: Date
    if (value.endsWith('←ㅇ')) {
      const month = Number(value.split(' ')[0])
      updatedStartDate = dayjs(now).subtract(month, 'month').toDate()
      updatedEndDate = dayjs(now).toDate()
    } else if (value.startsWith('ㅇ→')) {
      const month = Number(value.split(' ')[1])
      updatedStartDate = dayjs(now).toDate()
      updatedEndDate = dayjs(now).add(month, 'month').toDate()
    } else { // if (value.includes('←ㅇ→')) {
      const [start, end] = value.split('←ㅇ→').map(Number)
      updatedStartDate = dayjs(now).subtract(start, 'month').toDate()
      updatedEndDate = dayjs(now).add(end, 'month').toDate()
    }
    setRangeAndDate(updatedStartDate, updatedEndDate)
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
          setValue={handleSelectYear}
        />
        <WhooingStyleSelect
          title="분기별"
          options={quarterOptions}
          now={nowQuarter}
          value={quarter}
          setValue={handleSelectQuarter}
        />
        <WhooingStyleSelect
          title="월별"
          options={monthOptions}
          now={nowMonth}
          value={month}
          setValue={handleSelectMonth}
        />
        <WhooingStyleSelect
          title="최근"
          options={recentOptions}
          value={recent}
          setValue={handleSelectRecent}
        />
      </div>
    </div>
  )
}
