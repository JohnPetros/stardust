import { eq } from 'drizzle-orm'
import type { Id } from '@stardust/core/global/structures'
import type { Question } from '@stardust/core/lesson/abstracts'
import type { QuestionsRepository } from '@stardust/core/lesson/interfaces'
import { AuthError } from '@stardust/core/global/errors'
import { DrizzleRepository } from '../../DrizzleRepository'
import { DrizzleDatabaseError } from '../../errors'
import { starModel } from '../../models/space/star-model'
import { DrizzleQuestionMapper } from '../../mappers/lesson'

export class DrizzleQuestionsRepository
  extends DrizzleRepository
  implements QuestionsRepository
{
  async findAllByStar(starId: Id): Promise<Question[]> {
    return this.executeQuery(async () => {
      const row = await this.requirePayload(starId)
      return (row.questions ?? []).map(DrizzleQuestionMapper.toEntity)
    })
  }

  private authorizeWrite(): void {
    if (this.access.kind !== 'god' && this.access.kind !== 'system')
      throw new AuthError('Conta não autorizada')
  }

  private payloadQuery(starId: Id) {
    return this.database
      .select({ questions: starModel.questions })
      .from(starModel)
      .where(eq(starModel.id, starId.value))
      .limit(1)
  }

  private async requirePayload(starId: Id) {
    const [row] = await this.payloadQuery(starId)
    if (!row) throw new DrizzleDatabaseError()
    return row
  }

  async updateMany(questions: Question[], starId: Id): Promise<void> {
    this.authorizeWrite()
    return this.executeQuery(async () => {
      await this.database
        .update(starModel)
        .set({ questions: questions.map((question) => question.dto) })
        .where(eq(starModel.id, starId.value))
    })
  }
}
