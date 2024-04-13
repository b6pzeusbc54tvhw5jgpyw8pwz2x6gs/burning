import { atomWithStorage } from 'jotai/utils'
import { atom } from 'jotai'
import { last } from 'radash'
import { Entry } from '../types/entry.type'
import { getAllEntries } from '../server/actions/whooing'
import { Account } from '../types/account.type'
import { dateSum } from '@/util'

// entry_id 가 유니크.
const mergeEntries = (oldItems: Entry[], newItems: Entry[], updatedFirstEntryDate?: string) => {
  return [
    // 기존 entries에서 업데이트되는 첫번째 날짜 기준으로 그 이상의 날짜 데이터는 모두 제거
    ...oldItems.filter(oi => updatedFirstEntryDate ? oi.entry_date.split('.')[0] < updatedFirstEntryDate : true),
    ...newItems,
  ]
}

// key는 ${sectionId}-${accountId}
export type EntriesByAccount = Record<string, Entry[]>

export const entriesByAccountAtom = atomWithStorage<EntriesByAccount>('entries-by-account', {})
export const entriesByAccountLoadingAtom = atom<Record<string, boolean>>({})

export const fetchEntriesByAccountAtom = atom(null, async (get, set, account: Account) => {
  const { sectionId, account_id } = account
  const key = `${sectionId}-${account_id}`

  // 이미 로딩 중이면 return
  if (get(entriesByAccountLoadingAtom)[key]) return

  // loading on
  set(entriesByAccountLoadingAtom, p => ({ ...p, [key]: true }))

  let prev = get(entriesByAccountAtom)
  const exitingItem = prev[key]

  // 마지막 데이터 기준으로 2주 전 데이터까지를 갱신.
  const day2WeeksAgo = exitingItem
    ? dateSum(last(exitingItem)?.entry_date.split('.')[0]!, -14)
    : undefined
  const data = await getAllEntries(account, Number(day2WeeksAgo) || undefined)

  const updatedEntries = mergeEntries(exitingItem || [], data, day2WeeksAgo)
  set(entriesByAccountAtom, p => ({ ...p, [key]: updatedEntries }))

  // loading off
  set(entriesByAccountLoadingAtom, p => ({ ...p, [key]: false }))
})

export const removeAccountEntriesAtom = atom(null, (get, set, account: Account) => {
  const { sectionId, account_id } = account
  const key = `${sectionId}-${account_id}`

  // 이미 없으면 return
  const prev = get(entriesByAccountAtom)
  if (!prev[key]) return

  const updated = { ...prev }
  delete updated[key]
  set(entriesByAccountAtom, updated)
})
