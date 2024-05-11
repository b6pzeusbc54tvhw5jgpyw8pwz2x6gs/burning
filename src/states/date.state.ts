import { atom } from 'jotai'
// import { dateSum } from '@/utils/date.util'
import { atomWithStorage } from 'jotai/utils'
import dayjs from 'dayjs'

// const initial = new Date()

// 로컬시간으로 0시 0분 0초로 초기화
// initial.setHours(0, 0, 0, 0)

// const to = initial
// console.log("🚀 ~ to:", to)
// 🚀 ~ to: Sat May 04 2024 00:00:00 GMT+0900 (Korean Standard Time)

// const from = dateSum(initial, -3)
// console.log("🚀 ~ from:", from)
// 🚀 ~ from: Wed May 01 2024 00:00:00 GMT+0900 (Korean Standard Time)

const nowYYYYMMDD = dayjs().format('YYYY-MM-DD')

export const initialRecent = '3 ←ㅇ'
export const initialStartDate = dayjs(nowYYYYMMDD).subtract(3, 'month').toDate()
export const initialEndDate = dayjs(nowYYYYMMDD).toDate()

export const yearAtom = atom<string | null>(null)
export const quarterAtom = atom<string | null>(null)
export const monthAtom = atom<string | null>(null)
export const recentAtom = atom<string | null>(initialRecent)

export const startDateAtom = atom<Date>(initialStartDate)
export const endDateAtom = atom<Date>(initialEndDate)

export const currentDateAtom = atomWithStorage<number>('current-date', initialEndDate.getTime())
