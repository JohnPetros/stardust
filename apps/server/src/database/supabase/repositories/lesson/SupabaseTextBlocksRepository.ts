import type { Id, Integer, TextBlock } from '@stardust/core/global/structures'
import type { TextBlockAudio } from '@stardust/core/lesson/structures'
import type { TextBlocksRepository } from '@stardust/core/lesson/interfaces'
import type { TextBlockDto } from '@stardust/core/global/entities/dtos'
import type { Json } from '@/database/supabase/types/Database'

import { SupabaseRepository } from '../SupabaseRepository'
import { SupabasePostgreError } from '../../errors'
import { SupabaseTextBlockMapper } from '../../mappers/lesson'

export class SupabaseTextBlocksRepository
  extends SupabaseRepository
  implements TextBlocksRepository
{
  async findAllByStar(starId: Id): Promise<TextBlock[]> {
    const { data, error } = await this.supabase
      .from('stars')
      .select('texts')
      .eq('id', starId.value)
      .single()

    if (error) {
      throw new SupabasePostgreError(error)
    }

    const textBlocks = data.texts ? (data.texts as TextBlockDto[]) : []

    return textBlocks.map(SupabaseTextBlockMapper.toEntity)
  }

  async updateMany(textBlocks: TextBlock[], starId: Id): Promise<void> {
    const { error } = await this.supabase
      .from('stars')
      .update({ texts: textBlocks.map(SupabaseTextBlockMapper.toSupabase) })
      .eq('id', starId.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async updateAudio(
    starId: Id,
    blockIndex: Integer,
    audio: TextBlockAudio,
  ): Promise<void> {
    const { error } = await this.supabase.rpc('update_text_block_audio', {
      p_star_id: starId.value,
      p_block_index: blockIndex.value,
      p_audio: audio.dto as Json,
    })

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }
}
