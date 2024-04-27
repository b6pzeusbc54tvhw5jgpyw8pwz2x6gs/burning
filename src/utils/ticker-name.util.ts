
// example: [TICKER=005930.KS]
export const getTicket = (memo: string) => {
  const match = memo.match(/\[TICKER=(.+)\]/)
  if (!match) return null

  return match[1]
}

export const getTicketByMemos = (memo: string[]) => {
  while (memo.length > 0) {
    const ticker = getTicket(memo.shift()!)
    if (ticker) return ticker
  }

  return null
}

export const getManualTicker = (sectionId: string, accountId: string, itemName: string) => {
  const onlyItemName = itemName.split('(')[0]
  return `manual-${sectionId}-${accountId}-${onlyItemName}`.replace(/ /g, '-')
}
