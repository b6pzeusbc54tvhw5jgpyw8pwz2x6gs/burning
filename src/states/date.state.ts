import { atom } from 'jotai'
import { dateSum } from '@/utils/date.util'

const initial = new Date()
initial.setHours(0, 0, 0, 0)

export const startDateAtom = atom<Date>(dateSum(initial, -30))
export const endDateAtom = atom<Date>(initial)

export const currentDateAtom = atom<Date>(initial)
