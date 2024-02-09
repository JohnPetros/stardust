import { IPlaygroundsController } from '../../interfaces/IPlaygroundsController'
import type { Supabase } from '../types/supabase'

import type { Playground } from '@/@types/Playground'

export const PlaygroundsController = (
  supabase: Supabase
): IPlaygroundsController => {
  return {
    getPlaygroundsByUserId: async (userId: string) => {
      const { data, error } = await supabase
        .from('playgrounds')
        .select('*, user:users(slug, avatar_id)')
        .eq('user_id', userId)

      if (error) {
        throw new Error(error.message)
      }

      const playgrounds: Playground[] = data.map((playground) => ({
        id: playground.id,
        title: playground.title,
        code: playground.code,
        user_id: playground.user_id,
        is_public: playground.is_public,
      }))

      return playgrounds
    },

    getPlaygroundById: async (id: string) => {
      const { data, error } = await supabase
        .from('playgrounds')
        .select('*, user:users(slug, avatar_id)')
        .eq('id', id)
        .single<Playground>()

      if (error) {
        throw new Error(error.message)
      }

      const playground: Playground = {
        id: data.id,
        title: data.title,
        code: data.code,
        user_id: data.user_id,
        is_public: data.is_public,
        user: data.user,
      }

      return playground
    },

    updatePlaygroundTitleById: async (title: string, id: string) => {
      console.log(title)
      const { error } = await supabase
        .from('playgrounds')
        .update({ title })
        .eq('id', id)

      console.log({ error })
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
