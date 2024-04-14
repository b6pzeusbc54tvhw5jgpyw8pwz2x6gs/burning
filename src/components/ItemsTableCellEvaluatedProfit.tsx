import { TableRowItem } from "../types/item.type"
import { TableCell } from "./ui/table"
import { useItemDetail } from "@/hooks/use-item-price"
import { useAtom } from "jotai"
import { itemHistoricalsByTickerLoadingAtom } from "@/states/ticker-historical.state"

export const ItemsTableCellEvaluatedProfit = (props: {
  item: TableRowItem
}) => {
  const { item } = props
  const { ticker } = item
  const [itemHistoricalsByTickerLoading] = useAtom(itemHistoricalsByTickerLoadingAtom)
  const { evaluatedProfit } = useItemDetail(item)

  if (ticker && itemHistoricalsByTickerLoading[ticker]) {
    return (
      <TableCell className="text-right animate-pulse">Loading...</TableCell>
    )
  }

  return (
    <TableCell className="text-right">
      <span className={`${evaluatedProfit >= 0 ? 'text-green-600' : 'text-red-400'}`}>
        {evaluatedProfit >= 0 ? '+' : '-'} {Math.abs(Math.floor(evaluatedProfit)).toLocaleString()}원
      </span>
    </TableCell>
  )
}
