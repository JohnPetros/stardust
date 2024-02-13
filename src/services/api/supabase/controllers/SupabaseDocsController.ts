import { IDocsController } from '../../interfaces/IDocsController'
import type { Supabase } from '../types/Supabase'

import type { Doc } from '@/@types/Doc'

export const SupabaseDocsController = (supabase: Supabase): IDocsController => {
  return {
    async getDocsOrderedByPosition() {
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

    async getUserUnlockedDocsIds(userId: string) {
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

    async addUnlockedDoc(docId: string, userId: string) {
      const { error } = await supabase
        .from('users_unlocked_docs')
        .insert({ doc_id: docId, user_id: userId })

      if (error) {
        throw new Error(error.message)
      }
    },

    async checkDocUnlocking(docId: string, userId: string) {
      const { data, error } = await supabase
        .from('users_unlocked_docs')
        .select('user_id')
        .eq('doc_id', docId)
        .eq('user_id', userId)
        .single()

      if (error) {
        return false
      }

      return Boolean(data.user_id)
    },
  }
}
