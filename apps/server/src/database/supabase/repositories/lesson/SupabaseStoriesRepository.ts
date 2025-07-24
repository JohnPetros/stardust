import { Text, type Id } from '@stardust/core/global/structures'
import type { StoriesRepository } from '@stardust/core/lesson/interfaces'

import { SupabaseRepository } from '../SupabaseRepository'
import { SupabasePostgreError } from '../../errors'

export class SupabaseStoriesRepository
  extends SupabaseRepository
  implements StoriesRepository
{
  async findByStar(starId: Id): Promise<Text | null> {
    const { data, error } = await this.supabase
      .from('stars')
      .select('story')
      .eq('id', starId.value)
      .single()

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return data.story ? Text.create(data.story) : null
  }

  async update(story: Text, starId: Id): Promise<void> {
    const { error } = await this.supabase
      .from('stars')
      .update({ story: story.value })
      .eq('id', starId.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }
}
