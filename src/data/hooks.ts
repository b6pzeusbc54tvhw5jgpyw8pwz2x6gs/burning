import { getAllAccounts, getAllEntries, getSections, getUser, postEntry } from "@/server/actions/whooing"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Account } from "../types/account.type"
import ms from "ms"

export function useUser() {
  return useQuery({
    queryFn: async () => getUser(),
    queryKey: ["user"],
    refetchInterval: ms('3m'),
  })
}

export function useSections() {
  return useQuery({
    queryFn: async () => getSections(),
    queryKey: ["sections"],
    refetchInterval: ms('3m'),
  })
}

export function useAccounts(sectionId: string) {
  return useQuery({
    queryFn: async () => getAllAccounts(sectionId),
    queryKey: ["accounts", sectionId],
    refetchInterval: ms('3m'),
  })
}

export function useAllEntries(account: Account) {
  return useQuery({
    queryFn: async () => getAllEntries(account),
    queryKey: ["allEntries", account],
    refetchInterval: ms('3m'),
  })
}

export function usePostEntry() {
  return useMutation({
    mutationFn: (entry: Parameters<typeof postEntry>[0]) => postEntry(entry),
  })
}
