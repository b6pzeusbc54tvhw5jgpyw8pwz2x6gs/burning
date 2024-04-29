import { useAtom, useSetAtom } from "jotai"
import { useEffect, useState } from 'react'
import { TableRowItem } from "../types/item.type"
import { TableCell } from "./ui/table"
import { Input } from "./ui/input"
import { putNonTickerEvaluatedPricesAtom } from "@/states/non-ticker-evaluated-price.state"
import { useItemDetail } from "@/hooks/use-item-price"
import { Dialog, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { TickerTypeSettingDialogContent } from "./TickerTypeSettingDialogContent"
import { itemHistoricalsByTickerAtom, itemHistoricalsByTickerLoadingAtom } from "@/states/ticker-historical.state"
import { currentDateAtom } from "@/states/date.state"
import dayjs from "dayjs"
import { getTickerPrice } from "@/utils/ticker-price.util"
import { isManualTicker, isNonTickerTypeTicker } from "@/utils/ticker-name.util"

export const ItemsTableCellEvaluatedTotalPrice = (props: {
  item: TableRowItem
}) => {
  const { item } = props
  const { name, sectionId, accountId, ticker, totalQty } = item
  const [editing, setEditing] = useState(false)

  const [currentDate] = useAtom(currentDateAtom)
  const currentDateStr = dayjs(currentDate).format('YYYYMMDD')

  const putNonTickerEvaluatedPrice = useSetAtom(putNonTickerEvaluatedPricesAtom)
  const { evaluatedPrice } = useItemDetail(item, currentDate)

  const [itemHistoricalsByTicker] = useAtom(itemHistoricalsByTickerAtom)
  const [itemHistoricalsByTickerLoading] = useAtom(itemHistoricalsByTickerLoadingAtom)

  const tickerPrice = getTickerPrice(currentDateStr, itemHistoricalsByTicker[ticker || ''])

  if (itemHistoricalsByTickerLoading[ticker || '']) {
    return (
      <TableCell className="text-right animate-pulse">Loading...</TableCell>
    )
  }

  return (
    <TableCell className="text-right">

      {(tickerPrice ? (
        <><b>{(Math.floor(evaluatedPrice)).toLocaleString()}</b>원</>
      ) : isNonTickerTypeTicker(ticker) ? (
        <div className="flex text-right justify-end">
          <Input
            className="h-5 text-right px-1 w-full"
            type="text"
            value={evaluatedPrice ? Math.floor(evaluatedPrice).toLocaleString() : ''}
            onFocus={e => setEditing(true)}
            onChange={e => putNonTickerEvaluatedPrice({
              sectionId,
              accountId,
              itemName: name,
              evaluatedPrice: Number(e.target.value?.replace(/,/g,'')),
              source: "manual"
            })}
            onBlur={e => setEditing(false)}
          />
          <span>원</span>
        </div>
      ) : (
        <div>
          {isManualTicker(ticker) ? '1주 당 가격 입력 필요' : 'Ticker 정보 로드 실패'}
        </div>
      ))}
    </TableCell>
  )
}
