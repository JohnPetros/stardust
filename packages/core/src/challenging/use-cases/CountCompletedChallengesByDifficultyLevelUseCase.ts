import { Id, Percentage } from '#global/domain/structures/index'
import type { ChallengeDifficulty } from '../domain/structures'
import type { UseCase } from '#global/interfaces/index'
import type {
  ChallengeDifficultyLevel,
  CompletedChallengesCountByDifficultyLevel,
} from '../domain/types'
import type { ChallengesRepository } from '../interfaces'

type Challenge = { id: Id; difficulty: ChallengeDifficulty }

type Request = {
  userId: string
  userCompletedChallengesIds: string[]
}

type Response = Promise<CompletedChallengesCountByDifficultyLevel>

export class CountCompletedChallengesByDifficultyLevelUseCase
  implements UseCase<Request, Response>
{
  constructor(private readonly repository: ChallengesRepository) {}

  async execute({ userId, userCompletedChallengesIds }: Request) {
    const challenges = await this.repository.findAllByNotAuthor(Id.create(userId))

    const easyChallenges = this.calculateCompletedChallengesCountByDifficulty(
      challenges,
      'easy',
      userCompletedChallengesIds,
    )
    const mediumChallenges = this.calculateCompletedChallengesCountByDifficulty(
      challenges,
      'medium',
      userCompletedChallengesIds,
    )
    const hardChallenges = this.calculateCompletedChallengesCountByDifficulty(
      challenges,
      'hard',
      userCompletedChallengesIds,
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

  private filterChallengesByCompletitionState(
    challenges: Challenge[],
    userCompletedChallengesIds: string[],
  ) {
    return challenges.filter((challenge) =>
      userCompletedChallengesIds.includes(challenge.id.value),
    )
  }

  private calculateCompletedChallengesCountByDifficulty(
    allChallenges: Challenge[],
    difficulty: ChallengeDifficultyLevel,
    userCompletedChallengesIds: string[],
  ) {
    const challenges = this.filterChallengesByDifficultyLevel(allChallenges, difficulty)

    if (!challenges.length) {
      return {
        absolute: 0,
        percentage: 0,
        total: 0,
      }
    }

    const completedChallenges = this.filterChallengesByCompletitionState(
      challenges,
      userCompletedChallengesIds,
    )

    const absolute = completedChallenges.length
    const percentage = Percentage.create(completedChallenges.length, challenges.length)

    return {
      absolute,
      percentage: percentage.value,
      total: challenges.length,
    }
  }
}
