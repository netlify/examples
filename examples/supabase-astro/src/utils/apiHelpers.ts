import { supabase } from './database'
import type { Pet } from './types'

export async function getTableData(table: string) {
  const { data, error } = await supabase
    .from(table)
    .select()
    .order('created_at', { ascending: false })

  if (error) {
    console.error(error)
  }

  return (data || []) as Pet[]
}

export async function getPet(id: number) {
  const { data, error } = await supabase.from('pets').select().eq('id', id).single()

  if (error) {
    console.error(error)
  }

  return data as Pet
}

export async function addSnuggle(pet: Pet) {
  const snuggles = pet.snuggles + 1

  const { error } = await supabase.from('pets').update({ snuggles: snuggles }).eq('id', pet.id)

  if (error) {
    console.error(error)
  }
}
