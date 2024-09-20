import { turso } from './database'

export async function getTableData(table: string) {
  const data = await turso.execute(`SELECT * FROM ${table} order by created_at desc`)

  console.log(data)

  return data || []
}

export async function getPet(id: string) {
  const data = await turso.execute({ sql: `SELECT * FROM pets WHERE id = ?`, args: [id] })

  return data
}
