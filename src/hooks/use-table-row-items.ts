import dayjs from "dayjs"
import { useAtom } from "jotai"
import { currentDateAtom, endDateAtom, startDateAtom } from "@/states/date.state"
import { InvestableItem, TableRowItem } from "@/types/item.type"
import { isAutoTicker, isManualTicker, isNonTickerTypeTicker, isUndefinedTicker } from "@/utils/ticker-name.util"
import { autoTickerItemHistoricalsByTickerAtom, manualTickerItemHistoricalsByTickerAtom, nonTickerItemHistoricalsByTickerAtom } from "@/states/ticker-historical.state"
import { getTickerPriceInHistoricals } from "@/utils/ticker-price.util"
import { Account } from "@/types/account.type"
import { useMemo } from "react"

export const useTableRowItems = (
  items: InvestableItem[],
  accounts: Record<string, Account[]>
): TableRowItem[] => {
  const [startDate] = useAtom(startDateAtom)
  const [endDate] = useAtom(endDateAtom)
  const [date] = useAtom(currentDateAtom)

  const [itemHistoricalsByTicker] = useAtom(autoTickerItemHistoricalsByTickerAtom)
  const [manualTickerItemHistoricalsByTicker] = useAtom(manualTickerItemHistoricalsByTickerAtom)
  const [nonTickerItemHistoricalsByTicker] = useAtom(nonTickerItemHistoricalsByTickerAtom)

  const from = dayjs(startDate).format('YYYYMMDD')
  const to = dayjs(endDate).format('YYYYMMDD')
  const dateStr = dayjs(date).format('YYYYMMDD')

  // 가장 가까운 날짜의 거래 정보를 가져옴.
  const tableRows: TableRowItem[] = useMemo(() => {
    return items
      // from ~ to 사이 데이터 있는 것만 필터.
      .filter(item=> item.tradingInfos.some(t => t.date >= from))
      .filter(item=> item.tradingInfos.some(t => t.date <= to))
      .filter(item=> {
        const idx = item.tradingInfos.findIndex(t => t.date > dateStr)
        const latestIdx = idx === -1 ? item.tradingInfos.length - 1 : idx - 1
        return latestIdx >= 0
      })
      .map(item => {
        const { ticker, tradingInfos, sectionId, accountId, itemName } = item
        const { tickerFromMemos, assetType, assetCategory } = item
        const idx = tradingInfos.findIndex(t => t.date > dateStr)
        const latestIdx = idx === -1 ? tradingInfos.length - 1 : idx - 1
        const tradingInfo = tradingInfos[latestIdx]

        const totalQty = tradingInfo.openQty
          + tradingInfo.buy.reduce((acc, cur) => acc + cur.qty, 0)
          + tradingInfo.sell.reduce((acc, cur) => acc + cur.qty, 0)

        const itemHistoricals =
          isManualTicker(ticker) ? manualTickerItemHistoricalsByTicker[ticker]
            : isNonTickerTypeTicker(ticker) ? nonTickerItemHistoricalsByTicker[ticker]
              : isAutoTicker(ticker) ? itemHistoricalsByTicker[ticker]
                : null

        const tickerPrice = itemHistoricals
          ? getTickerPriceInHistoricals(date, itemHistoricals)
          : null

        const isTickerType = isAutoTicker(ticker) || isManualTicker(ticker)
        const evaluatedPrice = tickerPrice !== null
          ? isTickerType
            ? tickerPrice * totalQty
            : tickerPrice
          : null

        const evaluatedProfit = evaluatedPrice !== null
          ? evaluatedPrice - tradingInfo.lastWrittenPrice
          : null

        const getAssetName = (accountId: string) => {
          const found = accounts.assets.find(a => a.account_id === accountId)
          return found ? found.title : 'Unknown'
        }

        return {
          assetType: assetType,
          assetCategory: assetCategory,
          sectionId: sectionId,
          accountId: accountId,

          assetGroup: assetType === 'money' ? '현금성 자산' : getAssetName(accountId),
          name: assetType === 'money' ? getAssetName(accountId) : itemName,

          perAccount: tradingInfo.closeQtyPerAccount,
          totalQty,
          totalPrice: tradingInfo.lastWrittenPrice,
          ticker: ticker,
          tickerFromMemos: tickerFromMemos,

          tickerPrice,
          evaluatedPrice,
          evaluatedProfit,
          // ticker는 언제 날짜 가격인지 추가 필요.
          // tickerPriceDate:

          // 마지막 가계부 업데이트 날짜여예함.
          // lastItemDate: lastItemDate || '20230101',
          lastItemDate: tradingInfo.date,
        }
      })
  }, [items, accounts, date, from, to, dateStr, itemHistoricalsByTicker, manualTickerItemHistoricalsByTicker, nonTickerItemHistoricalsByTicker])

  return tableRows
}
//   return entriesByAccount
//     .filter(ae => ae.entries)
//     .filter(isSelected)
//     .map(ae => (ae.entries || []).map(e => ({
//       ...e,
//       sectionId: ae.sectionId,
//       accountId: ae.accountId,
//     })))
//     .flat()
//     .map(o => {
//       // console.log("🚀 ~ tableData ~ o:", o)
//       return o
//     })
//     .reduce((acc, cur) => {
//       const account = allAccounts.assets?.find(a => a.account_id === cur.accountId)
//       if (!account) return acc

//       const name = cur.item.split('(')[0]
//       const idx = acc.findIndex(a => {
//         if (account.category === 'normal') {
//           return a.sectionId === cur.sectionId && a.accountId === cur.accountId
//         }

//         return a.sectionId === cur.sectionId
//           && a.accountId === cur.accountId
//           && a.name === name
//       })

//       // 토스증권 같은 일반 항목
//       if (account.category === 'normal') {
//         const updatedItem: TableRowItem = {
//           ...acc[idx],
//           accountId: cur.accountId,
//           sectionId: cur.sectionId,
//           name: account.title,
//           totalPrice: cur.total,
//           perAccount: {},
//           lastItemDate: cur.entry_date,
//           totalQty: -1,
//         }

//         return updateItem(acc, updatedItem, idx)
//       }

//       const isManualTicker = tickerPrices.some(t => t.ticker === getManualTicker(name))
//       const isTickerType = !nonTickerEvaluatedPrices.some(p => (
//         p.sectionId === cur.sectionId
//           && p.accountId === cur.accountId
//           && p.itemName === name
//       ))

//       if (
//         cur.l_account_id === cur.accountId
//           && (cur.r_account === 'income' || cur.r_account === 'capital')
//       ) {
//         // 자산 가치 변동 또는 기초 잔액
//         const updatedItem: TableRowItem = {
//           ...acc[idx],
//           sectionId: cur.sectionId,
//           accountId: cur.accountId,
//           name,
//           totalPrice: (acc[idx]?.totalPrice || 0) + cur.money,
//           perAccount: acc[idx]?.perAccount || {},
//           totalQty: acc[idx]?.totalQty || 0,
//           ticker: isManualTicker
//             ? getManualTicker(cur.item)
//             : getTicket(cur.memo) || acc[idx]?.ticker,
//           lastItemDate: cur.entry_date,
//         }

//         return updateItem(acc, updatedItem, idx)
//       }

//       // 매수 또는 매도
//       const type = cur.l_account_id === cur.accountId ? 'buy' : 'sell'
//       const from = type === 'buy' ? cur.r_account_id : cur.l_account_id
//       const qty = isTickerType
//         ? Number(cur.item?.split('(')[1]?.split(/[),]/)[0] || 0)
//         : type === 'buy' ? cur.money : -cur.money
//       const totalQty = sum(Object.values(acc[idx]?.perAccount || [])) + qty
//       const updatedItem: TableRowItem = {
//         ...acc[idx],
//         sectionId: cur.sectionId,
//         accountId: cur.accountId,
//         name,
//         perAccount: {
//           ...acc[idx]?.perAccount,
//           [from]: ((acc[idx] || {}).perAccount?.[from] || 0) + qty
//         },
//         totalQty,
//         totalPrice: type === 'buy'
//           ? (acc[idx]?.totalPrice || 0) + cur.money
//           : (acc[idx]?.totalPrice || 0) - cur.money,
//         ticker: isManualTicker
//           ? getManualTicker(cur.item)
//           : getTicket(cur.memo) || acc[idx]?.ticker,
//         lastItemDate: cur.entry_date,
//       }

//       if (updatedItem.perAccount[from] === 0) {
//         delete updatedItem.perAccount[from]
//       }

//       return updateItem(acc, updatedItem, idx)
//     }, [] as TableRowItem[])
//     .filter(i => i.totalPrice > 0)

// }, [entriesByAccount, stockAssets, nonTickerEvaluatedPrices, tickerPrices, allAccounts])
