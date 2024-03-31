import { useSetAtom } from "jotai"
import { useEffect, useState } from 'react'
import { putTickerPriceAtom, removeTickerPriceAtom, } from "../states/ticker-price.state"
import { Item } from "../types/item.type"
import { useTickerPrice } from "../data/hooks"
import { TableCell } from "./ui/table"
import { Button } from "./ui/button"
import { Eraser, RefreshCw } from "lucide-react"
import { Dialog, DialogTrigger } from "./ui/dialog"
import { ValueChangeTransactionDialog } from "./ValueChangeTransactionDialog"
import { removeNonTickerEvaluatedPriceAtom } from "@/states/non-ticker-evaluated-price.state"
import { useItemDetail } from "@/hooks/use-item-price"
import { toast } from "react-toastify"

export const ItemsTableCellActions = (props: {
  item: Item
}) => {
  const { item } = props
  const { ticker } = item
  const putTickerPrice = useSetAtom(putTickerPriceAtom)
  const [openedVCTDialog, setOpenedVCTDialog] = useState(false)
  const { data, refetch } = useTickerPrice(ticker)

  const removeTickerPrice = useSetAtom(removeTickerPriceAtom)
  const removeNonTickerEvaluatedPrice = useSetAtom(removeNonTickerEvaluatedPriceAtom)

  const handleReset = () => {
    if (ticker) {
      removeTickerPrice(ticker)
    }

    removeNonTickerEvaluatedPrice(item)
  }

  const { evaluatedProfit } = useItemDetail(item)
  const handleOpenVCTDialog = () => {
    if (evaluatedProfit < 1 && evaluatedProfit > -1) {
      toast.warn('손익이 1원 미만입니다')
      return
    }

    setOpenedVCTDialog(true)
  }

  useEffect(() => {
    if (!ticker || !data) return

    putTickerPrice(ticker, data, 'yahoo')
  }, [putTickerPrice, ticker, data])

  return (
    <TableCell className="text-right">
      <div className="flex gap-1 justify-end">
        <Button
          variant="outline"
          size="sm"
          disabled={!ticker || ticker.startsWith('manual-ticker-')}
        >
          <RefreshCw
            className="h-4 w-4"
            onClick={() => refetch()}
          />
        </Button>
        <Button
          variant="outline"
          size="sm"
          // disabled={!ticker || ticker.startsWith('manual-ticker-')}
          onClick={handleOpenVCTDialog}
        >
          📝
        </Button>
        <ValueChangeTransactionDialog
          item={item}
          opened={openedVCTDialog}
          setOpened={setOpenedVCTDialog}
        />
        <Button
          variant="outline"
          size="sm"
        >
          <Eraser
            className="h-4 w-4"
            onClick={() => handleReset()}
          />
        </Button>
      </div>
    </TableCell>
  )
}
