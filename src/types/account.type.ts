import { z } from "zod"

export const zAccount = z.object({
  account_id: z.string(),
  type: z.string(),
  title: z.string(),
  memo: z.string(),
  open_date: z.number(),
  close_date: z.number(),
  category: z.string(),
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

export type AccountType = z.infer<typeof zAccountType>
