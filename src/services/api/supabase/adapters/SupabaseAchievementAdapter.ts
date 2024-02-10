import type { SupabaseAchievement } from '../types/SupabaseAchievement'

import type { Achievement, AchievementMetric } from '@/@types/Achievement'

export const SupabaseAchievementAdapter = (
  supabaseAchievement: SupabaseAchievement
) => {
  const achievement: Achievement = {
    id: supabaseAchievement.id,
    name: supabaseAchievement.name,
    icon: supabaseAchievement.icon,
    description: supabaseAchievement.description,
    position: supabaseAchievement.position ?? 1,
    reward: supabaseAchievement.reward,
    metric: supabaseAchievement.metric as AchievementMetric,
    requiredCount: Number(supabaseAchievement.required_count), // TODO: Fix null required_count
  }

  return achievement
}
