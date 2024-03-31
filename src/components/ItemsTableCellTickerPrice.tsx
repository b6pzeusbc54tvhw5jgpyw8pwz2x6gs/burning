import { useSetAtom } from "jotai"
import { useEffect, useState } from 'react'
import { putTickerPriceAtom } from "../states/ticker-price.state"
import { Item } from "../types/item.type"
import { useTickerPrice } from "../data/hooks"
import { TableCell } from "./ui/table"
import { Input } from "./ui/input"
import { Dialog, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { TickerTypeSettingDialogContent } from "./TickerTypeSettingDialogContent"
import { useItemDetail } from "@/hooks/use-item-price"

export const ItemsTableCellTickerPrice = (props: {
  item: Item
}) => {
  const { item } = props
  const { ticker } = item
  const putTickerPrice = useSetAtom(putTickerPriceAtom)
  const [editing, setEditing] = useState(false)
  const { data, dataUpdatedAt, isFetching, error, refetch } = useTickerPrice(ticker)

  useEffect(() => {
    if (!ticker || !data) return

    putTickerPrice(ticker, data, 'yahoo')
  }, [putTickerPrice, ticker, data])

  const { nonTickerType, tickerPrice } = useItemDetail(item)

  if (nonTickerType) {
    return <TableCell className="text-right"></TableCell>
  }

  // manual-ticker- 이면서 tickerPrice가 없는 경우는 처음 자산 추가했을 때
  // 처음에는 memo에 ticker정보를 안써놨다면 기본적으로 manual-ticker로 설정.
  if (!tickerPrice && !ticker?.startsWith('manual-ticker-')) {
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

  if (isFetching) {
    return (
      <TableCell className="text-right animate-pulse">Loading...</TableCell>
    )
  }

  if (!ticker) {
    return (
      <TableCell className="text-right">No ticker error!</TableCell>
    )
  }

  return (
    <TableCell className="text-right">

      <div className="flex text-right justify-end">
        <Input
          className="h-5 text-right px-1 w-full"
          type="text"
          value={tickerPrice ? Math.floor(tickerPrice).toLocaleString() : ''}
          onFocus={e => setEditing(true)}
          onChange={e => putTickerPrice(ticker, Number(e.target.value?.replace(/,/g,'')), 'manual')}
          onBlur={e => setEditing(false)}
          disabled={!item.ticker?.startsWith('manual-ticker-')}
        />
        <span>원</span>
      </div>
    </TableCell>
  )
}
