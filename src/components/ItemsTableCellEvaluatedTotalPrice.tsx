import { useAtom, useSetAtom } from "jotai"
import { TableRowItem } from "../types/item.type"
import { TableCell } from "./ui/table"
import { Input } from "./ui/input"
import { Dialog, DialogTrigger } from "./ui/dialog"
import { deleteNonTickerItemHistoricalAtom, autoTickerItemHistoricalsByTickerAtom, autoTickerItemHistoricalsByTickerLoadingAtom, manualTickerItemHistoricalsByTickerAtom, nonTickerItemHistoricalsByTickerAtom, putNonTickerItemHistoricalAtom } from "@/states/ticker-historical.state"
import { currentDateAtom } from "@/states/date.state"
import dayjs from "dayjs"
import { getTickerPriceInHistoricals } from "@/utils/ticker-price.util"
import { isAutoTicker, isManualTicker, isNonTickerTypeTicker } from "@/utils/ticker-name.util"
import { NonTickerPriceDialogContent } from "./NonTickerPriceDialogContent"
import { EmojiButton } from "./EmojiButton"

export const ItemsTableCellEvaluatedTotalPrice = (props: {
  item: TableRowItem
}) => {
  const { item } = props
  const { ticker, evaluatedPrice } = item

  const [currentDate] = useAtom(currentDateAtom)

  const [itemHistoricalsByTicker] = useAtom(autoTickerItemHistoricalsByTickerAtom)
  const [manualTickerItemHistoricalsByTicker] = useAtom(manualTickerItemHistoricalsByTickerAtom)
  const [nonTickerItemHistoricalsByTicker] = useAtom(nonTickerItemHistoricalsByTickerAtom)

  const [itemHistoricalsByTickerLoading] = useAtom(autoTickerItemHistoricalsByTickerLoadingAtom)
  const deleteNonTickerItemHistorical = useSetAtom(deleteNonTickerItemHistoricalAtom)
  const putNonTickerItemHistorical = useSetAtom(putNonTickerItemHistoricalAtom)

  if (!ticker) {
    return <TableCell className="text-right animate-pulse">Ticker 타입 결정 필요</TableCell>
  }

  const historicalsByTicker = isAutoTicker(ticker) ? itemHistoricalsByTicker[ticker]
    : isManualTicker(ticker) ? manualTickerItemHistoricalsByTicker[ticker]
      : nonTickerItemHistoricalsByTicker[ticker]

  const isTickerType = isAutoTicker(ticker) || isManualTicker(ticker)
  const dateInYYYYMMDD = dayjs(currentDate).format('YYYYMMDD')
  const hasDatePrice = isAutoTicker(ticker) ? !!itemHistoricalsByTicker[ticker]?.[dateInYYYYMMDD]
    : isManualTicker(ticker) ? !!manualTickerItemHistoricalsByTicker[ticker]?.[dateInYYYYMMDD]
      : !!nonTickerItemHistoricalsByTicker[ticker]?.[dateInYYYYMMDD]

  const tickerPrice = getTickerPriceInHistoricals(currentDate, historicalsByTicker)

  const itemHistoricals = isAutoTicker(ticker) ? itemHistoricalsByTicker[ticker]
    : isManualTicker(ticker) ? manualTickerItemHistoricalsByTicker[ticker]
      : isNonTickerTypeTicker(ticker) ? nonTickerItemHistoricalsByTicker[ticker]
        : null

  // if (!itemHistoricals) {
  //   return (
  //     <TableCell className="text-right animate-pulse">가격 정보 필요</TableCell>
  //   )
  // }

  if (!isTickerType) {
    return (
      <TableCell className="text-right">

        <div className="flex text-right justify-end">
          {tickerPrice !== null ? (
            <>
              <Input
                className="h-5 text-right px-1 w-full"
                type="text"
                value={Math.floor(tickerPrice).toLocaleString()}
                // onFocus={e => setEditing(true)}
                // onChange={e => putTickerPrice(ticker, Number(e.target.value?.replace(/,/g,'')), 'manual')}
                // onBlur={e => setEditing(false)}
                disabled
              />
              <span>원</span>
            </>
          ) : (
            <span>가격 입력 필요</span>
          )}
        </div>

        {isNonTickerTypeTicker(ticker) && (
          <div className="flex justify-end gap-1 mt-1">
            <Dialog>
              <DialogTrigger asChild>
                <div className="cursor-pointer">📝</div>
              </DialogTrigger>
              <NonTickerPriceDialogContent item={item} />
            </Dialog>

            <EmojiButton
              onClick={() => deleteNonTickerItemHistorical(ticker, currentDate)}
              disabled={!hasDatePrice}
              emoji="❌"
            />
          </div>
        )}
      </TableCell>
    )
  }

  // isTickerType
  return (
    <TableCell className="text-right">
      {tickerPrice !== null ? (
        <><b>{evaluatedPrice ? (Math.floor(evaluatedPrice)).toLocaleString() : '-'}</b>원</>
      ) : (
        <div>
          {isManualTicker(ticker) ? '1주 당 가격 입력 필요' : 'Ticker 정보 로드 실패'}
        </div>
      )}
    </TableCell>
  )
}
