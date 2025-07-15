import type { Id } from '@stardust/core/global/structures'
import type { StoriesRepository } from '@stardust/core/lesson/interfaces'

import { SupabaseRepository } from '../SupabaseRepository'
import { SupabasePostgreError } from '../../errors'

export class SupabaseStoriesRepository
  extends SupabaseRepository
  implements StoriesRepository
{
  async findByStar(starId: Id): Promise<string | null> {
    const { data, error } = await this.supabase
      .from('stars')
      .select('story')
      .eq('id', starId.value)
      .single()

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return data.story ?? null
  }
}
