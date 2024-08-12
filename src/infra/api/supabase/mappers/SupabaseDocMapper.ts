import type { DocDTO } from '@/@core/dtos'
import type { SupabaseDoc } from '../types'
import type { Doc } from '@/@core/domain/entities'

export const SupabaseDocMapper = () => {
  return {
    toDTO(supabaseDoc: SupabaseDoc): DocDTO {
      const docDTO: DocDTO = {
        id: supabaseDoc.id ?? '',
        title: supabaseDoc.title ?? '',
        content: supabaseDoc.content ?? '',
        position: supabaseDoc.position ?? 1,
      }

      return docDTO
    },

    toSupabase(doc: Doc): SupabaseDoc {
      const docDTO = doc.dto

      // @ts-ignore
      const supabaseDoc: SupabaseDoc = {
        id: doc.id,
        title: docDTO.title,
        content: docDTO.content,
        position: docDTO.position,
      }

      return supabaseDoc
    },
  }
}
