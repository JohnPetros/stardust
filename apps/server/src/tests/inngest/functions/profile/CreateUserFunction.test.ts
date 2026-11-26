import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'

import { ShopItemsAcquiredByDefaultEvent } from '@stardust/core/shop/events'

import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { userModel } from '@/database/drizzle/schema'
import { CreateUserJob } from '@/queue/jobs/profile/CreateUserJob'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { InngestFixture } from '@/tests/fixtures/InngestFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

// The app client is built with isDev only in `development` mode, so under `test` it would
// require signatures that the Inngest Dev Server does not send.
jest.mock('@/queue/inngest/inngest', () => {
  const { Inngest } = jest.requireActual('inngest')
  return { inngest: new Inngest({ id: 'StarDust Queue', isDev: true }) }
})

jest.setTimeout(120_000)

describe(`Create User Function [${CreateUserJob.KEY}]`, () => {
  const inngestFixture = new InngestFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const profileFixture = new ProfileFixture(supabaseFixture.supabase)

  beforeAll(async () => {
    await inngestFixture.setup([CreateUserJob.KEY])
  })

  beforeEach(async () => {
    await supabaseFixture.clearDatabase()
    await authFixture.createAccount()
  })

  afterAll(async () => {
    await inngestFixture.teardown()
    await DrizzleClient.close()
  })

  it('should persist the user with the selected avatar, rocket and first tier', async () => {
    const defaults = await profileFixture.createUserDefaults()
    const account = authFixture.getAccount()

    const eventId = await inngestFixture.send(ShopItemsAcquiredByDefaultEvent._NAME, {
      user: {
        id: authFixture.getAccountId(),
        name: 'Inngest User',
        email: account.email,
      },
      selectedAvatarByDefaultId: defaults.avatarId,
      selectedRocketByDefaultId: defaults.rocketId,
      acquiredAvatarsByDefaultIds: [defaults.avatarId],
      acquiredRocketsByDefaultIds: [defaults.rocketId],
      firstReachedTierId: defaults.tierId,
      firstUnlockedStarId: randomUUID(),
    })
    const run = await inngestFixture.waitForRun(eventId)

    expect(run.status).toBe('Completed')
    const [user] = await supabaseFixture.database
      .select()
      .from(userModel)
      .where(eq(userModel.id, authFixture.getAccountId()))
    expect(user).toEqual(
      expect.objectContaining({
        id: authFixture.getAccountId(),
        name: 'Inngest User',
        email: account.email,
        avatarId: defaults.avatarId,
        rocketId: defaults.rocketId,
        tierId: defaults.tierId,
      }),
    )
  })
})
