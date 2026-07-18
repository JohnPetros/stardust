import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'

import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { ForumFixture } from '@/tests/fixtures/ForumFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /challenging/challenges/:challengeId/code-executions/errors-count', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const profileFixture = new ProfileFixture(supabaseFixture.supabase)
  const forumFixture = new ForumFixture(supabaseFixture.supabase)

  beforeAll(async () => {
    await honoFixture.setup()
  })

  beforeEach(async () => {
    await supabaseFixture.clearDatabase()
    await authFixture.createAccount()
    await profileFixture.createAccountUser(authFixture.getAccountId())
  })

  it('should return 401 when not authenticated', async () => {
    const response = await request(honoFixture.server).get(
      `/challenging/challenges/${Id.create().value}/code-executions/errors-count`,
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should count penalizable errors without counting internal errors', async () => {
    const challenge = await forumFixture.createChallenge(authFixture.getAccountId())

    const { error } = await supabaseFixture.supabase
      .from('challenge_code_executions')
      .insert([
        {
          user_id: authFixture.getAccountId(),
          challenge_id: challenge.id,
          code: 'wrong',
          status: 'wrong_answer',
          test_results: [
            { position: 1, isCorrect: false, userOutput: 1, expectedOutput: 2 },
            { position: 2, isCorrect: false, userOutput: 2, expectedOutput: 3 },
            { position: 3, isCorrect: true, userOutput: 4, expectedOutput: 4 },
          ],
          outputs: [],
        },
        {
          user_id: authFixture.getAccountId(),
          challenge_id: challenge.id,
          code: 'syntax',
          status: 'syntax_error',
          test_results: [],
          outputs: [],
        },
        {
          user_id: authFixture.getAccountId(),
          challenge_id: challenge.id,
          code: 'internal',
          status: 'internal_error',
          test_results: [],
          outputs: [],
        },
      ])

    if (error) throw error

    const response = await request(honoFixture.server)
      .get(`/challenging/challenges/${challenge.id}/code-executions/errors-count`)
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual({ errorsCount: 3 })
  })
})
