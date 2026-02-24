import { mock, type Mock } from 'ts-jest-mocker'

import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import { ChallengesFaker } from '@stardust/core/challenging/entities/fakers'
import { ChallengeNotFoundError } from '@stardust/core/challenging/errors'
import type { Http } from '@stardust/core/global/interfaces'
import { IdFaker } from '@stardust/core/global/structures/fakers'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'

import { VerifyChallengeManagementPermissionController } from '../VerifyChallengeManagementPermissionController'

describe('Verify Challenge Management Permission Controller', () => {
  let http: Mock<Http<{ routeParams: { challengeId: string } }>>
  let challengesRepository: Mock<ChallengesRepository>
  let usersRepository: Mock<UsersRepository>
  let controller: VerifyChallengeManagementPermissionController

  beforeEach(() => {
    http = mock()
    challengesRepository = mock()
    usersRepository = mock()

    http.pass.mockImplementation()

    controller = new VerifyChallengeManagementPermissionController(
      challengesRepository,
      usersRepository,
    )
  })

  it('should pass when user is challenge author', async () => {
    const challengeId = IdFaker.fake().value
    const authorId = IdFaker.fake().value

    http.getRouteParams.mockReturnValue({ challengeId })
    http.getAccount.mockResolvedValue({ id: authorId } as never)

    challengesRepository.findById.mockResolvedValue(
      ChallengesFaker.fake({
        id: challengeId,
        author: {
          id: authorId,
        },
      }),
    )
    usersRepository.findById.mockResolvedValue(
      UsersFaker.fake({
        id: authorId,
        insigniaRoles: [],
      }),
    )

    await controller.handle(http)

    expect(http.pass).toHaveBeenCalled()
  })

  it('should pass when user is god and not challenge author', async () => {
    const challengeId = IdFaker.fake().value
    const authorId = IdFaker.fake().value
    const godId = IdFaker.fake().value

    http.getRouteParams.mockReturnValue({ challengeId })
    http.getAccount.mockResolvedValue({ id: godId } as never)

    challengesRepository.findById.mockResolvedValue(
      ChallengesFaker.fake({
        id: challengeId,
        author: {
          id: authorId,
        },
      }),
    )
    usersRepository.findById.mockResolvedValue(
      UsersFaker.fake({
        id: godId,
        insigniaRoles: ['god'],
      }),
    )

    await controller.handle(http)

    expect(http.pass).toHaveBeenCalled()
  })

  it('should throw challenge not found when user is not authorized', async () => {
    const challengeId = IdFaker.fake().value
    const authorId = IdFaker.fake().value
    const userId = IdFaker.fake().value

    http.getRouteParams.mockReturnValue({ challengeId })
    http.getAccount.mockResolvedValue({ id: userId } as never)

    challengesRepository.findById.mockResolvedValue(
      ChallengesFaker.fake({
        id: challengeId,
        author: {
          id: authorId,
        },
      }),
    )
    usersRepository.findById.mockResolvedValue(
      UsersFaker.fake({
        id: userId,
        insigniaRoles: [],
      }),
    )

    await expect(controller.handle(http)).rejects.toThrow(ChallengeNotFoundError)
    expect(http.pass).not.toHaveBeenCalled()
  })
})
