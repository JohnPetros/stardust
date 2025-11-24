import { mock, type Mock } from 'ts-jest-mocker'

import { ListChallengesUseCase } from '../ListChallengesUseCase'
import type { ChallengesRepository } from '#challenging/interfaces/ChallengesRepository'
import { ChallengesFaker } from '#challenging/domain/entities/fakers/ChallengesFaker'
import { AuthorsFakers } from '#global/domain/entities/fakers/AuthorsFakers'
import type { AuthorAggregateDto } from '#global/domain/aggregates/dtos/AuthorAggregateDto'
import { Id } from '#global/domain/structures/Id'

type ListChallengesUseCaseRequest = Parameters<ListChallengesUseCase['execute']>[0]

const createRequest = (
  override: Partial<ListChallengesUseCaseRequest> = {},
): ListChallengesUseCaseRequest => ({
  userCompletedChallengesIds: [],
  page: 1,
  itemsPerPage: 10,
  title: 'Search challenges',
  categoriesIds: [],
  difficulty: 'any',
  upvotesCountOrder: 'ascending',
  postingOrder: 'descending',
  completionStatus: 'any',
  ...override,
})

const createAuthorAggregate = (authorId: Id): AuthorAggregateDto => {
  const { id: _discardedId, ...authorEntity } = AuthorsFakers.fakeDto()
  return {
    id: authorId.value,
    entity: authorEntity,
  }
}

describe('List Challenges Use Case', () => {
  let repository: Mock<ChallengesRepository>
  let useCase: ListChallengesUseCase

  beforeEach(() => {
    repository = mock<ChallengesRepository>()
    repository.findMany.mockImplementation()

    useCase = new ListChallengesUseCase(repository)
  })

  it('should apply listing params and return the repository response as DTO pagination', async () => {
    const challenge = ChallengesFaker.fake({
      difficultyLevel: 'medium',
      isPublic: true,
    })
    const request = createRequest({
      userId: Id.create().value,
      categoriesIds: [Id.create().value, Id.create().value],
      completionStatus: 'completed',
      difficulty: 'medium',
      itemsPerPage: 5,
      page: 2,
      postingOrder: 'ascending',
      upvotesCountOrder: 'descending',
      userCompletedChallengesIds: [challenge.id.value],
      title: 'Recursion patterns',
    })
    repository.findMany.mockResolvedValue({
      challenges: [challenge],
      totalChallengesCount: 12,
    })

    const response = await useCase.execute(request)

    expect(repository.findMany).toHaveBeenCalledTimes(1)
    const [params] = repository.findMany.mock.calls[0]

    expect(params.categoriesIds.dto).toEqual(request.categoriesIds)
    expect(params.difficulty.level).toBe(request.difficulty)
    expect(params.title.value).toBe(request.title)
    expect(params.upvotesCountOrder.value).toBe(request.upvotesCountOrder)
    expect(params.postingOrder.value).toBe(request.postingOrder)
    expect(params.completionStatus.value).toBe(request.completionStatus)
    expect(params.userId?.value).toBe(request.userId)
    expect(params.page.value).toBe(request.page)
    expect(params.itemsPerPage.value).toBe(request.itemsPerPage)

    expect(response.items).toEqual([challenge.dto])
    expect(response.totalItemsCount).toBe(12)
  })

  it('should filter only completed challenges for the logged user', async () => {
    const userId = Id.create()
    const ownChallenge = ChallengesFaker.fake({
      difficultyLevel: 'easy',
      author: createAuthorAggregate(userId),
    })
    const publicCompletedChallenge = ChallengesFaker.fake({
      difficultyLevel: 'medium',
      isPublic: true,
      author: createAuthorAggregate(Id.create()),
    })
    const privateCompletedChallenge = ChallengesFaker.fake({
      difficultyLevel: 'hard',
      isPublic: false,
      author: createAuthorAggregate(Id.create()),
    })
    const notCompletedChallenge = ChallengesFaker.fake({
      difficultyLevel: 'hard',
      isPublic: true,
      author: createAuthorAggregate(Id.create()),
    })

    repository.findMany.mockResolvedValue({
      challenges: [
        publicCompletedChallenge,
        ownChallenge,
        privateCompletedChallenge,
        notCompletedChallenge,
      ],
      totalChallengesCount: 4,
    })

    const response = await useCase.execute(
      createRequest({
        completionStatus: 'completed',
        userId: userId.value,
        userCompletedChallengesIds: [
          ownChallenge.id.value,
          publicCompletedChallenge.id.value,
          privateCompletedChallenge.id.value,
        ],
      }),
    )

    expect(response.items).toEqual([ownChallenge.dto, publicCompletedChallenge.dto])
  })

  it('should order the retrieved challenges by difficulty level', async () => {
    const easyChallenge = ChallengesFaker.fake({ difficultyLevel: 'easy' })
    const mediumChallenge = ChallengesFaker.fake({ difficultyLevel: 'medium' })
    const hardChallenge = ChallengesFaker.fake({ difficultyLevel: 'hard' })

    repository.findMany.mockResolvedValue({
      challenges: [hardChallenge, easyChallenge, mediumChallenge],
      totalChallengesCount: 3,
    })

    const response = await useCase.execute(createRequest())

    expect(response.items).toEqual([
      easyChallenge.dto,
      mediumChallenge.dto,
      hardChallenge.dto,
    ])
    expect(response.totalItemsCount).toBe(3)
  })
})
