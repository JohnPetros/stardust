import { User } from '../../global/domain/entities'
import type { UserDto } from '../../global/dtos'
import { ChallengeDifficulty } from '../domain/structs'
import type {
  ChallengeDifficultyLevel,
  CompletedChallengesCountByDifficultyLevel,
} from '../domain/types'
import type { IChallengingService, IUseCase } from '../../global/interfaces'
import { Percentage } from '../../global/domain/structs'

type Challenge = { id: string; difficulty: ChallengeDifficulty }

type Response = Promise<CompletedChallengesCountByDifficultyLevel>

export class CountCompletedChallengesByDifficultyLevelUseCase
  implements IUseCase<UserDto, Response>
{
  constructor(private readonly challengesService: IChallengingService) {}

  async do(userDto: UserDto) {
    const user = User.create(userDto)

    const response = await this.challengesService.fetchCompletableChallenges(user.id)

    if (response.isFailure) {
      response.throwError()
    }

    const allChallenges = response.body.map((challenge) => ({
      id: challenge.id,
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
