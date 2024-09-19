import { supabase } from './database'

export async function getTableData(table: string) {
  const { data, error } = await supabase
    .from(table)
    .select()
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
  }

  return data || []
}

export async function getPet(id: string) {
  const { data, error } = await supabase.from('pets').select().eq('id', id).single()

  if (error) {
    console.error(error)
  }

  return data
}
