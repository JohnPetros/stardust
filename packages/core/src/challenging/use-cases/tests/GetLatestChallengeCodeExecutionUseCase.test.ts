import { mock, type Mock } from 'ts-jest-mocker'

import type { ChallengeCodeExecutionsRepository } from '#challenging/interfaces/index'
import { ChallengeCodeExecution } from '#challenging/domain/structures/index'
import { GetLatestChallengeCodeExecutionUseCase } from '../GetLatestChallengeCodeExecutionUseCase'

describe('GetLatestChallengeCodeExecutionUseCase', () => {
  let repository: Mock<ChallengeCodeExecutionsRepository>
  let useCase: GetLatestChallengeCodeExecutionUseCase

  beforeEach(() => {
    repository = mock<ChallengeCodeExecutionsRepository>()
    repository.findLatestByUserAndChallenge.mockImplementation()
    useCase = new GetLatestChallengeCodeExecutionUseCase(repository)
  })

  it('should return latest challenge code execution dto', async () => {
    const execution = ChallengeCodeExecution.create({
      code: 'escreva("ok")',
      status: 'accepted',
      testResults: [],
      outputs: [],
      error: null,
    })
    repository.findLatestByUserAndChallenge.mockResolvedValue(execution)

    const response = await useCase.execute({
      userId: '48a83fd2-83e9-48c8-96c3-760f328fdaca',
      challengeId: '44b16d4a-2be8-4d1a-a736-9491fe26dbb6',
    })

    expect(response).toEqual(execution.dto)
  })

  it('should return null when latest challenge code execution is not found', async () => {
    repository.findLatestByUserAndChallenge.mockResolvedValue(null)

    const response = await useCase.execute({
      userId: '48a83fd2-83e9-48c8-96c3-760f328fdaca',
      challengeId: '44b16d4a-2be8-4d1a-a736-9491fe26dbb6',
    })

    expect(response).toBeNull()
  })
})
