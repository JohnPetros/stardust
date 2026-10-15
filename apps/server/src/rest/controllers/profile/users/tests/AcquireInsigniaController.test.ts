import type { Database } from '@stardust/core/global/interfaces'
import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { IdFaker } from '@stardust/core/global/structures/fakers'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { AcquireInsigniaUseCase } from '@stardust/core/profile/use-cases'

import { AcquireInsigniaController } from '../AcquireInsigniaController'

describe('Acquire Insignia Controller', () => {
  const database = mock<Database>()
  let http: Mock<
    Http<{
      body: {
        insigniaRole: string
        insigniaPrice: number
      }
    }>
  >
  let repository: Mock<UsersRepository>
  let controller: AcquireInsigniaController

  beforeEach(() => {
    database.run.mockClear()
    database.run.mockImplementation(async (operation) => operation())
    jest.restoreAllMocks()
    http = mock()
    repository = mock()
    controller = new AcquireInsigniaController(repository, database)
  })

  it('should execute acquire insignia use case using body and account id and send response', async () => {
    const userId = IdFaker.fake().value
    const body = {
      insigniaRole: 'god',
      insigniaPrice: 300,
    }
    const useCaseResponse = UsersFaker.fakeDto({ id: userId, insigniaRoles: ['god'] })
    const restResponse = mock<RestResponse>()

    http.getAccount.mockResolvedValue({ id: userId } as never)
    http.getBody.mockResolvedValue(body)
    http.send.mockReturnValue(restResponse)

    const executeSpy = jest
      .spyOn(AcquireInsigniaUseCase.prototype, 'execute')
      .mockResolvedValue(useCaseResponse)

    const response = await controller.handle(http)

    expect(http.getAccount).toHaveBeenCalledTimes(1)
    expect(http.getBody).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({
      userId,
      insigniaRole: body.insigniaRole,
      insigniaPrice: body.insigniaPrice,
    })
    expect(http.send).toHaveBeenCalledWith(useCaseResponse)
    expect(response).toBe(restResponse)
  })
})
