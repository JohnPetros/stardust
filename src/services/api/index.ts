import { AchievementService } from './achievement'
import { AuthService } from './auth'
import { AvatarService } from './avatar'
import { CategoryService } from './category'
import { ChallengeService } from './challenge'
import { PlanetService } from './planet'
import { RankingService } from './ranking'
import { RocketService } from './rocket'
import { StarService } from './star'
import { UserService } from './user'

export function useApi() {
  return {
    ...AuthService(),
    ...UserService(),
    ...AchievementService(),
    ...StarService(),
    ...PlanetService(),
    ...AvatarService(),
    ...RocketService(),
    ...RankingService(),
    ...CategoryService(),
    ...ChallengeService(),
  }
}
