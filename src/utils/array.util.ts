
export const updateItem = <T>(acc: T[], cur: T, idx: number) => {
  if (idx === -1) {
    return [...acc, cur]
  }
  return [
    ...acc.slice(0, idx),
    cur,
    ...acc.slice(idx + 1)
  ]
}
