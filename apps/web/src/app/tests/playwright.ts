import { test as playwrightTest } from '@playwright/test'

import { AuthFixture } from './fixtures/AuthFixture'
import { ChallengingFixture } from './fixtures/ChallengingFixture'
import { ProfileFixture } from './fixtures/ProfileFixture'
import { ReportingFixture } from './fixtures/ReportingFixture'
import { ServerAppFixture } from './fixtures/ServerAppFixture'
import { ShopFixture } from './fixtures/ShopFixture'
import { SpaceFixture } from './fixtures/SpaceFixture'

export const test = playwrightTest.extend<{
  auth: AuthFixture
  challenging: ChallengingFixture
  profile: ProfileFixture
  reporting: ReportingFixture
  serverApp: ServerAppFixture
  shop: ShopFixture
  space: SpaceFixture
}>({
  auth: async ({ context }, use) => {
    await use(new AuthFixture(context))
  },
  challenging: async ({ auth }, use) => {
    await use(new ChallengingFixture(auth))
  },
  profile: async ({ auth, serverApp }, use) => {
    await use(new ProfileFixture(serverApp, auth))
  },
  reporting: async ({ auth, serverApp }, use) => {
    await use(new ReportingFixture(serverApp, auth))
  },
  serverApp: [
    async ({ page }, use) => {
      const fixture = new ServerAppFixture(page)

      try {
        await use(fixture)
      } finally {
        await fixture.cleanup()
      }
    },
    { auto: true },
  ],
  shop: async ({ auth, serverApp }, use) => {
    await use(new ShopFixture(serverApp, auth))
  },
  space: async ({ auth, serverApp }, use) => {
    await use(new SpaceFixture(serverApp, auth))
  },
})

export { expect } from '@playwright/test'
export type { BrowserContext, Page, Request } from '@playwright/test'
