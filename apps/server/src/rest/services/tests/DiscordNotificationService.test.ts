import { RestResponse } from '@stardust/core/global/responses'

import { ENV } from '@/constants'
import { DiscordNotificationService } from '../DiscordNotificationService'

describe('DiscordNotificationService', () => {
  const restClient = {
    post: jest.fn().mockResolvedValue(new RestResponse()),
  }
  const originalMode = ENV.mode

  afterEach(() => {
    ENV.mode = originalMode
    jest.clearAllMocks()
  })

  it('should not call Discord in development mode', async () => {
    ENV.mode = 'development'

    const service = new DiscordNotificationService(restClient)

    const response = await service.sendErrorNotification('server', 'development error')

    expect(response.isSuccessful).toBe(true)
    expect(restClient.post).not.toHaveBeenCalled()
  })

  it('should call Discord outside development mode', async () => {
    ENV.mode = 'test'

    const service = new DiscordNotificationService(restClient)

    await service.sendErrorNotification('server', 'test error')

    expect(restClient.post).toHaveBeenCalledWith(
      '/',
      expect.objectContaining({
        embeds: expect.any(Array),
      }),
    )
  })
})
