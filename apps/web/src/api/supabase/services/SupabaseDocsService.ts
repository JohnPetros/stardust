import type { IDocsService } from '@/@core/interfaces/services'
import { ServiceResponse } from '@/@core/responses'

import type { Supabase } from '../types/Supabase'
import { SupabasePostgrestError } from '../errors'
import { SupabaseDocMapper } from '../mappers'
import { FetchDocsUnexpectedError } from '@/@core/errors/docs'

export const SupabaseDocsService = (supabase: Supabase): IDocsService => {
  const supabaseDocMapper = SupabaseDocMapper()

  return {
    async fetchDocs() {
      const { data, error } = await supabase
        .from('docs')
        .select('*')
        .order('position', { ascending: true })

      if (error) {
        return SupabasePostgrestError(error, FetchDocsUnexpectedError)
      }

      const docs = data.map(supabaseDocMapper.toDto)

      return new ServiceResponse(docs)
    },

    async saveUnlockedDoc(docId: string, userId: string) {
      const { error } = await supabase
        .from('users_unlocked_docs')
        .insert({ doc_id: docId, user_id: userId })

      if (error) {
        return SupabasePostgrestError(error, FetchDocsUnexpectedError)
      }

      return new ServiceResponse(true)
    },
  }
}
