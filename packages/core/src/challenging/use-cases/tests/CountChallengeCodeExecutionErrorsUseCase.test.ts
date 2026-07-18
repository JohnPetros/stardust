import { mock, type Mock } from 'ts-jest-mocker'

import { Integer } from '#global/domain/structures/index'
import type { ChallengeCodeExecutionsRepository } from '#challenging/interfaces/index'
import { CountChallengeCodeExecutionErrorsUseCase } from '../CountChallengeCodeExecutionErrorsUseCase'

describe('CountChallengeCodeExecutionErrorsUseCase', () => {
  let repository: Mock<ChallengeCodeExecutionsRepository>
  let useCase: CountChallengeCodeExecutionErrorsUseCase

  beforeEach(() => {
    repository = mock<ChallengeCodeExecutionsRepository>()
    repository.countIncorrectByUserAndChallenge.mockImplementation()
    useCase = new CountChallengeCodeExecutionErrorsUseCase(repository)
  })

  it('should return challenge code execution errors count', async () => {
    repository.countIncorrectByUserAndChallenge.mockResolvedValue(Integer.create(3))

    const response = await useCase.execute({
      userId: '48a83fd2-83e9-48c8-96c3-760f328fdaca',
      challengeId: '44b16d4a-2be8-4d1a-a736-9491fe26dbb6',
    })

    expect(repository.countIncorrectByUserAndChallenge).toHaveBeenCalled()
    expect(response).toBe(3)
  })
})
