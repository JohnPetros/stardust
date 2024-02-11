import { IPlaygroundsController } from '../../interfaces/IPlaygroundsController'
import { SupabasePlaygroundAdapter } from '../adapters/SupabasePlaygroundAdapter'
import type { Supabase } from '../types/Supabase'
import type { SupabasePlayground } from '../types/SupabasePlayground'

import type { Playground } from '@/@types/Playground'

export const SupabasePlaygroundsController = (
  supabase: Supabase
): IPlaygroundsController => {
  return {
    async getPlaygroundsByUserId(userId: string) {
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

    async getPlaygroundById(id: string) {
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

    async addPlayground(
      newPlayground: Omit<Playground, 'id' | 'user'>,
      userSlug: string
    ) {
      const { error } = await supabase.from('playgrounds').insert({
        title: newPlayground.title,
        code: newPlayground.code,
        is_public: newPlayground.isPublic,
        user_slug: userSlug,
        user_id: '',
      })
      if (error) {
        throw new Error(error.message)
      }
    },

    async updatePlaygroundTitleById(title: string, id: string) {
      const { error } = await supabase
        .from('playgrounds')
        .update({ title })
        .eq('id', id)

      if (error) {
        throw new Error(error.message)
      }
    },

    async updatePlaygroundCodeById(code: string, id: string) {
      const { error } = await supabase
        .from('playgrounds')
        .update({ code })
        .eq('id', id)

      if (error) {
        throw new Error(error.message)
      }
    },

    async updatePublicPlaygroundById(isPublic: boolean, id: string) {
      console.log({ isPublic })
      const { error } = await supabase
        .from('playgrounds')
        .update({ is_public: isPublic })
        .eq('id', id)

      if (error) {
        throw new Error(error.message)
      }
    },

    async deletePlaygroundById(id: string) {
      const { error } = await supabase.from('playgrounds').delete().eq('id', id)

      if (error) {
        throw new Error(error.message)
      }
    },
  }
}
