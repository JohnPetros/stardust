import { Id, Percentage } from '#global/domain/structures/index'
import { ChallengeDifficulty } from '../domain/structures'
import type { UserDto } from '#profile/domain/entities/dtos/index'
import type { UseCase } from '#global/interfaces/index'
import type {
  ChallengeDifficultyLevel,
  CompletedChallengesCountByDifficultyLevel,
} from '../domain/types'
import type { ChallengingService } from '../interfaces'
import { User } from '#profile/domain/entities/index'

type Challenge = { id: Id; difficulty: ChallengeDifficulty }

type Response = Promise<CompletedChallengesCountByDifficultyLevel>

export class CountCompletedChallengesByDifficultyLevelUseCase
  implements UseCase<UserDto, Response>
{
  constructor(private readonly challengesService: ChallengingService) {}

  async execute(userDto: UserDto) {
    const user = User.create(userDto)

    const response = await this.challengesService.fetchCompletableChallenges(user.id)

    if (response.isFailure) {
      response.throwError()
    }

    const allChallenges = response.body.map((challenge) => ({
      id: Id.create(challenge.id),
      difficulty: ChallengeDifficulty.create(challenge.difficulty),
    }))

    const easyChallenges = this.calculateCompletedChallengesCountByDifficulty(
      allChallenges,
      'easy',
      user,
    )
    const mediumChallenges = this.calculateCompletedChallengesCountByDifficulty(
      allChallenges,
      'medium',
      user,
    )
    const hardChallenges = this.calculateCompletedChallengesCountByDifficulty(
      allChallenges,
      'hard',
      user,
    )

    return {
      percentage: {
        easy: easyChallenges.percentage,
        medium: mediumChallenges.percentage,
        hard: hardChallenges.percentage,
      },
      absolute: {
        easy: easyChallenges.absolute,
        medium: mediumChallenges.absolute,
        hard: hardChallenges.absolute,
      },
      total: {
        easy: easyChallenges.total,
        medium: mediumChallenges.total,
        hard: hardChallenges.total,
      },
    }
  }

  private filterChallengesByDifficultyLevel(
    challenges: Challenge[],
    difficultyLevel: ChallengeDifficultyLevel,
  ) {
    return challenges.filter(
      (challenge) => challenge.difficulty.level === difficultyLevel,
    )
  }

  private filterChallengesByCompletitionState(challenges: Challenge[], user: User) {
    return challenges.filter(
      (challenge) => user.hasCompletedChallenge(challenge.id).isTrue,
    )
  }

  private calculateCompletedChallengesCountByDifficulty(
    allChallenges: Challenge[],
    difficulty: ChallengeDifficultyLevel,
    user: User,
  ) {
    const challenges = this.filterChallengesByDifficultyLevel(allChallenges, difficulty)

    if (!challenges.length) {
      return {
        absolute: 0,
        percentage: 0,
        total: 0,
      }
    }

    const completedChallenges = this.filterChallengesByCompletitionState(challenges, user)

    const absolute = completedChallenges.length
    const percentage = Percentage.create(completedChallenges.length, challenges.length)

    return {
      absolute,
      percentage: percentage.value,
      total: challenges.length,
    }
  }
}
