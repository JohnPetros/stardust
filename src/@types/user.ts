import type { WeekStatus } from './weekStatus'

export type User = {
  id: string
  email: string
  name: string
  slug: string
  level: number
  coins: number
  xp: number
  streak: number
  weekly_xp: number
  avatar_id: string
  created_at: string
  did_break_streak: boolean
  did_complete_saturday: boolean
  did_update_ranking: boolean
  is_admin: boolean
  is_loser: boolean | null
  last_position: number | null
  ranking_id: string
  rocket_id: string
  study_time: string
  week_status: WeekStatus[]
  unlocked_stars_count: number
  acquired_rockets_count: number
  unlocked_achievements_count: number
  completed_challenges_count: number
  completed_planets_count: number
}

export type WinnerUser = {
  id: string
  user_id: string
  position: number
} & Pick<User, 'name' | 'xp' | 'avatar_id' | 'ranking_id'>
