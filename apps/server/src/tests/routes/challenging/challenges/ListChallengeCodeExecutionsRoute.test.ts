import request from 'supertest'

import { HTTP_HEADERS, HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, ValidationError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'

import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { ForumFixture } from '@/tests/fixtures/ForumFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /challenging/challenges/:challengeId/code-executions', () => {
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
      `/challenging/challenges/${Id.create().value}/code-executions?page=1&itemsPerPage=10`,
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 400 when page is invalid', async () => {
    const response = await request(honoFixture.server)
      .get(
        `/challenging/challenges/${Id.create().value}/code-executions?page=0&itemsPerPage=10`,
      )
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([
          {
            name: 'page',
            messages: ['Number must be greater than or equal to 1'],
          },
        ]),
      }),
    )
  })

  it('should return paginated executions filtered by user and challenge', async () => {
    const challenge = await forumFixture.createChallenge(authFixture.getAccountId())
    const otherChallenge = await forumFixture.createChallenge(authFixture.getAccountId())

    const { error } = await supabaseFixture.supabase
      .from('challenge_code_executions')
      .insert([
        {
          user_id: authFixture.getAccountId(),
          challenge_id: challenge.id,
          code: 'primeira',
          status: 'wrong_answer',
          test_results: [],
          outputs: [],
        },
        {
          user_id: authFixture.getAccountId(),
          challenge_id: challenge.id,
          code: 'segunda',
          status: 'accepted',
          test_results: [],
          outputs: [],
        },
        {
          user_id: authFixture.getAccountId(),
          challenge_id: otherChallenge.id,
          code: 'outra',
          status: 'accepted',
          test_results: [],
          outputs: [],
        },
      ])

    if (error) throw error

    const response = await request(honoFixture.server)
      .get(
        `/challenging/challenges/${challenge.id}/code-executions?page=1&itemsPerPage=10`,
      )
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.headers[HTTP_HEADERS.xPaginationResponse.toLowerCase()]).toBe('true')
    expect(response.headers[HTTP_HEADERS.xTotalItemsCount.toLowerCase()]).toBe('2')
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: 'primeira' }),
        expect.objectContaining({ code: 'segunda' }),
      ]),
    )
    expect(response.body).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ code: 'outra' })]),
    )
  })
})
