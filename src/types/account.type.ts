import { z } from "zod"

export const zAccount = z.object({
  account_id: z.string(),
  title: z.string(),
  type: z.enum([
    'account',
    'group',
  ]),
  memo: z.string(),
  open_date: z.number(),
  close_date: z.number(),
  category: z.enum([
    'normal',  // 일반
    'client',  // 거래처
    'creditcard',  // 신용카드
    'checkcard', // 체크카드

    'floating', //
    'steady', //
  ]),
  opt_use_date: z.string(),
  opt_pay_date: z.string().or(z.number()),
  opt_pay_account_id: z.string(),

  // 따로 client에서 추가한 필드
  sectionId: z.string(),
})

export type Account = z.infer<typeof zAccount>

export const zAccountType = z.enum([
  "assets",
  "liabilities",
  "capital",
  "income",
  "expenses",
])

export const zAllAccounts = z.object({
  assets: zAccount.array().optional(),
  liabilities: zAccount.array().optional(),
  capital: zAccount.array().optional(),
  income: zAccount.array().optional(),
  expenses: zAccount.array().optional(),
})

export type AccountType = z.infer<typeof zAccountType>
export type AllAccounts = z.infer<typeof zAllAccounts>
