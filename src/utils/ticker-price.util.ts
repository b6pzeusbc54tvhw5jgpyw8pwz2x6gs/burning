import { ItemHistoricalByDate } from "@/states/ticker-historical.state"
import { dateSum } from "./date.util"
import dayjs from "dayjs"

/**
 * base로부터 가장 가까운 entry 기록 날짜를 구한다.
 */
export const getLastItemDate = (base: string, itemHistoricals?: ItemHistoricalByDate) => {
  if (!itemHistoricals || Object.keys(itemHistoricals).length < 1) {
    return null
  }

  // TODO: object는 순서를 보장하지 않으므로, 서버에서 배열 상태에서 min, max를 보내주어야함.
  const minDate = Object.keys(itemHistoricals)[0]

  let selectedDate = base
  while (itemHistoricals[selectedDate] === undefined) {
    if (selectedDate < minDate) {
      return 0
    }

    selectedDate = dateSum(selectedDate, -1)
  }

  return selectedDate
}

/**
 * @param date: Date | string (ex: '20220301')
 * 유틸로 보내자
 */
export const getTickerPrice = (
  dateOrTimestamp: Date | number,
  itemHistoricals?: ItemHistoricalByDate
) => {
  const date = typeof dateOrTimestamp === 'number' ? new Date(dateOrTimestamp) : dateOrTimestamp
  // const dateStr = typeof date === 'string' ? date : dayjs(date).format('YYYYMMDD')
  // console.log("🚀 ~ dateStr:", dateStr)

  if (!itemHistoricals) {
    return null
  }

  const dateStr = dayjs(date).format('YYYYMMDD')
  const selectedDate = getLastItemDate(dateStr, itemHistoricals)
  if (!selectedDate) {
    return null
  }

  return itemHistoricals[selectedDate][3]  // Close 가격
}
