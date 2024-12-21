import type { DocDto } from '#dtos'
import type { SupabaseDoc } from '../types'
import type { Doc } from '@/@core/domain/entities'

export const SupabaseDocMapper = () => {
  return {
    toDto(supabaseDoc: SupabaseDoc): DocDto {
      const docDto: DocDto = {
        id: supabaseDoc.id ?? '',
        title: supabaseDoc.title ?? '',
        content: supabaseDoc.content ?? '',
        position: supabaseDoc.position ?? 1,
      }

      return docDto
    },

    toSupabase(doc: Doc): SupabaseDoc {
      const docDto = doc.dto

      // @ts-ignore
      const supabaseDoc: SupabaseDoc = {
        id: doc.id,
        title: docDto.title,
        content: docDto.content,
        position: docDto.position,
      }

      return supabaseDoc
    },
  }
}
