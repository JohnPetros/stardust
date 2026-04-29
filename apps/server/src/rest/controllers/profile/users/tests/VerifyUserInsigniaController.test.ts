import { mock, type Mock } from 'ts-jest-mocker'

import { AccountsFaker } from '@stardust/core/auth/entities/fakers'
import type { Http } from '@stardust/core/global/interfaces'
import { InsigniaRole } from '@stardust/core/global/structures'
import { InsigniaNotIncludedError } from '@stardust/core/profile/errors'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { GetUserUseCase } from '@stardust/core/profile/use-cases'

import { VerifyUserInsigniaController } from '../VerifyUserInsigniaController'

describe('Verify User Insignia Controller', () => {
  let http: Mock<Http>
  let usersRepository: Mock<UsersRepository>

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    usersRepository = mock()
    http.getAccount.mockResolvedValue(AccountsFaker.fakeDto({ id: 'user-1' }))
    http.pass.mockImplementation()
  })

  it('should pass when user has at least one required insignia', async () => {
    const insigniaRoles = [InsigniaRole.createAsEngineer()]
    const controller = new VerifyUserInsigniaController(insigniaRoles, usersRepository)
    const user = UsersFaker.fakeDto({ insigniaRoles: ['engineer'] })

    const executeSpy = jest
      .spyOn(GetUserUseCase.prototype, 'execute')
      .mockResolvedValue(user)

    await controller.handle(http)

    expect(executeSpy).toHaveBeenCalledWith({ userId: 'user-1' })
    expect(http.pass).toHaveBeenCalledTimes(1)
  })

  it('should throw InsigniaNotIncludedError when user has no required insignia', async () => {
    const insigniaRoles = [InsigniaRole.createAsGod()]
    const controller = new VerifyUserInsigniaController(insigniaRoles, usersRepository)
    const user = UsersFaker.fakeDto({ insigniaRoles: [] })

    jest.spyOn(GetUserUseCase.prototype, 'execute').mockResolvedValue(user)

    await expect(controller.handle(http)).rejects.toThrow(InsigniaNotIncludedError)
    expect(http.pass).not.toHaveBeenCalled()
  })
})
