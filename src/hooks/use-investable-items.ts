import { group, last, sum } from "radash"
import { useEffect, useMemo } from "react"
import { Entry } from "@/types/entry.type"
import { DateTradingInfo, InvestableItem } from "@/types/item.type"
import { getTicketByMemos, getUndefinedTicker, isAutoTicker } from "@/utils/ticker-name.util"
import { useAtom, useSetAtom } from "jotai"
import { putAndFetchItemHistoricalsAtom } from "@/states/ticker-historical.state"
import { tickerNameByItemKeyAtom } from "@/states/ticker-name.state"

export const useInvestableItems = (
  investableEntries: Record<string, Entry[]>
): InvestableItem[] => {
  const putAndFetchItemHistoricals = useSetAtom(putAndFetchItemHistoricalsAtom)
  const [tickerNameByItemKey] = useAtom(tickerNameByItemKeyAtom)

  const investableItems = useMemo(() => {
    const keys = Object.keys(investableEntries)

    // entriesByItemName의 key는 ${setiongId}-${accountId}-${itemName} 형태
    const entriesByItemName: Record<string, Entry[]> = keys.reduce((acc, key) => {
      const entries = investableEntries[key]
      return {
        ...acc,
        ...entries.reduce((acc, entry) => {
          const itemKey = `${key}-${entry.item.split('(')[0]}`
          return { ...acc, [itemKey]: [...(acc[itemKey] || []), entry] }
        }, {} as Record<string, Entry[]>)
      }
    }, {} as Record<string, Entry[]>)

    const itemKeys = Object.keys(entriesByItemName)
    return itemKeys.map(key => {
      const [sectionId, accountId, ...rest] = key.split('-')
      const itemName = rest.join('-')
      const entries = entriesByItemName[key]
      const ticker = tickerNameByItemKey[key]
      // || getTicketByMemos(entries.map(e => e.memo))
      // || getUndefinedTicker(sectionId, accountId, itemName)

      const groupedByDate = group(entries, e => e.entry_date)
      const dates = Object.keys(groupedByDate)
      const tradingInfos = dates.reduce<DateTradingInfo[]>((acc, date) => {
        const prev = last(acc)
        const openQty = prev
          ? prev.openQty + sum(prev.buy.map(b => b.qty)) + sum(prev.sell.map(s => s.qty))
          : 0

        // last written price. 가계부에 기록된 마지막 가격.
        const prevLastWrittenPrice = prev ? prev.lastWrittenPrice : 0

        const entries = groupedByDate[date]!
        const lastWrittenPrice = entries.reduce((acc, cur) => {
          return cur.r_account_id === accountId
            ? acc - cur.money
            : acc + cur.money
        }, prevLastWrittenPrice)

        const buy = entries
          .filter(e => e.l_account_id === accountId)
          .map(entry => ({
            qty: Number(entry.item.split('(')[1]?.split(/[),]/)[0] || 0),
            price: entry.money,
            accountId: entry.r_account_id,
          }))
        const sell = entries
          .filter(e => e.r_account_id === accountId)
          .map(entry => ({
            qty: Number(entry.item.split('(')[1]?.split(/[),]/)[0] || 0), // 일반 매도 거래의 경우 마이너스 값이 있어야함.
            price: entry.money,
            accountId: entry.l_account_id,
          }))

        return [
          ...acc,
          // 마지막 가계부 기록 금액.
          { date, openQty, buy, sell, lastWrittenPrice },
        ]
      }, [])

      return { sectionId, accountId, ticker, itemName, tradingInfos }
    })
  }, [investableEntries, tickerNameByItemKey])

  // 추가된 Ticker가 있으면 패치한다.
  // putAndFetchItemHistoricals에 중복 호출 방지 로직이 있으므로 여러번 호출해도 문제 없음.
  useEffect(() => {
    investableItems
      .filter(item => isAutoTicker(item.ticker))
      .forEach(item => putAndFetchItemHistoricals(item.ticker))
  }, [investableItems, putAndFetchItemHistoricals])

  return investableItems
}
