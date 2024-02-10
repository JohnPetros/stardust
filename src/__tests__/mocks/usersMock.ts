import type { User } from '@/@types/User'

export const usersMock: User[] = [
  {
    id: '1fc15031-1003-4c6c-aa5a-e51b02fc75f5',
    email: 'usuario@exemplo.com',
    name: 'Usuário Exemplo',
    slug: 'john-petros',
    level: 10,
    coins: 1000,
    xp: 5000,
    weeklyXp: 200,
    avatarId: 'avatar mock',
    acquiredRocketsCount: 3,
    completedChallengesCount: 50,
    completedPlanetsCount: 8,
    unlockedAchievementsCount: 20,
    unlockedStarsCount: 5,
    createdAt: '2023-10-27T12:00:00Z',
    didBreakStreak: false,
    didCompleteSaturday: true,
    didUpdateRanking: false,
    isLoser: null,
    lastPosition: null,
    rankingId: 'rank1',
    rocketId: 'rocket1',
    streak: 15,
    studyTime: '5 hours',
    weekStatus: ['done', 'done', 'todo'],
  },
  // Add more users as needed
]
