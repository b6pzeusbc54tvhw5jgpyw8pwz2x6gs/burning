import { useMemo } from "react"
import { useAtom } from "jotai"
import { entriesByAccountAtom } from "@/states/acount-entries.state"
import { moneyAssetsAtom, stockAssetsAtom } from "@/states/selected-assets.state"
import { AllAccounts } from "@/types/account.type"
import { Entry } from "@/types/entry.type"

/**
 * Record<string, Entry[]> 타입의 entriesByAccount는 ${setiongId}-${accountId} 형태의 키를 가짐.
 * 즉 각 Account 별 Entry[] 를 가지고 있는구조.
 * 이 함수에서는 Entry들을 Account 내 각 항목별로 하번 더 구분하여
 * ${setiongId}-${accountId}-${itemName} 형태의 key를 가진 Record<string, Entry[]>를 반환.
 *
 * Example:
 * entriesByAccount:
 * {
 *  'sectionId-accountId': [Entry1, Entry2, Entry3, Entry4...],
 * }
 *
 * Output:
 * {
 *   'sectionId-accountId-itemName1': [Entry1, Entry3, ...],
 *   'sectionId-accountId-itemName2': [Entry2, Entry4, ...],
 * }
 *
 */
export const useInvestableEntries = (
  allAccounts: AllAccounts
): Record<string, Entry[]> => {
  // Local에 불러온 모든 Account별 Entry.
  const [entriesByAccount] = useAtom(entriesByAccountAtom)

  // 선택된 투자 자산들
  const [stockAssets] = useAtom(stockAssetsAtom)

  // 선택된 현금성 자산들
  const [moneyAssets] = useAtom(moneyAssetsAtom)

  return useMemo(() => {
    const keys = Object.keys(entriesByAccount)
    return keys.reduce((acc, key) => {
      const [sectionId, accountId] = key.split('-')
      const selectedStock = stockAssets.some(sa => sa.sectionId === sectionId && sa.account_id === accountId)
      const selectedMoney = moneyAssets.some(sa => sa.sectionId === sectionId && sa.account_id === accountId)
      const selected = selectedStock || selectedMoney
      if (!selected) {
        return acc
      }

      const assetType = selectedStock ? 'stock' : 'money'

      // 투자 자산 목록은 지금은 모두 "거래처(client)" 타입.
      const assetCategory = allAccounts.assets?.find(a => a.sectionId === sectionId && a.account_id === accountId)?.category
      if (!assetCategory || !['client', 'normal', 'floating'].includes(assetCategory)) {
        return acc
      }

      return { ...acc, [`${assetType}-${assetCategory}-${key}`]: entriesByAccount[key] }
    }, {} satisfies Record<string, Entry[]>)
  }, [entriesByAccount, stockAssets, moneyAssets, allAccounts])
}
