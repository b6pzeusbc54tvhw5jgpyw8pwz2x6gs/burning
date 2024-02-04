'use client'

import { globalTotalPriceAtom } from '@/states/global-total-price.state'
import { useAtom } from 'jotai'

export const GlobalTotalPrice = () => {
  const [globalTotalPrice ] = useAtom(globalTotalPriceAtom)

  return globalTotalPrice.toLocaleString()
}
