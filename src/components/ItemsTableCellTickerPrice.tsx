import { useAtom, useSetAtom } from "jotai"
import { useEffect, useState } from 'react'
// import { putTickerPriceAtom } from "../states/ticker-price.state"
import { TableRowItem } from "../types/item.type"
import { TableCell } from "./ui/table"
import { Input } from "./ui/input"
import { Dialog, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { TickerTypeSettingDialogContent } from "./TickerTypeSettingDialogContent"
import { useItemDetail } from "@/hooks/use-item-price"
import { itemHistoricalsByTickerAtom, itemHistoricalsByTickerLoadingAtom } from "@/states/ticker-historical.state"
import { isAutoTicker, isManualTicker, isNonTickerTypeTicker, isUndefinedTicker } from "@/utils/ticker-name.util"
import { currentDateAtom } from "@/states/date.state"
import { ManualTickerPriceDialogContent } from "./ManualTickerPriceDialogContent"

export const ItemsTableCellTickerPrice = (props: {
  item: TableRowItem
}) => {
  const { item } = props
  const { ticker } = item
  // const putTickerPrice = useSetAtom(putTickerPriceAtom)
  const [editing, setEditing] = useState(false)
  const [itemHistoricalsByTicker] = useAtom(itemHistoricalsByTickerAtom)
  const [itemHistoricalsByTickerLoading] = useAtom(itemHistoricalsByTickerLoadingAtom)
  const [currentDate] = useAtom(currentDateAtom)
  const { tickerPrice } = useItemDetail(item, currentDate)

  if (itemHistoricalsByTickerLoading[ticker || '']) {
    return (
      <TableCell className="text-right animate-pulse">Loading...</TableCell>
    )
  }

  if (isUndefinedTicker(ticker)) {
    return (
      <TableCell className="text-right">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
            >
              Ticker 정보 필요
            </Button>
          </DialogTrigger>
          <TickerTypeSettingDialogContent item={item} />
        </Dialog>
      </TableCell>
    )
  }

  if (isNonTickerTypeTicker(ticker)) {
    return <TableCell className="text-right"></TableCell>
  }

  // if (isManualTicker(ticker)) {
  //   return (
  //     <TableCell className="text-right">
  //     </TableCell>
  //   )
  // }

  return (
    <TableCell className="text-right">

      <div className="flex text-right justify-end">
        <Input
          className="h-5 text-right px-1 w-full"
          type="text"
          value={Math.floor(tickerPrice).toLocaleString()}
          onFocus={e => setEditing(true)}
          // onChange={e => putTickerPrice(ticker, Number(e.target.value?.replace(/,/g,'')), 'manual')}
          onBlur={e => setEditing(false)}
          disabled={isAutoTicker(ticker)}
        />
        <span>원</span>
      </div>
      {isManualTicker(ticker) && (
        <Dialog>
          <DialogTrigger asChild>
            <div>update</div>
          </DialogTrigger>
          <ManualTickerPriceDialogContent item={item} />
        </Dialog>
      )}
    </TableCell>
  )
}
