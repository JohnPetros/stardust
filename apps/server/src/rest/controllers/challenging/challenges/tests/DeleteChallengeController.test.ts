import type { Database } from '@stardust/core/global/interfaces'
import { mock, type Mock } from 'ts-jest-mocker'

import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import { DeleteChallengeUseCase } from '@stardust/core/challenging/use-cases'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'

import { DeleteChallengeController } from '../DeleteChallengeController'

describe('Delete Challenge Controller', () => {
  const database = mock<Database>()
  let http: Mock<Http<{ routeParams: { challengeId: string } }>>
  let repository: Mock<ChallengesRepository>
  let controller: DeleteChallengeController

  beforeEach(() => {
    database.run.mockClear()
    database.run.mockImplementation(async (operation) => operation())
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new DeleteChallengeController(repository, database)
  })

  it('should delete challenge and return no content', async () => {
    const challengeId = IdFaker.fake().value
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ challengeId })
    http.statusNoContent.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(DeleteChallengeUseCase.prototype, 'execute')
      .mockResolvedValue(undefined)

    const response = await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({ challengeId })
    expect(http.statusNoContent).toHaveBeenCalled()
    expect(http.send).toHaveBeenCalled()
    expect(response).toBe(restResponse)
  })
})
