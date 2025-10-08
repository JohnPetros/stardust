import { mock, type Mock } from 'ts-jest-mocker'

import type { Controller, Http } from '@stardust/core/global/interfaces'
import { RestResponse } from '@stardust/core/global/responses'

import { COOKIES, ROUTES } from '@/constants'
import { HandleRewardingPayloadController } from '../HandleRewardingPayloadController'

describe('Handle Rewarding Payload Controller', () => {
  let http: Mock<Http>
  let controller: Controller
  const mockResponse = new RestResponse({})

  beforeEach(() => {
    http = mock()
    http.getCurrentRoute.mockImplementation()
    http.getMethod.mockImplementation()
    http.hasCookie.mockImplementation()
    http.redirect.mockImplementation()
    http.pass.mockImplementation()
    controller = HandleRewardingPayloadController()
  })

  it('should check for rewarding payload cookie when method is GET and route starts with /rewarding', async () => {
    http.getMethod.mockReturnValue('GET')
    http.getCurrentRoute.mockReturnValue('/rewarding/some-path')
    http.hasCookie.mockResolvedValue(true)
    http.pass.mockResolvedValue(mockResponse)

    await controller.handle(http)

    expect(http.hasCookie).toHaveBeenCalledWith(COOKIES.keys.rewardingPayload)
  })

  it('should redirect to space route when rewarding payload cookie is not present', async () => {
    http.getMethod.mockReturnValue('GET')
    http.getCurrentRoute.mockReturnValue('/rewarding/some-path')
    http.hasCookie.mockResolvedValue(false)

    await controller.handle(http)

    expect(http.redirect).toHaveBeenCalledWith(ROUTES.space)
  })

  it('should pass through when rewarding payload cookie is present', async () => {
    http.getMethod.mockReturnValue('GET')
    http.getCurrentRoute.mockReturnValue('/rewarding/some-path')
    http.hasCookie.mockResolvedValue(true)
    http.pass.mockResolvedValue(mockResponse)

    await controller.handle(http)

    expect(http.pass).toHaveBeenCalled()
    expect(http.redirect).not.toHaveBeenCalled()
  })

  it('should pass through without checking cookies when method is not GET', async () => {
    http.getMethod.mockReturnValue('POST')
    http.getCurrentRoute.mockReturnValue('/rewarding/some-path')
    http.pass.mockResolvedValue(mockResponse)

    await controller.handle(http)

    expect(http.hasCookie).not.toHaveBeenCalled()
    expect(http.redirect).not.toHaveBeenCalled()
    expect(http.pass).toHaveBeenCalled()
  })

  it('should pass through without checking cookies when route does not start with /rewarding', async () => {
    http.getMethod.mockReturnValue('GET')
    http.getCurrentRoute.mockReturnValue('/other/route')
    http.pass.mockResolvedValue(mockResponse)

    await controller.handle(http)

    expect(http.hasCookie).not.toHaveBeenCalled()
    expect(http.redirect).not.toHaveBeenCalled()
    expect(http.pass).toHaveBeenCalled()
  })
})
