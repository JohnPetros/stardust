import { IPlaygroundsController } from '../../interfaces/IPlaygroundsController'
import type { Supabase } from '../types/supabase'

import { Playground } from '@/@types/playground'

export const PlaygroundsController = (
  supabase: Supabase
): IPlaygroundsController => {
  return {
    getPlaygroundsByUserId: async (userId: string) => {
      const { data, error } = await supabase
        .from('playgrounds')
        .select('*')
        .eq('user_id', userId)
        .returns<Playground[]>()

      if (error) {
        throw new Error(error.message)
      }

      const playgrounds: Playground[] = data.map((playground) => ({
        id: playground.id,
        title: playground.title,
        code: playground.code,
        user_id: playground.user_id,
        is_open: playground.is_open,
      }))

      return playgrounds
    },

    getPlaygroundById: async (id: string) => {
      const { data, error } = await supabase
        .from('playgrounds')
        .select('*')
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
        is_open: data.is_open,
      }

      return playground
    },

    deletePlaygroundById: async (id: string) => {
      const { error } = await supabase.from('playgrounds').delete().eq('id', id)

      if (error) {
        throw new Error(error.message)
      }
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
  }
}
