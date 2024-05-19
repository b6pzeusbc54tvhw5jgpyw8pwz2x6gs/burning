import { useAtom, useSetAtom } from "jotai"
import dayjs from "dayjs"
import { TableRowItem } from "../types/item.type"
import { TableCell } from "./ui/table"
import { Input } from "./ui/input"
import { Dialog, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { TickerTypeSettingDialogContent } from "./TickerTypeSettingDialogContent"
import { deleteManualTickerItemHistoricalAtom, autoTickerItemHistoricalsByTickerAtom, autoTickerItemHistoricalsByTickerLoadingAtom, manualTickerItemHistoricalsByTickerAtom } from "@/states/ticker-historical.state"
import { isManualTicker, isNonTickerTypeTicker, isUndefinedTicker } from "@/utils/ticker-name.util"
import { currentDateAtom } from "@/states/date.state"
import { AddTickerPriceDialogContent } from "./ManualTickerPriceDialogContent"
import { EmojiButton } from "./EmojiButton"

export const ItemsTableCellTickerPrice = (props: {
  item: TableRowItem
}) => {
  const { item } = props
  const { ticker, tickerPrice } = item
  const [itemHistoricalsByTicker] = useAtom(autoTickerItemHistoricalsByTickerAtom)
  const [itemHistoricalsByTickerLoading] = useAtom(autoTickerItemHistoricalsByTickerLoadingAtom)
  const [currentDate] = useAtom(currentDateAtom)

  const [manualTickerItemHistoricalsByTicker]= useAtom(manualTickerItemHistoricalsByTickerAtom)
  const deleteManualTickerItemHistorical = useSetAtom(deleteManualTickerItemHistoricalAtom)
  const hasDatePrice = !!manualTickerItemHistoricalsByTicker[ticker || '']?.[dayjs(currentDate).format('YYYYMMDD')]

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

  if (itemHistoricalsByTickerLoading[ticker]) {
    return (
      <TableCell className="text-right animate-pulse">Loading...</TableCell>
    )
  }

  if (isNonTickerTypeTicker(ticker)) {
    return <TableCell className="text-right"></TableCell>
  }

  // auto 또는 manual ticker
  return (
    <TableCell className="text-right">

      <div className="flex text-right justify-end">
        {tickerPrice !== null ? (
          <>
            <Input
              className="h-5 text-right px-1 w-full"
              type="text"
              value={Math.floor(tickerPrice).toLocaleString()}
              disabled
            />
            <span>원</span>
          </>
        ) : (
          <div className="flex justify-end gap-1 mt-1">
            <Dialog>
              <DialogTrigger asChild>
                <Button>가격 입력 필요</Button>
              </DialogTrigger>
              <AddTickerPriceDialogContent item={item} />
            </Dialog>
          </div>
        )}
      </div>

      {isManualTicker(ticker) && (
        <div className="flex justify-end gap-1 mt-1">
          <Dialog>
            <DialogTrigger asChild>
              <div className="cursor-pointer">📝</div>
            </DialogTrigger>
            <AddTickerPriceDialogContent item={item} />
          </Dialog>

          <EmojiButton
            onClick={() => deleteManualTickerItemHistorical(ticker, currentDate)}
            disabled={!hasDatePrice}
            emoji="❌"
          />
        </div>
      )}
    </TableCell>
  )
}
