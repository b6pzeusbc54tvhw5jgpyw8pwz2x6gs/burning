import { z } from "zod"

export const zEntry = z.object({
  entry_id: z.number(), // 1352827
  entry_date: z.string(), // "20110817.0001"
  l_account: z.string(), // "expenses"
  l_account_id: z.string(), // "x20"
  r_account: z.string(), // "assets"
  r_account_id: z.string(), // "x4"
  item: z.string(), // "후원(과장학금)"
  money: z.number(), // 10000
  total: z.number(), // 840721.99
  memo: z.string(), // ""
  app_id: z.number(), // 0
  attachments: z.array(z.object({
    uuid: z.string(), // "810cbdb1b-7486jvk57"
    src: z.string(), // "https://static.whooing.com/get/810cbdb1b-7486jvk57"
    filename: z.string(), // "example.jpg"
    mimeType: z.string(), // "image/jpeg"
    size: z.number(), // 28098
  })),
})

export type Entry = z.infer<typeof zEntry>
