import { Button } from "./ui/button"
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { TableRowItem } from "@/types/item.type"
import { useAtom, useSetAtom } from "jotai"
import { removeTickerPriceAtom } from "@/states/ticker-price.state"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { putNonTickerEvaluatedPricesAtom } from "@/states/non-ticker-evaluated-price.state"
import { toast } from "react-toastify"
import { currentDateAtom } from "@/states/date.state"
import { manualTickerItemHistoricalsByTickerAtom, putManualTickerItemHistoricalAtom } from "@/states/ticker-historical.state"
import dayjs from "dayjs"
import { getTickerPrice } from "@/utils/ticker-price.util"



type TickerType = 'auto-ticker' | 'manual-ticker' | 'non-ticker'

export function ManualTickerPriceDialogContent(props: {
  item: TableRowItem
}) {
  const { item } = props
  const { ticker, name } = item
  const [currentDate] = useAtom(currentDateAtom)
  const dateStr = dayjs(currentDate).format('YYYY-MM-DD')

  const [manualTickerItemHistoricalsByTicker] = useAtom(manualTickerItemHistoricalsByTickerAtom)
  const historicals = manualTickerItemHistoricalsByTicker[ticker]
  const tickerPrice = getTickerPrice(currentDate, historicals)
  const [manualTickerPrice, setManualTickerPrice] = useState(() => tickerPrice)

  const handleSubmit = async () => {
  }

  return (
    <DialogContent className="sm:max-w-[800px] sm:min-h-[420px] gap-0 items-start">
      <DialogHeader>
        <DialogTitle>투자 자산 타입 설정</DialogTitle>
        <DialogDescription>
          {`[${item.name}] 자산의 평가액을 구하는 방법을 설정합니다.`}
        </DialogDescription>
      </DialogHeader>

      <div>
        <Label>투자 자산 타입</Label>
        <div>{dateStr} 날짜의 {name} 자산 1주의 가격을 입력해주세요.</div>
        <Input
          type="number"
          placeholder="가격을 입력해주세요."
          value={manualTickerPrice.toLocaleString()}
          onChange={e => setManualTickerPrice(Number(e.target.value))}
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
        >
          {'📝 '}
          저장
        </Button>
      </DialogFooter>
    </DialogContent>


  )
}

