import type { RankersRepository } from '@stardust/core/ranking/interfaces'
import type { Id } from '@stardust/core/global/structures'
import { RankingUser } from '@stardust/core/ranking/entities'

import { SupabaseRepository } from '../SupabaseRepository'
import { SupabasePostgreError } from '../../errors'

export class SupabaseRankersRepository
  extends SupabaseRepository
  implements RankersRepository
{
  async findAllByTier(tierId: Id): Promise<RankingUser[]> {
    const { data, error } = await this.supabase
      .from('users')
      .select(
        `id,
        name,
        slug,
        tier_id,
        xp:weekly_xp,
        last_week_ranking_position,
        avatar:avatars(name, image)`,
      )
      .eq('tier_id', tierId.value)
      .not('last_week_ranking_position', 'is', null)
      .order('last_week_ranking_position', { ascending: false })

    if (error) throw new SupabasePostgreError(error)

    const rankers = data.map((user, index) =>
      RankingUser.create({
        id: user.id,
        name: user.name ?? '',
        slug: user.slug ?? '',
        avatar: {
          image: user.avatar?.image ?? '',
          name: user.avatar?.name ?? '',
        },
        tierId: user.tier_id ?? '',
        xp: user.xp,
        position: user.last_week_ranking_position ?? index,
      }),
    )

    return rankers
  }

  async findAllByTierOrderedByXp(tierId: Id): Promise<RankingUser[]> {
    const { data, error } = await this.supabase
      .from('users')
      .select('id, name, slug, tier_id, xp:weekly_xp, avatar:avatars(name, image)')
      .eq('tier_id', tierId.value)
      .order('weekly_xp', { ascending: false })

    if (error) {
      throw new SupabasePostgreError(error)
    }

    const rankers = data.map((ranker, index) =>
      RankingUser.create({
        id: ranker.id,
        name: ranker.name ?? '',
        slug: ranker.slug ?? '',
        avatar: {
          image: ranker.avatar?.image ?? '',
          name: ranker.avatar?.name ?? '',
        },
        tierId: ranker.tier_id ?? '',
        xp: ranker.xp,
        position: index + 1,
      }),
    )

    return rankers
  }

  async addWinners(rankers: RankingUser[], tierId: Id): Promise<void> {
    const { error } = await this.supabase.from('ranking_users').insert(
      // @ts-ignore
      rankers.map((winner) => ({
        id: winner.id.value,
        xp: winner.xp.value,
        tier_id: tierId.value,
        status: 'winner',
        position: winner.rankingPosition.position.value,
      })),
    )

    if (error) throw new SupabasePostgreError(error)
  }

  async addLosers(rankers: RankingUser[], tierId: Id): Promise<void> {
    const { error } = await this.supabase.from('ranking_users').insert(
      // @ts-ignore
      rankers.map((loser) => ({
        id: loser.id.value,
        xp: loser.xp.value,
        tier_id: tierId.value,
        status: 'loser',
        position: loser.rankingPosition.position.value,
      })),
    )

    if (error) throw new SupabasePostgreError(error)
  }

  async removeAll(): Promise<void> {
    const { error } = await this.supabase.from('ranking_users').delete()

    if (error) throw new SupabasePostgreError(error)
  }
}
