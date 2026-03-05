import { mock, type Mock } from 'ts-jest-mocker'

import { ListChallengeSourcesUseCase } from '../ListChallengeSourcesUseCase'
import type { ChallengeSourcesRepository } from '#challenging/interfaces/ChallengeSourcesRepository'
import { ChallengeSourcesFaker } from '#challenging/domain/entities/fakers/ChallengeSourcesFaker'

describe('List Challenge Sources Use Case', () => {
  let useCase: ListChallengeSourcesUseCase
  let repository: Mock<ChallengeSourcesRepository>

  beforeEach(() => {
    repository = mock<ChallengeSourcesRepository>()
    repository.findMany.mockImplementation()

    useCase = new ListChallengeSourcesUseCase(repository)
  })

  it('should list challenge sources using transformed params and return pagination response', async () => {
    const challengeSources = [
      ChallengeSourcesFaker.fake(),
      ChallengeSourcesFaker.fake(),
      ChallengeSourcesFaker.fake(),
    ]
    repository.findMany.mockResolvedValue({
      items: challengeSources,
      count: 23,
    })

    const response = await useCase.execute({
      page: 2,
      itemsPerPage: 3,
      title: 'source',
    })

    expect(repository.findMany).toHaveBeenCalledTimes(1)
    const [params] = repository.findMany.mock.calls[0]
    expect(params.page.value).toBe(2)
    expect(params.itemsPerPage.value).toBe(3)
    expect(params.title.value).toBe('source')
    expect(params.positionOrder.value).toBe('ascending')

    expect(response.items).toEqual(
      challengeSources.map((challengeSource) => challengeSource.dto),
    )
    expect(response.totalItemsCount).toBe(23)
    expect(response.itemsPerPage).toBe(3)
    expect(response.totalPagesCount).toBe(8)
  })
})
