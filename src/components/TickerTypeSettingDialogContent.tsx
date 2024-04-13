import { Button } from "./ui/button"
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { TableRowItem } from "@/types/item.type"
import { getManualTicker, today } from "@/util"
import { useAtom, useSetAtom } from "jotai"
import { putTickerPriceAtom, removeTickerPriceAtom, tickerPricesAtom } from "@/states/ticker-price.state"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { putNonTickerEvaluatedPricesAtom } from "@/states/non-ticker-evaluated-price.state"
import { toast } from "react-toastify"



type TickerType = 'auto-ticker' | 'manual-ticker' | 'non-ticker'

export function TickerTypeSettingDialogContent(props: {
  item: TableRowItem
}) {
  const { item } = props
  const { sectionId, accountId, name, totalQty, totalPrice } = item

  const [autoTicker, setAutoTicker] = useState(item.ticker || '')
  const [nonTickerEvaluatedPrice, setNonTickerEvaluatedPrice] = useState(() => totalPrice)
  const [manualTickerPrice, setManualTickerPrice] = useState(() => Math.floor(totalPrice / totalQty))
  const putTickerPrice = useSetAtom(putTickerPriceAtom)
  const removeTickerPrice = useSetAtom(removeTickerPriceAtom)
  const putNonTickerEvaluatedPrice = useSetAtom(putNonTickerEvaluatedPricesAtom)

  const handleAutoTicker = async () => {
    toast.warn('준비 중인 기능입니다.')
  }

  const handleManualTickerPrice = async () => {
    const ticker = getManualTicker(name)
    if (item.ticker) {
      removeTickerPrice(item.ticker)
    }
    putTickerPrice(ticker, manualTickerPrice, 'manual')
  }

  const handleNonTickerEvaluatedPrice = async () => {
    putNonTickerEvaluatedPrice({
      sectionId,
      accountId,
      itemName: item.name,
      source: 'manual',
      evaluatedPrice: nonTickerEvaluatedPrice,
    })
  }

  const [incomeAccountId, setIncomeAccountId] = useState('')
  const [tickerType, setTickerType] = useState<TickerType>('auto-ticker')

  const disabled = tickerType === 'auto-ticker' ? !autoTicker
    : tickerType === 'manual-ticker' ? !manualTickerPrice
      : !nonTickerEvaluatedPrice

  return (
    <DialogContent className="sm:max-w-[800px] sm:min-h-[420px] gap-0 items-start">
      <DialogHeader>
        <DialogTitle>투자 자산 타입 설정</DialogTitle>
        <DialogDescription>
          {`[${item.name}] 자산의 평가액을 구하는 방법을 설정합니다.`}
        </DialogDescription>
      </DialogHeader>

      <RadioGroup
        value={tickerType}
        className="mt-2 text-2xl"
        onSelect={(value) => console.log(value)}
        onValueChange={v => setTickerType(v as TickerType)}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="auto-ticker" id="r1" />
          <Label htmlFor="r1" className="text-lg">
            Ticker를 제공해서 자동으로 현재가를 가져올게요.
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="manual-ticker" id="r2" />
          <Label htmlFor="r2" className="text-lg">
            Ticker를 잘 모르지만 몇주인지 샐 수 있는 증권 타입의 자산이에요. 수동으로 1주 가격을 입력할게요.
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="non-ticker" id="r3" />
          <Label htmlFor="r3" className="text-lg">
            펀드나 예금, 적금처럼 현재 평가 금액만 알 수 있는 자산이에요. 수동으로 현재 평가액을 입력할게요.
          </Label>
        </div>
      </RadioGroup>


      {tickerType === 'auto-ticker' && (
        <div className="mt-4">
          <div>
            {`[${item.name}]의 Ticker 정보를 https://finance.yahoo.com/ 에서 검색 가능한 형식으로 입력해주세요.`}
          </div>
          <div className="text-sm">
            - 예를들어 삼성 전자는 005930.KS, TIGER 나스닥100 ETF는 133690.KS 입니다.
          </div>
          <div className="text-sm">
            - Ticker 정보는 후잉 첫 거래 내역의 메모로 [005930.KS] 같은 문구를 추가합니다.
          </div>

          <div className="flex">
            <Input
              className="basis-1/4 px-1 h-8 mt-1"
              value={autoTicker}
              onChange={e => setAutoTicker(e.target.value)}
              placeholder="ex) 005930.KS"
            />
          </div>
        </div>
      )}

      {tickerType === 'manual-ticker' && (
        <div className="mt-4">
          <div>
            {`현재 [${item.name}] 자산의 1주 가격을 입력해주세요.`}
          </div>
          <div className="flex">
            <Input
              className="px-1 h-8 mt-1 w-1/6 text-right"
              value={manualTickerPrice.toLocaleString()}
              onChange={e => setManualTickerPrice(Number(e.target.value.replace(/,/g, '')))}
            />
            <span className="px-1 py-1 h-8 mt-1 w-1/4">원</span>
          </div>
        </div>
      )}

      {tickerType === 'non-ticker' && (
        <div className="mt-4">
          <div>
            {`현재 [${item.name}] 자산의 평가 금액을 입력해주세요.`}
          </div>
          <div className="flex">
            <Input
              className="px-1 h-8 mt-1 w-1/6 text-right"
              value={nonTickerEvaluatedPrice.toLocaleString()}
              onChange={e => setNonTickerEvaluatedPrice(Number(e.target.value.replace(/,/g, '')))}
            />
            <span className="px-1 py-1 h-8 mt-1 w-1/4">원</span>
          </div>
        </div>
      )}

      <DialogFooter className="mt-4">
        <DialogClose asChild>
          <Button type="button" variant={"outline"}>
            취소
          </Button>
        </DialogClose>
        <Button
          type="submit"
          onClick={
            tickerType === 'auto-ticker' ? handleAutoTicker
              : tickerType === 'manual-ticker' ? handleManualTickerPrice
                : handleNonTickerEvaluatedPrice
          }
          disabled={disabled}
        >
          {'📝 '}
          저장
        </Button>
      </DialogFooter>
    </DialogContent>


  )
}

