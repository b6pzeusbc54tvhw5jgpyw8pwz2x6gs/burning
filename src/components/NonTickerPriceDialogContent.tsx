import { Button } from "./ui/button"
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { TableRowItem } from "@/types/item.type"
import { useAtom, useSetAtom } from "jotai"
import { useState } from "react"
import { currentDateAtom } from "@/states/date.state"
import { manualTickerItemHistoricalsByTickerAtom, nonTickerItemHistoricalsByTickerAtom, putManualTickerItemHistoricalAtom, putNonTickerItemHistoricalAtom } from "@/states/ticker-historical.state"
import dayjs from "dayjs"
import { getTickerPriceInHistoricals } from "@/utils/ticker-price.util"


export function NonTickerPriceDialogContent(props: {
  item: TableRowItem
}) {
  const { item } = props
  const { ticker, name } = item
  const [currentDate] = useAtom(currentDateAtom)
  const dateStr = dayjs(currentDate).format('YYYY-MM-DD')

  const [nonTickerItemHistoricalsByTicker] = useAtom(nonTickerItemHistoricalsByTickerAtom)
  const putNonTickerItemHistorical = useSetAtom(putNonTickerItemHistoricalAtom)
  const historicals = nonTickerItemHistoricalsByTicker[ticker || '']

  const tickerPrice = getTickerPriceInHistoricals(currentDate, historicals)

  const [manualTickerPrice, setManualTickerPrice] = useState(() => tickerPrice !== null ? tickerPrice.toLocaleString() : '')

  const handleSubmit = async () => {
    if (!ticker) return

    const price = Number(manualTickerPrice.replace(/,/g, ''))
    if (isNaN(price)) return

    putNonTickerItemHistorical(ticker, currentDate, price)
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
          value={manualTickerPrice ? manualTickerPrice.toLocaleString() : ''}
          onChange={e => {
            const price = Number(e.target.value.replace(/,/g, ''))
            setManualTickerPrice(price.toLocaleString())
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
          disabled={!manualTickerPrice}
        >
          {'📝 '}
          저장
        </Button>
      </DialogFooter>
    </DialogContent>


  )
}

