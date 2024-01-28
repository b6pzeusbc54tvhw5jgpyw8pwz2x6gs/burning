import { useAtom, useSetAtom } from "jotai"
import { startTransition, useEffect, useRef, useState, useTransition } from 'react'
import { putTickerPriceAtom, tickerPricesAtom } from "../states/ticker-price"
import { Item } from "../types/item.type"
import Link from "next/link"
import { getTickerPrice } from "../app/actions-yahoo-finance"

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
  const [isPending, startTransition] = useTransition()
  const [defaultValue, setDefaultValue] = useState(() => tickerPrices.find(t => t.ticker === ticker)?.price || '')
  const [editing, setEditing] = useState(false)

  const handleUpdateTickerPrice = (ticker: string) => {
    startTransition(async () => {
      try {
        const tickerPrice = await getTickerPrice(ticker)
        putTickerPrice(ticker, tickerPrice, 'yahoo')
      } catch (err) {
        console.log(err)
      }
    })
  }

  return (
    <td className='text-right'>
      {isFund ? (
        '-'
      ) : ticker ? (
      // JPX2563
      // https://finance.yahoo.com/quote/360750.KS?p=360750.KS&.tsrc=fin-srch
        <div
          // Flex 우측 정렬
          className={'flex gap-2 justify-end'}
        >
          {isAvailableAutoUpdate(ticker) && (
            <>
              <Link
                href={`https://finance.yahoo.com/quote/${ticker}?p=${ticker}&.tsrc=fin-srch`}
                target="_blank"
              >
                link
              </Link>
              <button
                onClick={() => handleUpdateTickerPrice(ticker)}
              >
                update
              </button>
            </>
          )}

          <input
            type="text"
            className='w-24 text-gray-900 text-right'
            value={editing ? undefined : tickerPrices.find(t => t.ticker === ticker)?.price || ''}
            onFocus={e => setEditing(true)}
            onBlur={e => {
              putTickerPrice(ticker!, Number(e.target.value), 'manual')
              setEditing(false)
            }}
          />
        </div>
      ) : 'Ticker를 입력해주세요.'}
    </td>
  )
}
