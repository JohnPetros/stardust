import type { TextBlockDto } from '@stardust/core/global/entities/dtos'
import { TextBlock } from '@stardust/core/global/structures'

export class SupabaseTextBlockMapper {
  static toEntity(supabaseTextBlock: TextBlockDto): TextBlock {
    return TextBlock.create(supabaseTextBlock)
  }

  static toSupabase(textBlock: TextBlock): TextBlockDto {
    return textBlock.dto
  }
}
