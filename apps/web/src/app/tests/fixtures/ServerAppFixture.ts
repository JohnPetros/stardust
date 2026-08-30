import type { Page } from '@playwright/test'

import { ServerMock, type ServerMockController } from '../shared/mocks/ServerMock'

export class ServerAppFixture {
  private readonly serverMock: ServerMockController

  constructor(private readonly page: Page) {
    this.serverMock = ServerMock(page)
  }

  register(routes: Parameters<ServerMockController['register']>[0]) {
    return this.serverMock.register(routes)
  }

  registerSuccessDefaults(
    overrides?: Parameters<ServerMockController['registerSuccessDefaults']>[0],
  ) {
    return this.serverMock.registerSuccessDefaults(overrides)
  }

  reset() {
    return this.serverMock.reset()
  }

  async cleanup() {
    await this.reset()
    await this.page.evaluate(() => {
      window.__STARDUST_PROFILE_CHANNEL_MOCK__?.reset()
    })
  }
}
