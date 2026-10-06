import { eq } from 'drizzle-orm'
import { Text, type Id } from '@stardust/core/global/structures'
import type { StoriesRepository } from '@stardust/core/lesson/interfaces'
import { AuthError } from '@stardust/core/global/errors'
import { DrizzleRepository } from '../../DrizzleRepository'
import { DrizzleDatabaseError } from '../../errors'
import { starModel } from '../../models/space/star-model'

export class DrizzleStoriesRepository
  extends DrizzleRepository
  implements StoriesRepository
{
  async findByStar(starId: Id): Promise<Text | null> {
    return this.executeQuery(async () => {
      const row = await this.requirePayload(starId)
      return row.story ? Text.create(row.story) : null
    })
  }

  private authorizeWrite(): void {
    if (this.access.kind !== 'god' && this.access.kind !== 'system')
      throw new AuthError('Conta não autorizada')
  }

  private payloadQuery(starId: Id) {
    return this.database
      .select({ story: starModel.story })
      .from(starModel)
      .where(eq(starModel.id, starId.value))
      .limit(1)
  }

  private async requirePayload(starId: Id) {
    const [row] = await this.payloadQuery(starId)
    if (!row) throw new DrizzleDatabaseError()
    return row
  }

  async update(story: Text, starId: Id): Promise<void> {
    this.authorizeWrite()
    return this.executeQuery(async () => {
      await this.database
        .update(starModel)
        .set({ story: story.value })
        .where(eq(starModel.id, starId.value))
    })
  }
}
