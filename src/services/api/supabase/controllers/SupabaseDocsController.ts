import { IDocsController } from '../../interfaces/IDocsController'
import type { Supabase } from '../types/Supabase'

import type { Doc } from '@/@types/Doc'

export const SupabaseDocsController = (supabase: Supabase): IDocsController => {
  return {
    getDocsOrderedByPosition: async () => {
      const { data, error } = await supabase
        .from('docs')
        .select('*')
        .order('position', { ascending: true })
        .returns<Doc[]>()

      if (error) {
        throw new Error(error.message)
      }

      const docs: Doc[] = data.map((doc) => ({
        id: doc.id,
        title: doc.title,
        content: doc.content,
        position: doc.position,
      }))

      return docs
    },

    getUserUnlockedDocsIds: async (userId: string) => {
      const { data, error } = await supabase
        .from('users_unlocked_docs')
        .select('doc_id')
        .eq('user_id', userId)
        .returns<{ doc_id: string }[]>()

      if (error) {
        throw new Error(error.message)
      }

      return data.map((data) => data.doc_id)
    },

    checkDocUnlocking: async (docId: string, userId: string) => {
      const { data, error } = await supabase
        .from('users_unlocked_docs')
        .select('doc_id')
        .eq('doc_id', docId)
        .eq('user_id', userId)

      if (error) {
        throw new Error(error.message)
      }

      return !data
    },

    addUnlockedDoc: async (docId: string, userId: string) => {
      const { error } = await supabase
        .from('users_unlocked_docs')
        .insert({ doc_id: docId, user_id: userId })

      console.log({ error })

      if (error) {
        throw new Error(error.message)
      }
    },
  }
}
