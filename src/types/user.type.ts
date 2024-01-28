import { z } from 'zod'

export const zUser = z.object({
  user_id: z.number(),
  username: z.string(),
  email: z.string(),
  level: z.string(),
  last_ip: z.string(),
  last_login_timestamp: z.number(),
  created_timestamp: z.number(),
  modified_timestamp: z.number(),
  language: z.string(),
  expire: z.number(),
  timezone: z.string(),
  currency: z.string(),
  country: z.string(),
  image: z.string(),
  point: z.string(),
  mileage: z.number(),
  sound: z.string(),
  image_url: z.string(),
})

export type User = z.infer<typeof zUser>
