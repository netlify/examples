import { createClient } from '@libsql/client'

const tursoUrl = import.meta.env.TURSO_DATABASE_URL as string
const tursoAuthToken = import.meta.env.TURSO_AUTH_TOKEN as string

export const turso = createClient({
  url: `libsql://${tursoUrl}`,
  authToken: tursoAuthToken,
})
