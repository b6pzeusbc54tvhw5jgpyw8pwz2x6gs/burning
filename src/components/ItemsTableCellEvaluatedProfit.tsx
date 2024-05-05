import { TableRowItem } from "../types/item.type"
import { TableCell } from "./ui/table"
import { useItemDetail } from "@/hooks/use-item-price"
import { useAtom } from "jotai"
import { itemHistoricalsByTickerLoadingAtom } from "@/states/ticker-historical.state"
import { currentDateAtom } from "@/states/date.state"

export const ItemsTableCellEvaluatedProfit = (props: {
  item: TableRowItem
}) => {
  const { item } = props
  const { ticker } = item
  const [date] = useAtom(currentDateAtom)
  const [itemHistoricalsByTickerLoading] = useAtom(itemHistoricalsByTickerLoadingAtom)
  const { evaluatedProfit } = useItemDetail(item, date)

  if (ticker && itemHistoricalsByTickerLoading[ticker]) {
    return (
      <TableCell className="text-right animate-pulse">Loading...</TableCell>
    )
  }

  if (evaluatedProfit === null) {
    return (
      <TableCell className="text-right">
        가격 정보가 없습니다
      </TableCell>
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
