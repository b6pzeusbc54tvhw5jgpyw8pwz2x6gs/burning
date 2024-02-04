import { useSetAtom } from "jotai"
import { useEffect, useState } from 'react'
import { putTickerPriceAtom, removeTickerPriceAtom, } from "../states/ticker-price.state"
import { Item } from "../types/item.type"
import { useTickerPrice } from "../data/hooks"
import { TableCell } from "./ui/table"
import { Button } from "./ui/button"
import { Eraser, RefreshCw } from "lucide-react"
import { Dialog, DialogTrigger } from "./ui/dialog"
import { ValueChangeTransactionFormDialogContent } from "./ValueChangeTransactionFormDialogContent"
import { removeNonTickerEvaluatedPriceAtom } from "@/states/non-ticker-evaluated-price.state"

export const ItemsTableCellActions = (props: {
  item: Item
}) => {
  const { item } = props
  const { ticker } = item
  const putTickerPrice = useSetAtom(putTickerPriceAtom)
  const { data, refetch } = useTickerPrice(ticker)

  const removeTickerPrice = useSetAtom(removeTickerPriceAtom)
  const removeNonTickerEvaluatedPrice = useSetAtom(removeNonTickerEvaluatedPriceAtom)

  const handleReset = () => {
    if (ticker) {
      removeTickerPrice(ticker)
    }

    removeNonTickerEvaluatedPrice(item)
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
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={!ticker || ticker.startsWith('manual-ticker-')}
            >
              📝
            </Button>
          </DialogTrigger>
          <ValueChangeTransactionFormDialogContent item={item} />
        </Dialog>
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
