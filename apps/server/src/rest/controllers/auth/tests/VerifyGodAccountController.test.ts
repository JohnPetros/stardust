import { mock, type Mock } from 'ts-jest-mocker'

import { NotGodAccountError } from '@stardust/core/global/errors'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'

import { ENV } from '@/constants'

import { VerifyGodAccountController } from '../VerifyGodAccountController'

describe('VerifyGodAccountController', () => {
  const originalGodAccountIds = ENV.godAccountIds

  let controller: VerifyGodAccountController
  let http: Mock<Http>

  beforeEach(() => {
    controller = new VerifyGodAccountController()
    http = mock<Http>()
    ENV.godAccountIds = ['god-account-id']
  })

  afterAll(() => {
    ENV.godAccountIds = originalGodAccountIds
  })

  it('should pass when the account is a god account', async () => {
    const response = mock<RestResponse>()
    http.getAccountId.mockResolvedValue('god-account-id')
    http.pass.mockResolvedValue(response)

    await expect(controller.handle(http)).resolves.toBe(response)
    expect(http.pass).toHaveBeenCalled()
  })

  it('should throw when the account is not a god account', async () => {
    http.getAccountId.mockResolvedValue('regular-account-id')

    await expect(controller.handle(http)).rejects.toThrow(NotGodAccountError)
  })
})
