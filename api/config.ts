import { z } from 'zod'

const envSchema = z.object({
  INFLUX_URL: z.string().url(),
  INFLUX_TOKEN: z.string(),
  INFLUX_ORG: z.string(),
  INFLUX_BUCKET: z.string(),
  GARMIN_COOKIE_PATH: z.string(),
  GARMIN_EMAIL: z.string().email(),
  GARMIN_PASSWORD: z.string(),
  PORT: z.string().optional(),
})

envSchema.parse(process.env)

export default process.env
