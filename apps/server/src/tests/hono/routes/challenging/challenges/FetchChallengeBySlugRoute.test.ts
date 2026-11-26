import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { CodePlayback } from '@stardust/core/global/structures'

import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import {
  ChallengingFixture,
  OFFICIAL_SOLUTION_FIXTURE,
} from '@/tests/fixtures/ChallengingFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /challenging/challenges/slug/:challengeSlug', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const profileFixture = new ProfileFixture(supabaseFixture.supabase)
  const challengingFixture = new ChallengingFixture(supabaseFixture.supabase)

  beforeAll(async () => {
    await honoFixture.setup()
  })

  beforeEach(async () => {
    await supabaseFixture.clearDatabase()
    await authFixture.createAccount()
    await profileFixture.createAccountUser(authFixture.getAccountId())
  })

  it('should return the persisted official playback unchanged', async () => {
    const officialSolution = CodePlayback.create(OFFICIAL_SOLUTION_FIXTURE).dto
    const challenge = await challengingFixture.createChallengeWithOfficialSolution(
      authFixture.getAccountId(),
      officialSolution,
    )

    const response = await request(honoFixture.server).get(
      `/challenging/challenges/slug/${challenge.slug}`,
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body.officialSolution).toEqual(officialSolution)
  })

  it('should return null when the challenge has no official playback', async () => {
    const challenge = await challengingFixture.createChallenge(authFixture.getAccountId())

    const response = await request(honoFixture.server).get(
      `/challenging/challenges/slug/${challenge.slug}`,
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual(
      expect.objectContaining({
        id: challenge.id,
        officialSolution: null,
      }),
    )
  })
})
