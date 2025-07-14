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

    return (data.texts as TextBlockDto[]).map(SupabaseTextBlockMapper.toEntity)
  }
}
