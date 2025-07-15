import type { Id } from '@stardust/core/global/structures'
import type { QuestionsRepository } from '@stardust/core/lesson/interfaces'
import type { QuestionDto } from '@stardust/core/lesson/entities/dtos'
import type { Question } from '@stardust/core/lesson/abstracts'

import { SupabaseRepository } from '../SupabaseRepository'
import { SupabasePostgreError } from '../../errors'
import { SupabaseQuestionMapper } from '../../mappers/lesson'

export class SupabaseQuestionsRepository
  extends SupabaseRepository
  implements QuestionsRepository
{
  async findAllByStar(starId: Id): Promise<Question[]> {
    const { data, error } = await this.supabase
      .from('stars')
      .select('questions')
      .eq('id', starId.value)
      .single()

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return (data.questions as QuestionDto[]).map(SupabaseQuestionMapper.toEntity)
  }
}
