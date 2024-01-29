import type { User } from '@/@types/user'

export const usersMock: User[] = [
  {
    id: '1fc15031-1003-4c6c-aa5a-e51b02fc75f5',
    email: 'usuario@exemplo.com',
    name: 'Usuário Exemplo',
    slug: 'john-petros',
    level: 10,
    coins: 1000,
    xp: 5000,
    weekly_xp: 200,
    avatar_id: 'avatar mock',
    acquired_rockets_count: 3,
    completed_challenges_count: 50,
    completed_planets_count: 8,
    unlocked_achievements_count: 20,
    unlocked_stars_count: 5,
    created_at: '2023-10-27T12:00:00Z',
    did_break_streak: false,
    did_complete_saturday: true,
    did_update_ranking: false,
    is_admin: false,
    is_loser: null,
    last_position: null,
    ranking_id: 'rank1',
    rocket_id: 'rocket1',
    streak: 15,
    study_time: '5 hours',
    week_status: ['done', 'done', 'todo'],
  },
  // Add more users as needed
]
