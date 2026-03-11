import { mock, type Mock } from 'ts-jest-mocker'

import type { Controller, Http } from '@stardust/core/global/interfaces'
import { RestResponse } from '@stardust/core/global/responses'

import { HandleRedirectController } from '../HandleRedirectController'

describe('Handle Redirect Controller', () => {
  let http: Mock<Http>
  let controller: Controller
  const mockResponse = new RestResponse({})

  beforeEach(() => {
    http = mock()
    http.getQueryParams.mockImplementation()
    http.redirect.mockImplementation()
    http.pass.mockImplementation()
    controller = HandleRedirectController()
  })

  it('should redirect when redirect_to is an internal relative route', async () => {
    const redirectUrl = '/dashboard'
    http.getQueryParams.mockReturnValue({ redirect_to: redirectUrl })

    await controller.handle(http)

    expect(http.redirect).toHaveBeenCalledWith(redirectUrl)
  })

  it('should pass through when redirect_to query param is not present', async () => {
    http.getQueryParams.mockReturnValue({})
    http.pass.mockResolvedValue(mockResponse)

    await controller.handle(http)

    expect(http.pass).toHaveBeenCalled()
    expect(http.redirect).not.toHaveBeenCalled()
  })

  it('should pass through when query params are null', async () => {
    http.getQueryParams.mockReturnValue(null)
    http.pass.mockResolvedValue(mockResponse)

    await controller.handle(http)

    expect(http.pass).toHaveBeenCalled()
    expect(http.redirect).not.toHaveBeenCalled()
  })

  it('should pass through when query params are undefined', async () => {
    http.getQueryParams.mockReturnValue(undefined)
    http.pass.mockResolvedValue(mockResponse)

    await controller.handle(http)

    expect(http.pass).toHaveBeenCalled()
    expect(http.redirect).not.toHaveBeenCalled()
  })

  it('should pass through when redirect_to is empty string', async () => {
    http.getQueryParams.mockReturnValue({ redirect_to: '' })
    http.pass.mockResolvedValue(mockResponse)

    await controller.handle(http)

    expect(http.pass).toHaveBeenCalled()
    expect(http.redirect).not.toHaveBeenCalled()
  })

  it('should pass through when redirect_to is an absolute URL', async () => {
    const redirectUrl = 'https://example.com/external'
    http.getQueryParams.mockReturnValue({ redirect_to: redirectUrl })
    http.pass.mockResolvedValue(mockResponse)

    await controller.handle(http)

    expect(http.pass).toHaveBeenCalled()
    expect(http.redirect).not.toHaveBeenCalled()
  })

  it('should pass through when redirect_to uses a protocol-relative URL', async () => {
    http.getQueryParams.mockReturnValue({ redirect_to: '//example.com/external' })
    http.pass.mockResolvedValue(mockResponse)

    await controller.handle(http)

    expect(http.pass).toHaveBeenCalled()
    expect(http.redirect).not.toHaveBeenCalled()
  })

  it('should get query params correctly', async () => {
    http.getQueryParams.mockReturnValue({ redirect_to: '/test' })

    await controller.handle(http)

    expect(http.getQueryParams).toHaveBeenCalled()
  })
})
