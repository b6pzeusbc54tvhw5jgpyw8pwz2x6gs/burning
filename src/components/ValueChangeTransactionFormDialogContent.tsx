import { useAccounts, usePostEntry } from "@/data/hooks"
import { toast } from "react-toastify"
import { Button } from "./ui/button"
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Item } from "@/types/item.type"
import { today } from "@/util"
import { useAtom, useSetAtom } from "jotai"
import { tickerPricesAtom } from "@/states/ticker-price.state"
import { CommandForSelect } from "./CommandForSelect"
import { useMemo, useState } from "react"
import { useErrorToast } from "@/hooks/use-error-toast"
import { fetchAccountEntriesAtom, removeAccountEntriesAtom } from "@/states/acount-entries.state"
import { Loader2 } from "lucide-react"

export function ValueChangeTransactionFormDialogContent(props: {
  item: Item
}) {
  const { item } = props
  const { sectionId, accountId, name, totalQty, totalPrice } = item

  const { data: accounts } = useAccounts(item.sectionId)
  const incomeSelectItems = useMemo(() => {
    return (accounts?.income || []).map(a => ({
      value: a.account_id,
      label: a.title,
    }))
  }, [accounts])

  const { isPending, mutateAsync: postEntry, error } = usePostEntry()
  const [entryDate, setEntryDate] = useState(() => today())

  const getAccountName = (accountId: string, type: 'assets' | 'income') => {
    return accounts?.[type]?.find(a => a.account_id === accountId)?.title || '-'
  }

  useErrorToast(error)

  const fetchAccountEntries = useSetAtom(fetchAccountEntriesAtom)
  // const removeAccountEntries = useSetAtom(removeAccountEntriesAtom)

  const handlePost = async () => {
    const account = accounts?.assets?.find(a => a.account_id === accountId)
    if (!account) {
      toast.error('자산 정보를 찾을 수 없습니다')
      return
    }

    await postEntry({
      item: name,
      money: profit,
      lAccount: 'assets',
      lAccountId: accountId,
      rAccount: 'income',
      rAccountId: incomeAccountId,
      entryDate,
      memo: '',
      sectionId: sectionId,
    })

    // removeAccountEntries(account)
    await fetchAccountEntries(account)

    toast.success('거래가 성공적으로 입력되었습니다.')
  }

  const [tickerPrices, setTickerPrices] = useAtom(tickerPricesAtom)
  const tickerPrice = tickerPrices.find(t => t.ticker === item.ticker)?.price

  const currentPrice = (tickerPrice || 0) * totalQty
  const profit = currentPrice - totalPrice

  const [openedIncomeSelect, setOpenedIncomeSelect] = useState(false)

  const [incomeAccountId, setIncomeAccountId] = useState('')


  return (
    <DialogContent className="sm:max-w-[920px] gap-0">
      <DialogHeader>
        <DialogTitle>현재 평가 손익을 후잉 가계부 거래로 입력합니다.</DialogTitle>
        <DialogDescription>
          {`오른쪽 항목에 "자산 가치 상승" 같은 수익 항목을 선택해주세요. 손실인 경우에도 동일한 수익 항목의 마이너스 금액으로 입력하세요.`}
        </DialogDescription>
      </DialogHeader>

      {/* 5x3 그리드 */}
      <div className="flex justify-between mt-4 gap-2 text-sm">
        <div className="basis-2/12">날짜</div>
        <div className="basis-6/12">아이템</div>
        <div className="basis-2/12">금액</div>
        <div className="basis-3/12">왼쪽</div>
        <div className="basis-3/12">오른쪽</div>
      </div>

      <div className="flex justify-between gap-2">
        <Input
          className="basis-2/12 px-1 h-8 mt-1"
          value={entryDate}
          onChange={e => setEntryDate(Number(e.target.value))}
        />

        <Input
          className="basis-6/12 px-1 h-8 mt-1"
          type="string"
          disabled
          value={item.name}
        />

        <Input
          className="basis-2/12 px-1 h-8 mt-1 text-right"
          disabled
          value={profit.toLocaleString()}
        />

        <Input
          className="basis-3/12 px-1 h-8 mt-1"
          disabled
          value={getAccountName(item.accountId, 'assets')}
        />

        {openedIncomeSelect ? (
          <div className="basis-3/12 px-1 h-8">
            <div className="absolute w-72">
              <CommandForSelect
                placeHolder="수익 항목을 선택하세요"
                handleClose={() => setOpenedIncomeSelect(false)}
                handleSelect={accountId => setIncomeAccountId(accountId)}
                items={incomeSelectItems}
              />
            </div>
          </div>
        ) : (
          <Input
            className="basis-3/12 px-1 h-8 mt-1"
            value={getAccountName(incomeAccountId, 'income')}
            readOnly
            onFocus={() => setOpenedIncomeSelect(true)}
          />
        )}

      </div>
      <div className="flex justify-between gap-2 mt-2">
        <div className="basis-2/12"></div>
        <div className="basis-6/12">
          <div>메모</div>
          <Textarea
            className="px-1"
          />
        </div>
        <div className="basis-2/12"></div>
        <div className="basis-3/12"></div>
        <div className="basis-3/12"></div>
      </div>

      <DialogFooter className="mt-4">
        <DialogClose asChild>
          <Button type="button" variant={"outline"}>
            취소
          </Button>
        </DialogClose>
        <Button
          type="submit"
          onClick={handlePost}
          disabled={isPending || !incomeAccountId || !entryDate}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {!isPending && '📝 '}
          거래 입력
        </Button>
      </DialogFooter>
    </DialogContent>



  )
}

