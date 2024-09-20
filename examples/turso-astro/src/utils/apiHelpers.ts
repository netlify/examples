import { turso } from './database'
import type { Pet } from './types'

export async function getTableData(table: string) {
  try {
    const data = await turso.execute(`SELECT * FROM ${table} order by created_at desc`)
    return (data.rows || []) as unknown as Pet[]
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function getPet(id: number) {
  try {
    const data = await turso.execute({ sql: `SELECT * FROM pets WHERE id = ?`, args: [id] })

    if (data.rows.length === 0) {
      console.error(`No pet found with id ${id}`)
      return
    }
    const pet = data.rows[0] as unknown as Pet

    return pet
  } catch (error) {
    console.error(error)
    return
  }
}

export async function addSnuggle(pet: Pet) {
  try {
    await turso.execute({
      sql: `UPDATE pets SET snuggles = snuggles + 1 WHERE id = ?`,
      args: [pet.id],
    })
  } catch (error) {
    console.error(error)
  }
}