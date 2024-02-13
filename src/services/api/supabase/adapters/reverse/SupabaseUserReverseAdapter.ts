import { SupabaseUser } from '../../types/SupabaseUser'

import { User } from '@/@types/User'

export const SupabaseUserReverseAdapter = (
  user: Partial<User>
): Partial<SupabaseUser> => {
  const userProps = Object.keys(user) as Partial<keyof User>[]

  return userProps.reduce((supabaseUser, userProp) => {
    switch (userProp) {
      case 'id':
        return { ...supabaseUser, id: user.id }
      case 'email':
        return { ...supabaseUser, email: user.email }
      case 'slug':
        return { ...supabaseUser, slug: user.slug }
      case 'level':
        return { ...supabaseUser, level: user.level }
      case 'name':
        return { ...supabaseUser, name: user.name }
      case 'xp':
        return { ...supabaseUser, xp: user.xp }
      case 'streak':
        return { ...supabaseUser, streak: user.streak }
      case 'coins':
        return { ...supabaseUser, coins: user.coins }
      case 'avatarId':
        return { ...supabaseUser, avatar_id: user.avatarId }
      case 'rankingId':
        return {
          ...supabaseUser,
          ranking_id: user.rankingId,
        }
      case 'weekStatus':
        return {
          ...supabaseUser,
          week_status: user.weekStatus,
        }
      case 'weeklyXp':
        return {
          ...supabaseUser,
          weekly_xp: user.weeklyXp,
        }
      case 'didBreakStreak':
        return { ...supabaseUser, did_break_streak: user.didBreakStreak }
      case 'didCompleteSaturday':
        return {
          ...supabaseUser,
          did_complete_saturday: user.didCompleteSaturday,
        }
      case 'didUpdateRanking':
        return {
          ...supabaseUser,
          did_update_ranking: user.didUpdateRanking,
        }
      case 'isLoser':
        return {
          ...supabaseUser,
          is_loser: user.isLoser,
        }
      case 'lastPosition':
        return {
          ...supabaseUser,
          last_position: user.lastPosition,
        }
      case 'studyTime':
        return {
          ...supabaseUser,
          study_time: user.studyTime,
        }
      default:
        return supabaseUser
    }
  }, {} as Partial<SupabaseUser>)
}
