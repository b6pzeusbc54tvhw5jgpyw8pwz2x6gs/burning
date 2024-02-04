import { useAtom, useSetAtom } from "jotai"
import { startTransition, useEffect, useRef, useState, useTransition } from 'react'
import { putTickerPriceAtom, tickerPricesAtom } from "../states/ticker-price"
import { Item } from "../types/item.type"
import Link from "next/link"
import { getTickerPrice } from "../server/actions/yahoo-finance"
import { useTickerPrice } from "../data/hooks"
import { Box, TextField } from '@radix-ui/themes'
import { TableCell } from "./ui/table"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { ChevronRight, RefreshCw } from "lucide-react"
import { Dialog, DialogTrigger } from "./ui/dialog"
import { AllAssetsDialogContent } from "./AllAssetsDialogContent"
import { ValueChangeTransactionFormDialogContent } from "./ValueChangeTransactionFormDialogContent"

const isAvailableAutoUpdate = (ticker: string) => {
  return !ticker.startsWith('비상장-')
}

export const ItemsTableCellActions = (props: {
  item: Item
}) => {
  const { item } = props
  const { ticker, tickerType } = item
  const putTickerPrice = useSetAtom(putTickerPriceAtom)
  // const [tickerPrices, setTickerPrices] = useAtom(tickerPricesAtom)
  // const [isPending, startTransition] = useTransition()
  // const [defaultValue, setDefaultValue] = useState(() => tickerPrices.find(t => t.ticker === ticker)?.price || '')
  const [editing, setEditing] = useState(false)
  const { data, dataUpdatedAt, isFetching, error, refetch } = useTickerPrice(
    ticker && isAvailableAutoUpdate(ticker) ? ticker : undefined
  )

  useEffect(() => {
    if (!ticker || !data) return

    putTickerPrice(ticker, data, 'yahoo')
  }, [putTickerPrice, ticker, data])

  return (
    <TableCell className="text-right">
      <div className="flex gap-1 justify-end">
        <Button variant="outline" size="sm">
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
              disabled={tickerType && !ticker}
            >
              📝
            </Button>
          </DialogTrigger>
          <ValueChangeTransactionFormDialogContent item={item} />
        </Dialog>
      </div>
    </TableCell>
  )
}
