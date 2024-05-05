import { useAtom, useSetAtom } from "jotai"
import { useState } from 'react'
import { TableRowItem } from "../types/item.type"
import { TableCell } from "./ui/table"
import { Button } from "./ui/button"
import { Eraser, RefreshCw } from "lucide-react"
import { ValueChangeTransactionDialog } from "./ValueChangeTransactionDialog"
import { useItemDetail } from "@/hooks/use-item-price"
import { toast } from "react-toastify"
import { currentDateAtom } from "@/states/date.state"
import { removeTickerNameAtom, toggleExternalWalletItemAtom } from "@/states/ticker-name.state"
import { EmojiButton } from "./EmojiButton"

export const ItemsTableCellActions = (props: {
  item: TableRowItem
}) => {
  const { item } = props
  const { ticker } = item
  const [openedVCTDialog, setOpenedVCTDialog] = useState(false)

  const removeTickerName = useSetAtom(removeTickerNameAtom)

  const handleReset = () => {
    const itemKey = `${item.sectionId}-${item.accountId}-${item.name}`
    removeTickerName(itemKey)
  }

  const [date] = useAtom(currentDateAtom)
  const { evaluatedProfit } = useItemDetail(item, date)
  const toggleExternalWalletItem = useSetAtom(toggleExternalWalletItemAtom)

  const handleOpenVCTDialog = () => {
    if (evaluatedProfit !== null && evaluatedProfit < 1 && evaluatedProfit > -1) {
      toast.warn('손익이 1원 미만입니다')
      return
    }

    setOpenedVCTDialog(true)
  }

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
            onClick={() => toast.info('구현 해야함')}
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
        {openedVCTDialog && (
          <ValueChangeTransactionDialog
            item={item}
            opened={openedVCTDialog}
            setOpened={setOpenedVCTDialog}
          />
        )}
        <Button
          variant="outline"
          size="sm"
        >
          <Eraser
            className="h-4 w-4"
            onClick={() => handleReset()}
          />
        </Button>
        <EmojiButton
          onClick={() => item.ticker ? toggleExternalWalletItem(item.ticker) : undefined}
          emoji="🧾"
        />
      </div>
    </TableCell>
  )
}
