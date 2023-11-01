import { Achievement } from '@/@types/achievement'

export const achievementsMock: Achievement[] = [
  {
    id: '1',
    name: 'Explorer',
    icon: 'explorer-icon.png',
    description: 'Explore 10 planetas diferentes',
    reward: 100,
    required_amount: 10,
    position: 1,
    isUnlocked: true,
    isRescuable: false,
    currentProgress: 10,
    metric: 'completed_planets',
  },
  {
    id: '2',
    name: 'Rocketeer',
    icon: 'rocketeer-icon.png',
    description: 'Adquira 5 foguetes diferentes',
    reward: 200,
    required_amount: 5,
    position: 2,
    isUnlocked: false,
    isRescuable: true,
    currentProgress: 3,
    metric: 'acquired_rockets',
  },
  {
    id: '3',
    name: 'Stellar Cartographer',
    icon: 'cartographer-icon.png',
    description: 'Mapeie 50 estrelas em um único mês',
    reward: 300,
    required_amount: 50,
    position: 3,
    isUnlocked: false,
    isRescuable: true,
    metric: 'unlocked_stars',
    currentProgress: 20,
  },
  // Add more achievements as needed
]
