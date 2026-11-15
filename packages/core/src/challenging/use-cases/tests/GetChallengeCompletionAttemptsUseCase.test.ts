import { mock, type Mock } from 'ts-jest-mocker'

import { NotAllowedError } from '#global/domain/errors/index'
import { Integer } from '#global/domain/structures/index'
import { ChallengeNotFoundError } from '#challenging/domain/errors/index'
import { ChallengesFaker } from '#challenging/domain/entities/fakers/index'
import { ChallengeCodeExecution } from '#challenging/domain/structures/index'
import type {
  ChallengeCodeExecutionsRepository,
  ChallengesRepository,
} from '#challenging/interfaces/index'
import { GetChallengeCompletionAttemptsUseCase } from '../GetChallengeCompletionAttemptsUseCase'

describe('GetChallengeCompletionAttemptsUseCase', () => {
  const request = {
    userId: '48a83fd2-83e9-48c8-96c3-760f328fdaca',
    challengeId: '44b16d4a-2be8-4d1a-a736-9491fe26dbb6',
  }

  let challengesRepository: Mock<ChallengesRepository>
  let executionsRepository: Mock<ChallengeCodeExecutionsRepository>
  let useCase: GetChallengeCompletionAttemptsUseCase

  const execution = (status: 'accepted' | 'wrong_answer') =>
    ChallengeCodeExecution.create({
      code: 'escreva("ok")',
      status,
      testResults: [],
      outputs: [],
      error: null,
    })

  beforeEach(() => {
    challengesRepository = mock<ChallengesRepository>()
    executionsRepository = mock<ChallengeCodeExecutionsRepository>()
    executionsRepository.countIncorrectByUserAndChallenge.mockResolvedValue(
      Integer.create(2),
    )
    useCase = new GetChallengeCompletionAttemptsUseCase(
      challengesRepository,
      executionsRepository,
    )
  })

  it('should return the attempt counts when the latest execution is accepted', async () => {
    const challenge = ChallengesFaker.fake({ id: request.challengeId })
    challengesRepository.findById.mockResolvedValue(challenge)
    executionsRepository.findLatestByUserAndChallenge.mockResolvedValue(
      execution('accepted'),
    )

    const response = await useCase.execute(request)

    expect(response).toEqual({
      maximumIncorrectAnswersCount: challenge.maximumIncorrectAnswersCount.value,
      incorrectAnswersCount: 2,
    })
  })

  it('should throw ChallengeNotFoundError when the challenge does not exist', async () => {
    challengesRepository.findById.mockResolvedValue(null)
    executionsRepository.findLatestByUserAndChallenge.mockResolvedValue(
      execution('accepted'),
    )

    await expect(useCase.execute(request)).rejects.toThrow(ChallengeNotFoundError)
  })

  it('should throw NotAllowedError when the latest execution is not accepted', async () => {
    challengesRepository.findById.mockResolvedValue(
      ChallengesFaker.fake({ id: request.challengeId }),
    )
    executionsRepository.findLatestByUserAndChallenge.mockResolvedValue(
      execution('wrong_answer'),
    )

    await expect(useCase.execute(request)).rejects.toThrow(NotAllowedError)
  })

  it('should throw NotAllowedError when the user never executed the challenge', async () => {
    challengesRepository.findById.mockResolvedValue(
      ChallengesFaker.fake({ id: request.challengeId }),
    )
    executionsRepository.findLatestByUserAndChallenge.mockResolvedValue(null)

    await expect(useCase.execute(request)).rejects.toThrow(NotAllowedError)
  })
})
