import { createClient } from '@libsql/client'

const tursoUrl = process.env.TURSO_DATABASE_URL as string
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN as string

export const turso = createClient({
  url: tursoUrl,
  authToken: tursoAuthToken,
})
