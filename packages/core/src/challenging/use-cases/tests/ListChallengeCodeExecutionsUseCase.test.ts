import { mock, type Mock } from 'ts-jest-mocker'

import type { ChallengeCodeExecutionsRepository } from '#challenging/interfaces/index'
import { ChallengeCodeExecution } from '#challenging/domain/structures/index'
import { ListChallengeCodeExecutionsUseCase } from '../ListChallengeCodeExecutionsUseCase'

describe('ListChallengeCodeExecutionsUseCase', () => {
  let repository: Mock<ChallengeCodeExecutionsRepository>
  let useCase: ListChallengeCodeExecutionsUseCase

  beforeEach(() => {
    repository = mock<ChallengeCodeExecutionsRepository>()
    repository.findManyByUserAndChallenge.mockImplementation()
    useCase = new ListChallengeCodeExecutionsUseCase(repository)
  })

  it('should list paginated challenge code executions', async () => {
    const execution = ChallengeCodeExecution.create({
      code: 'escreva("ok")',
      status: 'accepted',
      testResults: [],
      outputs: [],
      error: null,
    })
    repository.findManyByUserAndChallenge.mockResolvedValue({
      items: [execution],
      count: 1,
    })

    const response = await useCase.execute({
      userId: '48a83fd2-83e9-48c8-96c3-760f328fdaca',
      challengeId: '44b16d4a-2be8-4d1a-a736-9491fe26dbb6',
      page: 2,
      itemsPerPage: 20,
    })

    expect(repository.findManyByUserAndChallenge).toHaveBeenCalledWith(
      expect.objectContaining({
        page: expect.objectContaining({ value: 2 }),
        itemsPerPage: expect.objectContaining({ value: 20 }),
      }),
    )
    expect(response.items).toEqual([execution.dto])
    expect(response.totalItemsCount).toBe(1)
    expect(response.page).toBe(2)
    expect(response.itemsPerPage).toBe(20)
  })
})
