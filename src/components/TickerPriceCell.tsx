import { useAtom, useSetAtom } from "jotai"
import { startTransition, useEffect, useRef, useState, useTransition } from 'react'
import { putTickerPriceAtom, tickerPricesAtom } from "../states/ticker-price"
import { Item } from "../types/item.type"
import Link from "next/link"
import { getTickerPrice } from "../server/actions/yahoo-finance"
import { useTickerPrice } from "../data/hooks"
import { Box, TextField } from '@radix-ui/themes'

const isAvailableAutoUpdate = (ticker: string) => {
  return !ticker.startsWith('비상장-')
}



export const TickerPriceCell = (props: {
  item: Item
}) => {
  const { item } = props
  const { ticker, isFund } = item
  const putTickerPrice = useSetAtom(putTickerPriceAtom)
  const [tickerPrices, setTickerPrices] = useAtom(tickerPricesAtom)
  // const [isPending, startTransition] = useTransition()
  const [defaultValue, setDefaultValue] = useState(() => tickerPrices.find(t => t.ticker === ticker)?.price || '')
  const [editing, setEditing] = useState(false)
  const { data, dataUpdatedAt, isFetching, error, refetch } = useTickerPrice(
    ticker && isAvailableAutoUpdate(ticker) ? ticker : undefined
  )

  if (isFund) {
    return <td className='text-right'>-</td>
  }

  if (!ticker) {
    return <td className='text-right'>Ticker를 입력해주세요</td>
  }

  // https://finance.yahoo.com/quote/360750.KS?p=360750.KS&.tsrc=fin-srch
  return (
    <td
      className="flex w-full flex-col"
    >
      <TextField.Input
        type="text"
        // className='text-gray-900 text-right'
        value={editing ? undefined : tickerPrices.find(t => t.ticker === ticker)?.price || ''}
        onFocus={e => setEditing(true)}
        onBlur={e => {
          putTickerPrice(ticker!, Number(e.target.value), 'manual')
          setEditing(false)
        }}
      />

      <div
        // Flex 우측 정렬
        className={'flex gap-2 justify-end'}
      >
        {isAvailableAutoUpdate(ticker) && !isFetching && (
          <>
            <Link
              href={`https://finance.yahoo.com/quote/${ticker}?p=${ticker}&.tsrc=fin-srch`}
              target="_blank"
            >
                link
            </Link>
            <button onClick={() => refetch()}>
              update
            </button>
          </>
        )}
        {isFetching && (
          <div className='animate-pulse'>loading...</div>
        )}

      </div>
    </td>
  )
}
