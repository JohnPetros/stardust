type MetricUser = {
  [key in string]: number
}

export type User = {
  acquired_rockets: number
  avatar_id: string
  coins: number
  completed_challenges: number
  completed_planets: number
  created_at: string
  did_break_streak: boolean
  did_complete_saturday: boolean
  did_update_ranking: boolean
  email: string
  id: string
  is_admin: boolean
  is_loser: boolean | null
  last_position: number | null
  level: number
  name: string
  ranking_id: string
  rocket_id: string
  streak: number
  study_time: string
  unlocked_achievements: number
  unlocked_stars: number
  week_status: string[]
  weekly_xp: number
  xp: number
} & MetricUser
