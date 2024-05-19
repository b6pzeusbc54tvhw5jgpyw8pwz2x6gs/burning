import { Button } from "./ui/button"
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { TableRowItem } from "@/types/item.type"
import { useAtom, useSetAtom } from "jotai"
import { useState } from "react"
import { currentDateAtom } from "@/states/date.state"
import { autoTickerItemHistoricalsByTickerAtom, manualTickerItemHistoricalsByTickerAtom, putAutoTickerItemHistoricalAtom, putManualTickerItemHistoricalAtom } from "@/states/ticker-historical.state"
import dayjs from "dayjs"
import { getTickerPriceInHistoricals } from "@/utils/ticker-price.util"
import { isAutoTicker } from "@/utils/ticker-name.util"


/**
 * manual ticker 또는 auto ticker 중에서도 API 문제로 가격을 못 받아 오는 경우,
 * 수동으로 가격을 입력할 수 있는 다이얼로그.
 */
export function AddTickerPriceDialogContent(props: {
  item: TableRowItem
}) {
  const { item } = props
  const { ticker, name } = item
  const [currentDate] = useAtom(currentDateAtom)
  const dateStr = dayjs(currentDate).format('YYYY-MM-DD')

  const [manualTickerItemHistoricalsByTicker] = useAtom(manualTickerItemHistoricalsByTickerAtom)
  const [autoTickerItemHistoricalsByTicker] = useAtom(autoTickerItemHistoricalsByTickerAtom)

  const putManualTickerItemHistorical = useSetAtom(putManualTickerItemHistoricalAtom)
  const putAutoTickerItemHistorical = useSetAtom(putAutoTickerItemHistoricalAtom)

  const [tickerPrice, setTickerPrice] = useState(() => {
    if (ticker === undefined) return ''

    const historicals = isAutoTicker(ticker)
      ? autoTickerItemHistoricalsByTicker[ticker]
      : manualTickerItemHistoricalsByTicker[ticker]
    const initialValue = getTickerPriceInHistoricals(currentDate, historicals)
    return initialValue !== null ? initialValue.toLocaleString() : ''
  })

  const handleSubmit = async () => {
    if (!ticker) return

    const price = Number(tickerPrice.replace(/,/g, ''))
    if (isNaN(price)) return

    isAutoTicker(ticker)
      ? putAutoTickerItemHistorical(ticker, currentDate, price)
      : putManualTickerItemHistorical(ticker, currentDate, price)
  }

  return (
    <DialogContent className="sm:max-w-[800px] sm:min-h-[420px] gap-0 items-start">
      <DialogHeader>
        <DialogTitle>
          {`[${item.name}]의 1주 가격 입력`}
        </DialogTitle>
        <DialogDescription>
          {`${dateStr} 날짜의 [${item.name}] 자산의 1주 가격을 입력하세요.`}
        </DialogDescription>
      </DialogHeader>

      <div>
        <Input
          placeholder="가격을 입력해주세요."
          value={tickerPrice ? tickerPrice.toLocaleString() : ''}
          onChange={e => {
            const price = Number(e.target.value.replace(/,/g, ''))
            setTickerPrice(price.toLocaleString())
          }}
        />
      </div>

      <DialogFooter className="mt-4">
        <DialogClose asChild>
          <Button type="button" variant={"outline"}>
            취소
          </Button>
        </DialogClose>
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={!tickerPrice}
        >
          {'📝 '}
          저장
        </Button>
      </DialogFooter>
    </DialogContent>


  )
}

