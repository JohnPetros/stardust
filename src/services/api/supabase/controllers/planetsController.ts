import type { Supabase } from '../types/supabase'

import type { Planet } from '@/@types/planet'

export const PlanetsController = (supabase: Supabase) => {
  return {
    getPlanets: async () => {
      const { data, error } = await supabase
        .from('planets')
        .select('*, stars (*)')
        .order('position', { ascending: true })
        .order('number', { foreignTable: 'stars', ascending: true })
        .returns<Planet[]>()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },
  }
}