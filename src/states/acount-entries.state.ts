import { atomWithStorage } from 'jotai/utils'
import { Entry } from '../types/entry.type'
import { atom } from 'jotai'
import { getAllEntries, getEntries } from '../server/actions/whooing'
import { Account } from '../types/account.type'
import { stockAssetsAtom } from './stock-assets.state'
import { last, unique } from 'radash'

// entry_id 가 유니크.
const mergeEntries = (oldItems: Entry[], newItems: Entry[], updatedFirstEntryDate?: string) => {
  return [
    // 기존 entries에서 업데이트되는 첫번째 날짜 기준으로 그 이상의 날짜 데이터는 모두 제거
    ...oldItems.filter(oi => updatedFirstEntryDate ? oi.entry_date.split('.')[0] < updatedFirstEntryDate : true),
    ...newItems,
  ]
}

export interface AccountEntries {
  sectionId: string
  accountId: string
  loading: boolean
  entries: Entry[]
}

export const accountEntriesAtom = atomWithStorage<AccountEntries[]>('account-entries', [])

export const fetchAccountEntriesAtom = atom(
  null,
  async (get, set, account: Account) => {
    const { sectionId, account_id } = account
    let prev = get(accountEntriesAtom)

    const exitingItem = prev.find(p => p.accountId === account_id)
    const updatedItem = exitingItem
      ? { ...exitingItem, loading: true }
      : { sectionId, accountId: account_id, loading: true, entries: [] }

    const stockAssets = get(stockAssetsAtom)
    const updatedForLoading = prev
      .filter(p => p.accountId !== account_id)
      .concat(updatedItem)
      .sort((a, b) => {
        const aIdx = stockAssets.findIndex(s => s.account.account_id === a.accountId)
        const bIdx = stockAssets.findIndex(s => s.account.account_id === b.accountId)
        return aIdx - bIdx
      })

    set(accountEntriesAtom, updatedForLoading)

    const lastEntryDate = exitingItem
      ? last(exitingItem.entries)?.entry_date.split('.')[0]
      : undefined
    const initialDate = lastEntryDate ? Number(lastEntryDate) : undefined

    const data = await getAllEntries(account, initialDate)

    prev = get(accountEntriesAtom)
    const idx = prev.findIndex(p => p.accountId === account_id)
    if (idx < 0) return

    const fetchedItem = {
      ...updatedItem,
      loading: false,
      entries: mergeEntries(updatedItem.entries, data, lastEntryDate),
    }

    set(accountEntriesAtom, [
      ...prev.slice(0, idx),
      fetchedItem,
      ...prev.slice(idx + 1),
    ])
  }
)

export const removeAccountEntriesAtom = atom(
  null,
  (get, set, account: Account) => {
    const { sectionId, account_id } = account
    const prev = get(accountEntriesAtom)
    const idx = prev.findIndex(p => p.sectionId === sectionId && p.accountId === account_id)
    if (idx < 0) return

    set(accountEntriesAtom, [
      ...prev.slice(0, idx),
      ...prev.slice(idx + 1),
    ])
  }
)
