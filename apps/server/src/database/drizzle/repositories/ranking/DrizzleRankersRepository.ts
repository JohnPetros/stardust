import { and, desc, eq, isNotNull } from 'drizzle-orm'
import type { RankingUser } from '@stardust/core/ranking/entities'
import type { RankersRepository } from '@stardust/core/ranking/interfaces'
import type { Id } from '@stardust/core/global/structures'
import { AuthError } from '@stardust/core/global/errors'
import { DrizzleRepository } from '../../DrizzleRepository'
import { userModel } from '../../models/profile/user-model'
import { avatarModel } from '../../models/shop/avatar-model'
import { rankingUserModel } from '../../models/ranking/ranking-user-model'
import { DrizzleRankerMapper } from '../../mappers/ranking/DrizzleRankerMapper'
import type { DrizzleInsertRankingUser } from '../../types/entities/ranking'

export class DrizzleRankersRepository
  extends DrizzleRepository
  implements RankersRepository
{
  private authorizeWrite(): void {
    if (this.access.kind !== 'god' && this.access.kind !== 'system')
      throw new AuthError('Conta não autorizada')
  }

  private rankersSelection() {
    return this.database
      .select(this.rankersColumns())
      .from(userModel)
      .leftJoin(avatarModel, eq(avatarModel.id, userModel.avatarId))
      .$dynamic()
  }

  private rankersColumns() {
    return { ...this.profileColumns(), ...this.rankingColumns() }
  }

  private profileColumns() {
    return {
      id: userModel.id,
      name: userModel.name,
      slug: userModel.slug,
      avatar: { name: avatarModel.name, image: avatarModel.image },
    }
  }

  private rankingColumns() {
    return {
      xp: userModel.weeklyXp,
      tierId: userModel.tierId,
      position: userModel.lastWeekRankingPosition,
    }
  }

  private rankersCriteria(tierId: Id, previous: boolean) {
    return and(
      eq(userModel.tierId, tierId.value),
      previous ? isNotNull(userModel.lastWeekRankingPosition) : undefined,
    )
  }

  private rankersQuery(tierId: Id, previous: boolean) {
    return this.rankersSelection()
      .where(this.rankersCriteria(tierId, previous))
      .orderBy(desc(previous ? userModel.lastWeekRankingPosition : userModel.weeklyXp))
  }

  private mapRanker(
    row: Awaited<ReturnType<DrizzleRankersRepository['rankersQuery']>>[number],
    index: number,
    tierId: Id,
    previous: boolean,
  ): RankingUser {
    return DrizzleRankerMapper.toEntity({
      ...this.rankingProjection(row, index, tierId, previous),
      user: this.userProjection(row),
    })
  }

  private rankingProjection(
    row: Awaited<ReturnType<DrizzleRankersRepository['rankersSelection']>>[number],
    index: number,
    tierId: Id,
    previous: boolean,
  ) {
    return {
      id: row.id,
      xp: row.xp,
      tierId: tierId.value,
      position: previous ? (row.position ?? index) : index + 1,
    }
  }

  private userProjection(
    row: Awaited<ReturnType<DrizzleRankersRepository['rankersSelection']>>[number],
  ) {
    return { name: row.name, slug: row.slug, avatar: row.avatar }
  }

  private findRankers(tierId: Id, previous: boolean): Promise<RankingUser[]> {
    return this.executeQuery(async () => {
      const rows = await this.rankersQuery(tierId, previous)
      return rows.map((row, index) => this.mapRanker(row, index, tierId, previous))
    })
  }

  async findAllByTier(tierId: Id): Promise<RankingUser[]> {
    return this.findRankers(tierId, true)
  }

  async findAllByTierOrderedByXp(tierId: Id): Promise<RankingUser[]> {
    return this.findRankers(tierId, false)
  }

  private async addRankers(
    rankers: RankingUser[],
    tierId: Id,
    status: DrizzleInsertRankingUser['status'],
  ): Promise<void> {
    this.authorizeWrite()
    if (!rankers.length) return
    const rows = rankers.map((ranker) => this.rankerRow(ranker, tierId, status))
    await this.executeQuery(async () => {
      await this.database.insert(rankingUserModel).values(rows)
    })
  }

  private rankerRow(
    ranker: RankingUser,
    tierId: Id,
    status: DrizzleInsertRankingUser['status'],
  ): DrizzleInsertRankingUser {
    return {
      id: ranker.id.value,
      xp: ranker.xp.value,
      tierId: tierId.value,
      status,
      position: ranker.rankingPosition.position.value,
    }
  }

  async addWinners(rankingWinners: RankingUser[], tierId: Id): Promise<void> {
    await this.addRankers(rankingWinners, tierId, 'winner')
  }

  async addLosers(rankingLosers: RankingUser[], tierId: Id): Promise<void> {
    await this.addRankers(rankingLosers, tierId, 'loser')
  }

  async removeAll(): Promise<void> {
    this.authorizeWrite()
    await this.executeQuery(async () => {
      await this.database.delete(rankingUserModel)
    })
  }
}
