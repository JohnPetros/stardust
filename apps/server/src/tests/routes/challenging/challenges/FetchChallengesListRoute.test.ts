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

const listQuery =
  'page=1&itemsPerPage=10&title=&difficulty=all&completionStatus=all&isNewStatus=all&upvotesCountOrder=all&downvoteCountOrder=all&completionCountOrder=all&postingOrder=all&shouldIncludePrivateChallenges=false&shouldIncludeOnlyAuthorChallenges=false&shouldIncludeStarChallenges=false'

describe('[GET] /challenging/challenges/list', () => {
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

  it('should keep the paginated projection free of the official playback payload', async () => {
    const normativeSolution = CodePlayback.create(OFFICIAL_SOLUTION_FIXTURE).dto
    const volumeMarker = 'official-playback-list-volume-marker '
    const officialSolution = CodePlayback.create({
      ...normativeSolution,
      code: `${normativeSolution.code}\n${volumeMarker.repeat(256)}`,
      input: {
        ...normativeSolution.input,
        content: `${normativeSolution.input.content}\n${volumeMarker.repeat(256)}`,
      },
      steps: normativeSolution.steps.map((step, index) => ({
        ...step,
        explanation: `${step.explanation} ${index} ${volumeMarker.repeat(128)}`,
      })),
    }).dto
    const challenge = await challengingFixture.createChallengeWithOfficialSolution(
      authFixture.getAccountId(),
      officialSolution,
    )

    const response = await request(honoFixture.server).get(
      `/challenging/challenges/list?${listQuery}`,
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    const listedChallenge = response.body.find(
      (item: { id: string }) => item.id === challenge.id,
    )

    expect(listedChallenge).toBeDefined()
    expect(listedChallenge.officialSolution).toBeNull()
    const listedChallengeJson = JSON.stringify(listedChallenge)
    expect(listedChallengeJson).not.toContain(officialSolution.code)
    expect(listedChallengeJson).not.toContain(officialSolution.input.content)
    expect(listedChallengeJson).not.toContain(volumeMarker)
  })

  it('should map list rows without official_solution to a null playback', async () => {
    const challenge = await challengingFixture.createChallenge(authFixture.getAccountId())

    const response = await request(honoFixture.server).get(
      `/challenging/challenges/list?${listQuery}`,
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: challenge.id,
          officialSolution: null,
        }),
      ]),
    )
  })
})
