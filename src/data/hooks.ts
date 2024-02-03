import { getAccounts, getAllEntries, getEntries, getSections, getUser } from "@/server/actions/whooing"
import { getTickerPrice } from "@/server/actions/yahoo-finance"
import { useQuery } from "@tanstack/react-query"
import { Account } from "../types/account.type"
import ms from "ms"

export function useUser() {
  return useQuery({
    queryFn: async () => getUser(),
    queryKey: ["user"],
  })
}

export function useSections() {
  return useQuery({
    queryFn: async () => getSections(),
    queryKey: ["sections"],
  })
}

export function useAccounts(sectionId: string) {
  return useQuery({
    queryFn: async () => getAccounts(sectionId),
    queryKey: ["accounts", sectionId],
  })
}

export function useAllEntries(account: Account) {
  return useQuery({
    queryFn: async () => getAllEntries(account),
    queryKey: ["allEntries", account],
  })
}

export function useTickerPrice(ticker?: string) {
  return useQuery({
    // enabled: !!ticker,
    queryFn: async () => ticker ? getTickerPrice(ticker) : null,
    queryKey: ["tickerPrice", ticker],
    refetchInterval: ms('3m'),
  })
}
