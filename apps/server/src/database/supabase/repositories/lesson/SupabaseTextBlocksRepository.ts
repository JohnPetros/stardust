import type { Id, TextBlock } from '@stardust/core/global/structures'
import type { TextBlocksRepository } from '@stardust/core/lesson/interfaces'
import type { TextBlockDto } from '@stardust/core/global/entities/dtos'

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
}
