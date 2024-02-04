import { atomWithStorage } from 'jotai/utils'
import { Entry } from '../types/entry.type'
import { atom } from 'jotai'
import { getAllEntries, getEntries } from '../server/actions/whooing'
import { Account } from '../types/account.type'
import { stockAssetsAtom } from './stock-assets.state'

export interface AccountEntries {
  sectionId: string
  accountId: string
  loading: boolean
  entries?: Entry[]
}

export const accountEntriesAtom = atomWithStorage<AccountEntries[]>('account-entries', [])

export const fetchAccountEntriesAtom = atom(
  null,
  async (get, set, account: Account) => {
    const { sectionId, account_id } = account
    let prev = get(accountEntriesAtom)
    if (prev.find(p => p.accountId === account_id)) return

    const stockAssets = get(stockAssetsAtom)

    const updatedForLoading = [
      ...prev,
      { sectionId, accountId: account_id, loading: true }
    ].sort((a, b) => {
      const aIdx = stockAssets.findIndex(s => s.account.account_id === a.accountId)
      const bIdx = stockAssets.findIndex(s => s.account.account_id === b.accountId)
      return aIdx - bIdx
    })

    set(accountEntriesAtom, updatedForLoading)

    const data = await getAllEntries(account)

    prev = get(accountEntriesAtom)
    const idx = prev.findIndex(p => p.accountId === account_id)
    if (idx < 0) return

    set(accountEntriesAtom, [
      ...prev.slice(0, idx),
      { ...prev[idx], loading: false, entries: data },
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
