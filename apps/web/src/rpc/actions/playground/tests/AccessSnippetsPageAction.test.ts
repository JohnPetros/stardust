import { mock, type Mock } from 'ts-jest-mocker'

import type { Call } from '@stardust/core/global/interfaces'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'

import { AccessSnippetsPageAction } from '../AccessSnippetsPageAction'

describe('Access Snippets Page Action', () => {
  let call: Mock<Call>

  beforeEach(() => {
    call = mock<Call>()
  })

  it('should accept a valid authenticated user from call.getUser without throwing', async () => {
    const userDto = UsersFaker.fakeDto()

    call.getUser.mockResolvedValue(userDto)

    const action = AccessSnippetsPageAction()

    await expect(action.handle(call)).resolves.toBeUndefined()

    expect(call.getUser).toHaveBeenCalled()
  })

  it('should propagate the validation error when call.getUser returns an invalid user', async () => {
    call.getUser.mockResolvedValue({} as never)

    const action = AccessSnippetsPageAction()

    await expect(action.handle(call)).rejects.toThrow()

    expect(call.getUser).toHaveBeenCalled()
  })
})
