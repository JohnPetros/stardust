import { mock, type Mock } from 'ts-jest-mocker'

import type { AuthService } from '@stardust/core/auth/interfaces'
import type { AccountDto } from '@stardust/core/auth/entities/dtos'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { RestResponse as CoreRestResponse } from '@stardust/core/global/responses'
import { ConflictError } from '@stardust/core/global/errors'
import type { UsersRepository } from '@stardust/core/profile/interfaces'

import { VerifyUserAbsenceController } from '../VerifyUserAbsenceController'

describe('Verify User Absence Controller', () => {
  let http: Mock<Http>
  let authService: Mock<AuthService>
  let usersRepository: Mock<UsersRepository>
  let controller: VerifyUserAbsenceController

  beforeEach(() => {
    jest.restoreAllMocks()
    http = mock()
    authService = mock()
    usersRepository = mock()
    controller = new VerifyUserAbsenceController(authService, usersRepository)
  })

  it('should pass when account has no related user profile', async () => {
    const restResponse = mock<RestResponse>()
    const account: AccountDto = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'user@test.com',
      name: 'User',
      isAuthenticated: true,
    }

    authService.fetchAccount.mockResolvedValue(new CoreRestResponse({ body: account }))
    usersRepository.findById.mockResolvedValue(null)
    http.pass.mockResolvedValue(restResponse)

    const result = await controller.handle(http)

    expect(usersRepository.findById).toHaveBeenCalledTimes(1)
    expect(http.pass).toHaveBeenCalledTimes(1)
    expect(result).toBe(restResponse)
  })

  it('should throw ConflictError when account already has a profile', async () => {
    const account: AccountDto = {
      id: '550e8400-e29b-41d4-a716-446655440000',
      email: 'user@test.com',
      name: 'User',
      isAuthenticated: true,
    }

    authService.fetchAccount.mockResolvedValue(new CoreRestResponse({ body: account }))
    usersRepository.findById.mockResolvedValue({ id: { value: 'user-id' } } as never)

    await expect(controller.handle(http)).rejects.toThrow(
      new ConflictError('Perfil já existe para esta conta'),
    )
    expect(http.pass).not.toHaveBeenCalled()
  })
})
