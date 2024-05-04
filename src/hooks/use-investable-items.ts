import { group, last, sum, unique } from "radash"
import { useEffect, useMemo } from "react"
import { Entry } from "@/types/entry.type"
import { DateTradingInfo, InvestableItem } from "@/types/item.type"
import { getTickerByMemos, isAutoTicker } from "@/utils/ticker-name.util"
import { useAtom, useSetAtom } from "jotai"
import { putAndFetchItemHistoricalsAtom } from "@/states/ticker-historical.state"
import { tickerNameByItemKeyAtom } from "@/states/ticker-name.state"

const getOpenQtyPerAccount = (prev?: DateTradingInfo) => {
  if (!prev) return {}

  // 여기부터
  const accountIds = unique([
    ...Object.keys(prev.openQtyPerAccount),
    ...prev.buy.map(b => b.accountId),
    ...prev.sell.map(b => b.accountId),
  ])

  return accountIds.reduce((acc, accountId) => {
    const buyQty = sum(prev.buy.filter(b => b.accountId === accountId).map(b => b.qty))
    const sellQty = sum(prev.sell.filter(b => b.accountId === accountId).map(b => b.qty))
    return {
      ...acc,
      [accountId]: (prev.openQtyPerAccount[accountId] || 0) + buyQty + sellQty,
    }
  }, prev.openQtyPerAccount as Record<string, number>)
}

const getCloseQtyPerAccount = (
  openQtyPerAccount: Record<string, number>,
  buy: { qty: number, accountId: string }[],
  sell: { qty: number, accountId: string }[]
) => {
  const accountIds = unique([
    ...Object.keys(openQtyPerAccount),
    ...buy.map(b => b.accountId),
    ...sell.map(b => b.accountId),
  ])

  const result = accountIds.reduce((acc, accountId) => {
    const buyQty = sum(buy.filter(b => b.accountId === accountId).map(b => b.qty))
    const sellQty = sum(sell.filter(b => b.accountId === accountId).map(b => b.qty))
    return {
      ...acc,
      [accountId]: (openQtyPerAccount[accountId] || 0) + buyQty + sellQty,
    }
  }, openQtyPerAccount)

  // number가 0인건 제거.
  return Object.keys(result).reduce((acc, accountId) => {
    return result[accountId] === 0 ? acc : { ...acc, [accountId]: result[accountId] }
  }, {})
}

export const useInvestableItems = (
  investableEntries: Record<string, Entry[]>
): InvestableItem[] => {
  const putAndFetchItemHistoricals = useSetAtom(putAndFetchItemHistoricalsAtom)
  const [tickerNameByItemKey] = useAtom(tickerNameByItemKeyAtom)

  const keys = useMemo(() => Object.keys(investableEntries), [investableEntries])

  const entriesByItemName: Record<string, Entry[]> = useMemo(() => {
    return keys.reduce((acc, key) => {
      const entries = investableEntries[key]
      return {
        ...acc,
        ...entries.reduce((acc, entry) => {
          const itemKey = `${key}-${entry.item.split('(')[0]}`
          return { ...acc, [itemKey]: [...(acc[itemKey] || []), entry] }
        }, {} as Record<string, Entry[]>)
      }
    }, {} as Record<string, Entry[]>)
  }, [investableEntries, keys])

  const investableItems: InvestableItem[] = useMemo(() => {

    const itemKeys = Object.keys(entriesByItemName)

    return itemKeys.map(key => {
      const [sectionId, accountId, ...rest] = key.split('-')
      const itemName = rest.join('-')
      const entries = entriesByItemName[key]
      const ticker = tickerNameByItemKey[key]
      const tickerFromMemos = ticker ? undefined : getTickerByMemos(entries.map(e => e.memo))
      // || getTicketByMemos(entries.map(e => e.memo))
      // || getUndefinedTicker(sectionId, accountId, itemName)

      const groupedByDate = group(entries, e => e.entry_date.split('.')[0])
      const dates = Object.keys(groupedByDate)
      console.log("🚀 ~ constinvestableItems:InvestableItem[]=useMemo ~ dates:", dates)

      // 각 종목 별 거래 정보(tradingInfos)를 일자별로 가공.
      const tradingInfos = dates.reduce<DateTradingInfo[]>((acc, date) => {
        const prev = last(acc) || undefined
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
            qty: Number(entry.item.split('(')[1]?.split(/[),]/)[0]) || 0,
            price: entry.money,
            accountId: entry.r_account_id,
          }))
        const sell = entries
          .filter(e => e.r_account_id === accountId)
          .map(entry => ({
            qty: Number(entry.item.split('(')[1]?.split(/[),]/)[0]) || 0, // 일반 매도 거래의 경우 마이너스 값이 있어야함.
            price: entry.money,
            accountId: entry.l_account_id,
          }))

        const openQtyPerAccount = getOpenQtyPerAccount(prev)
        const closeQtyPerAccount = getCloseQtyPerAccount(openQtyPerAccount, buy, sell)

        return [
          ...acc,
          // 마지막 가계부 기록 금액.
          {
            date,
            openQty,
            openQtyPerAccount,
            closeQtyPerAccount,
            buy,
            sell,
            lastWrittenPrice,
          },
        ]
      }, [])

      return {
        sectionId,
        accountId,
        ticker,
        itemName,
        tradingInfos,
        tickerFromMemos,
      }
    })
  }, [entriesByItemName, tickerNameByItemKey])

  // 추가된 Ticker가 있으면 패치한다.
  // putAndFetchItemHistoricals에 중복 호출 방지 로직이 있으므로 여러번 호출해도 문제 없음.
  useEffect(() => {
    investableItems
      .filter(item => isAutoTicker(item.ticker))
      .forEach(item => putAndFetchItemHistoricals(item.ticker!))  // autoTicker만 남겨서 단언할 수 있음.
  }, [investableItems, putAndFetchItemHistoricals])

  return investableItems
}
