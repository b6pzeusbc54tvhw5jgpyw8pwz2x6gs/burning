import { atom } from 'jotai'
import { dateSum } from '@/utils/date.util'

const initial = new Date()

// 로컬시간으로 0시 0분 0초로 초기화
initial.setHours(0, 0, 0, 0)

// const to = initial
// console.log("🚀 ~ to:", to)
// 🚀 ~ to: Sat May 04 2024 00:00:00 GMT+0900 (Korean Standard Time)

// const from = dateSum(initial, -3)
// console.log("🚀 ~ from:", from)
// 🚀 ~ from: Wed May 01 2024 00:00:00 GMT+0900 (Korean Standard Time)

export const startDateAtom = atom<Date>(dateSum(initial, -60))
export const endDateAtom = atom<Date>(initial)

export const currentDateAtom = atom<Date>(initial)
