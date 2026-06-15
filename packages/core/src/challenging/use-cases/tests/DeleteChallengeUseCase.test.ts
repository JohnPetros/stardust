import { mock, type Mock } from 'ts-jest-mocker'

import type { ChallengesRepository } from '#challenging/interfaces/ChallengesRepository'
import { ChallengeNotFoundError } from '#challenging/domain/errors/ChallengeNotFoundError'
import { ChallengesFaker } from '#challenging/domain/entities/fakers/ChallengesFaker'
import { ChallengeDeletedEvent } from '#challenging/domain/events/ChallengeDeletedEvent'
import type { Broker } from '#global/interfaces/Broker'
import { DeleteChallengeUseCase } from '../DeleteChallengeUseCase'

describe('Delete challenge use case', () => {
  let broker: Mock<Broker>
  let repository: Mock<ChallengesRepository>
  let useCase: DeleteChallengeUseCase

  beforeEach(() => {
    broker = mock<Broker>()
    broker.publish.mockImplementation()
    repository = mock<ChallengesRepository>()
    repository.findById.mockImplementation()
    repository.remove.mockImplementation()

    useCase = new DeleteChallengeUseCase(repository, broker)
  })

  it('should throw an error if the challenge does not exist', async () => {
    await expect(useCase.execute({ challengeId: '' })).rejects.toThrow(
      ChallengeNotFoundError,
    )

    expect(repository.remove).not.toHaveBeenCalled()
    expect(broker.publish).not.toHaveBeenCalled()
  })

  it('should remove the challenge from the repository and publish deleted event', async () => {
    const challenge = ChallengesFaker.fake()
    repository.findById.mockResolvedValue(challenge)

    await useCase.execute({ challengeId: challenge.id.value })

    expect(repository.remove).toHaveBeenCalledWith(challenge)
    expect(broker.publish).toHaveBeenCalledWith(
      expect.objectContaining<ChallengeDeletedEvent>({
        name: ChallengeDeletedEvent._NAME,
        payload: {
          challengeId: challenge.id.value,
          challengeSlug: challenge.slug.value,
          challengeTitle: challenge.title.value,
          challengeAuthor: challenge.author.dto,
        },
      }),
    )
  })
})
