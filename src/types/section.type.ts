import { z } from "zod"

export const zSection = z.object({
  section_id: z.string(), // "s123"
  title: z.string(), // "유동성 자산"
  memo: z.string(), // "자주접근하는 자산만 관리"
  currency: z.string(), // "KRW"
  isolation: z.optional(z.string()), // "n"
  total_assets: z.number(), // 2982799.00
  total_liabilities: z.number(), // 23910.00
  skin_id: z.string(), // "0"
  decimal_places: z.number(), // 2
  date_format: z.string(), // "YMD"
  webhook_token: z.string(), // "xxxx-xxxx-xxxx-xxxx"
})
