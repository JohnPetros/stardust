import { User } from '@/@core/domain/entities'
import { ChallengeDifficulty } from '@/@core/domain/structs'
import type {
  ChallengeDifficultyLevel,
  CompletedChallengesCountByDifficultyLevel,
} from '@/@core/domain/types'
import type { UserDTO } from '@/@core/dtos'
import type { IUseCase } from '@/@core/interfaces/handlers'
import type { IChallengesService } from '@/@core/interfaces/services'

type Challenge = { id: string; difficulty: ChallengeDifficulty }

type Response = Promise<CompletedChallengesCountByDifficultyLevel>

export class CountCompletedChallengesByDifficultyLevelUseCase
  implements IUseCase<UserDTO, Response>
{
  constructor(private readonly challengesService: IChallengesService) {}

  async do(userDTO: UserDTO): Response {
    const user = User.create(userDTO)

    const response = await this.challengesService.fetchChallengesWithOnlyDifficulty()

    if (response.isFailure) {
      response.throwError()
    }

    const allChallenges = response.data.map((challenge) => ({
      id: challenge.id,
      difficulty: ChallengeDifficulty.create(challenge.difficulty),
    }))

    const easyChallenges = this.calculateCompletedChallengesCountByDifficulty(
      allChallenges,
      'easy',
      user
    )

    const mediumChallenges = this.calculateCompletedChallengesCountByDifficulty(
      allChallenges,
      'medium',
      user
    )

    const hardChallenges = this.calculateCompletedChallengesCountByDifficulty(
      allChallenges,
      'hard',
      user
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
    difficultyLevel: ChallengeDifficultyLevel
  ) {
    return challenges.filter(
      (challenge) => challenge.difficulty.level === difficultyLevel
    )
  }

  private filterChallengesByCompletitionState(challenges: Challenge[], user: User) {
    return challenges.filter((challenge) => user.hasCompletedChallenge(challenge.id))
  }

  private calculateCompletedChallengesCountByDifficulty(
    allChallenges: Challenge[],
    difficulty: ChallengeDifficultyLevel,
    user: User
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
    const percentage = (completedChallenges.length / challenges.length) * 100

    return {
      absolute,
      percentage: Number(percentage.toFixed(2)),
      total: challenges.length,
    }
  }
}
