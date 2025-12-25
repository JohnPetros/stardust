import type { GuideDto } from '@stardust/core/manual/entities/dtos'
import { Guide } from '@stardust/core/manual/entities'
import { GuideCategory } from '@stardust/core/manual/structures'

import type { SupabaseGuide } from '../../types'

export class SupabaseGuideMapper {
  static toEntity(supabaseGuide: SupabaseGuide): Guide {
    return Guide.create(SupabaseGuideMapper.toDto(supabaseGuide))
  }

  static toDto(supabaseGuide: SupabaseGuide): GuideDto {
    const guideDto: GuideDto = {
      id: supabaseGuide.id ?? '',
      title: supabaseGuide.title ?? '',
      content: supabaseGuide.content ?? '',
      position: supabaseGuide.position ?? 1,
      category: supabaseGuide.category ?? '',
    }
    return guideDto
  }

  static toSupabase(guide: Guide): SupabaseGuide {
    const guideDto = guide.dto

    const supabaseGuide: SupabaseGuide = {
      id: guide.id.value,
      title: guideDto.title,
      content: guideDto.content,
      position: guideDto.position,
      category: GuideCategory.isValid(guideDto.category) ? guideDto.category : 'lsp',
    }
    return supabaseGuide
  }
}
