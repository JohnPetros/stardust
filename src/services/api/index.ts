import { AchievementService } from './achievementService'
import { AuthService } from './authService'
import { AvatarService } from './avatarService'
import { CategoryService } from './categoryService'
import { ChallengeService } from './challengeService'
import { PlanetService } from './planetService'
import { RankingService } from './rankingService'
import { RocketService } from './rocketService'
import { StarService } from './starService'
import { UserService } from './userService'

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
