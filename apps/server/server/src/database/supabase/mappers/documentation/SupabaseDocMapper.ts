import type { DocDto } from '@stardust/core/challenging/entities/dtos'
import { Doc } from '@stardust/core/documentation/entities'

import type { SupabaseDoc } from '../../types'

export class SupabaseDocMapper {
  static toEntity(supabaseDoc: SupabaseDoc): Doc {
    return Doc.create(SupabaseDocMapper.toDto(supabaseDoc))
  }

  static toDto(supabaseDoc: SupabaseDoc): DocDto {
    const docDto: DocDto = {
      id: supabaseDoc.id ?? '',
      title: supabaseDoc.title ?? '',
      content: supabaseDoc.content ?? '',
      position: supabaseDoc.position ?? 1,
    }

    return docDto
  }

  static toSupabase(doc: Doc): SupabaseDoc {
    const docDto = doc.dto

    const supabaseDoc: SupabaseDoc = {
      id: doc.id.value,
      title: docDto.title,
      content: docDto.content,
      position: docDto.position,
    }

    return supabaseDoc
  }
}
