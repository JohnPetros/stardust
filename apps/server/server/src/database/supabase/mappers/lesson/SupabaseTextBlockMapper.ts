import type { TextBlockDto } from '@stardust/core/global/entities/dtos'
import { TextBlock } from '@stardust/core/global/structures'

export class SupabaseTextBlockMapper {
  static toEntity(supabaseTextBlock: TextBlockDto): TextBlock {
    return TextBlock.create(
      supabaseTextBlock.type,
      supabaseTextBlock.content,
      supabaseTextBlock.isRunnable,
    )
  }
}
