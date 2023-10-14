export type User = {
  id: string
  email: string
  name: string
  level: number
  coins: number
  xp: number
  weekly_xp: number
  avatar_id: string
  acquired_rockets: number
  completed_challenges: number
  completed_planets: number
  created_at: string
  did_break_streak: boolean
  did_complete_saturday: boolean
  did_update_ranking: boolean
  is_admin: boolean
  is_loser: boolean | null
  last_position: number | null
  ranking_id: string
  rocket_id: string
  streak: number
  study_time: string
  unlocked_achievements: number
  unlocked_stars: number
  week_status: string[]
}

export type WinnerUser = {
  id: string
  user_id: string
  name: string
  position: number
  xp: number
  avatar_id: string
  ranking_id: string
}
