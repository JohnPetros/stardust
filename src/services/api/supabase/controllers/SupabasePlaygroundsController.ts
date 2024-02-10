import { IPlaygroundsController } from '../../interfaces/IPlaygroundsController'
import { SupabasePlaygroundAdapter } from '../adapters/SupabasePlaygroundAdapter'
import type { Supabase } from '../types/Supabase'
import type { SupabasePlayground } from '../types/SupabasePlayground'

export const SupabasePlaygroundsController = (
  supabase: Supabase
): IPlaygroundsController => {
  return {
    getPlaygroundsByUserId: async (userId: string) => {
      const { data, error } = await supabase
        .from('playgrounds')
        .select('*, user:users(slug, avatar_id)')
        .eq('user_id', userId)
        .returns<SupabasePlayground[]>()

      if (error) {
        throw new Error(error.message)
      }

      const playgrounds = data.map(SupabasePlaygroundAdapter)

      return playgrounds
    },

    getPlaygroundById: async (id: string) => {
      const { data, error } = await supabase
        .from('playgrounds')
        .select('*, user:users(slug, avatar_id)')
        .eq('id', id)
        .single<SupabasePlayground>()

      if (error) {
        throw new Error(error.message)
      }

      const playground = SupabasePlaygroundAdapter(data)

      return playground
    },

    updatePlaygroundTitleById: async (title: string, id: string) => {
      const { error } = await supabase
        .from('playgrounds')
        .update({ title })
        .eq('id', id)

      if (error) {
        throw new Error(error.message)
      }
    },

    updatePlaygroundCodeById: async (code: string, id: string) => {
      const { error } = await supabase
        .from('playgrounds')
        .update({ code })
        .eq('id', id)

      if (error) {
        throw new Error(error.message)
      }
    },

    updatePublicPlaygroundById: async (isPublic: boolean, id: string) => {
      const { error } = await supabase
        .from('playgrounds')
        .update({ is_public: isPublic })
        .eq('id', id)

      if (error) {
        throw new Error(error.message)
      }
    },

    deletePlaygroundById: async (id: string) => {
      const { error } = await supabase.from('playgrounds').delete().eq('id', id)

      if (error) {
        throw new Error(error.message)
      }
    },
  }
}
