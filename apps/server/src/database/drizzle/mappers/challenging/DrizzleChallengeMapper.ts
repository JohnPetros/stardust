import { Challenge } from '@stardust/core/challenging/entities'
import type { TestCaseDto } from '@stardust/core/challenging/entities/dtos'
import type { CodePlaybackDto } from '@stardust/core/global/structures/dtos'
import type {
  DrizzleChallenge,
  DrizzleInsertChallenge,
} from '../../types/entities/challenging'

export class DrizzleChallengeMapper {
  static toEntity(row: DrizzleChallenge): Challenge {
    return Challenge.create({
      ...DrizzleChallengeMapper.exercisePublication(row),
      ...DrizzleChallengeMapper.evaluation(row),
      ...DrizzleChallengeMapper.engagement(row),
      author: DrizzleChallengeMapper.author(row),
    })
  }
  private static exercisePublication(row: DrizzleChallenge) {
    return {
      id: row.id,
      ...DrizzleChallengeMapper.content(row),
      ...DrizzleChallengeMapper.publication(row),
      ...DrizzleChallengeMapper.exercise(row),
    }
  }
  static toPersistence(challenge: Challenge): DrizzleInsertChallenge {
    return {
      id: challenge.id.value,
      ...persistenceContent(challenge),
      ...persistencePublication(challenge),
      ...persistenceEvaluation(challenge),
      createdAt: challenge.postedAt,
    }
  }
  private static author(row: DrizzleChallenge): Challenge['dto']['author'] {
    return {
      id: row.authorId ?? row.userId,
      entity: DrizzleChallengeMapper.authorProfile(row),
    }
  }
  private static authorProfile(row: DrizzleChallenge) {
    return {
      name: row.authorName ?? '',
      slug: row.authorSlug ?? '',
      avatar: { name: row.authorAvatarName ?? '', image: row.authorAvatarImage ?? '' },
    }
  }
  private static publication(row: DrizzleChallenge) {
    return {
      slug: row.slug,
      starId: row.starId,
      postedAt: row.createdAt,
      isPublic: row.isPublic,
      isNew: row.isNew,
    }
  }
  private static exercise(row: DrizzleChallenge) {
    return {
      initialCode: row.initialCode,
      difficultyLevel: row.difficultyLevel,
      categories: row.categories,
    }
  }
  private static evaluation({
    testCases,
    isEvaluatedByFunction,
    officialSolution,
  }: DrizzleChallenge) {
    const parsedTestCases =
      typeof testCases === 'string' ? JSON.parse(testCases) : testCases
    return {
      isEvaluatedByFunction,
      officialSolution: officialSolution as CodePlaybackDto | null,
      testCases: parsedTestCases as TestCaseDto[],
    }
  }
  private static engagement(row: DrizzleChallenge) {
    return {
      upvotesCount: row.upvotesCount,
      downvotesCount: row.downvotesCount,
      completionCount: row.totalCompletitions,
    }
  }

  private static content(
    row: DrizzleChallenge,
  ): Pick<Challenge['dto'], 'title' | 'description'> {
    return { title: row.title, description: row.description ?? '' }
  }
}

function persistencePublication(challenge: Challenge) {
  const dto = challenge.dto
  return {
    slug: challenge.slug.value,
    userId: dto.author.id,
    ...publicationState(dto),
  }
}
function publicationState(dto: Challenge['dto']) {
  return {
    starId: dto.starId ?? null,
    isPublic: dto.isPublic,
    isNew: dto.isNew,
  }
}
function persistenceEvaluation(challenge: Challenge) {
  const dto = challenge.dto
  return {
    difficultyLevel: dto.difficultyLevel,
    isEvaluatedByFunction: dto.isEvaluatedByFunction,
    testCases: dto.testCases,
    officialSolution: dto.officialSolution ?? null,
  }
}
function persistenceContent(
  challenge: Challenge,
): Pick<DrizzleInsertChallenge, 'title' | 'initialCode' | 'description'> {
  const { title, initialCode, description } = challenge.dto
  return { title, initialCode, description }
}
