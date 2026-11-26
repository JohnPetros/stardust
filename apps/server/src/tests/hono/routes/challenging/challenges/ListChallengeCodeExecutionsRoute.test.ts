import request from 'supertest'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'

import { HTTP_HEADERS, HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, ValidationError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'

import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { ChallengingFixture } from '@/tests/fixtures/ChallengingFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /challenging/challenges/:challengeId/code-executions', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const profileFixture = new ProfileFixture(supabaseFixture.supabase)
  const challengingFixture = new ChallengingFixture(supabaseFixture.supabase)

  beforeAll(async () => {
    await honoFixture.setup()
  })

  afterAll(async () => {
    await DrizzleClient.close()
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
    const challenge = await challengingFixture.createChallenge(authFixture.getAccountId())
    const otherChallenge = await challengingFixture.createChallenge(
      authFixture.getAccountId(),
    )

    const otherAccount = new AuthFixture(supabaseFixture.supabase)
    await otherAccount.createAccount()
    await profileFixture.createAccountUser(otherAccount.getAccountId())
    await challengingFixture.createCodeExecutions([
      {
        userId: authFixture.getAccountId(),
        challengeId: challenge.id ?? '',
        code: 'primeira',
        createdAt: new Date('2026-01-01T12:00:00.000Z'),
        status: 'wrong_answer',
        testResults: [],
        outputs: [],
      },
      {
        userId: authFixture.getAccountId(),
        challengeId: challenge.id ?? '',
        code: 'segunda',
        createdAt: new Date('2026-01-02T12:00:00.000Z'),
        status: 'accepted',
        testResults: [],
        outputs: [],
      },
      {
        userId: authFixture.getAccountId(),
        challengeId: otherChallenge.id ?? '',
        code: 'outra',
        createdAt: new Date('2026-01-03T12:00:00.000Z'),
        status: 'accepted',
        testResults: [],
        outputs: [],
      },
      {
        userId: otherAccount.getAccountId(),
        challengeId: challenge.id ?? '',
        code: 'private other-account execution',
        createdAt: new Date('2026-01-04T12:00:00.000Z'),
        status: 'accepted',
        testResults: [],
        outputs: [],
      },
    ])

    async function readPersistedExecutions() {
      const groups = await Promise.all([
        challengingFixture.findCodeExecutions(
          authFixture.getAccountId(),
          challenge.id ?? '',
        ),
        challengingFixture.findCodeExecutions(
          authFixture.getAccountId(),
          otherChallenge.id ?? '',
        ),
        challengingFixture.findCodeExecutions(
          otherAccount.getAccountId(),
          challenge.id ?? '',
        ),
      ])
      return groups.map((rows) =>
        rows.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
      )
    }
    const before = await readPersistedExecutions()
    expect(before.map((rows) => rows.map((row) => row.code))).toEqual([
      ['segunda', 'primeira'],
      ['outra'],
      ['private other-account execution'],
    ])
    const expectedPages = [
      { code: 'segunda', status: 'accepted', createdAt: '2026-01-02T12:00:00.000Z' },
      { code: 'primeira', status: 'wrong_answer', createdAt: '2026-01-01T12:00:00.000Z' },
    ]
    for (const [index, expected] of expectedPages.entries()) {
      const response = await request(honoFixture.server)
        .get(
          `/challenging/challenges/${challenge.id}/code-executions?page=${index + 1}&itemsPerPage=1`,
        )
        .set(authFixture.getAuthorizationHeader())
      expect(response.status).toBe(HTTP_STATUS_CODE.ok)
      expect(response.headers[HTTP_HEADERS.xPaginationResponse.toLowerCase()]).toBe(
        'true',
      )
      expect(response.headers[HTTP_HEADERS.xTotalItemsCount.toLowerCase()]).toBe('2')
      expect(response.body).toEqual([
        { ...expected, testResults: [], outputs: [], error: null },
      ])
    }
    const response = await request(honoFixture.server)
      .get(
        `/challenging/challenges/${challenge.id}/code-executions?page=1&itemsPerPage=1`,
      )
      .set(otherAccount.getAuthorizationHeader())
    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.headers[HTTP_HEADERS.xPaginationResponse.toLowerCase()]).toBe('true')
    expect(response.headers[HTTP_HEADERS.xTotalItemsCount.toLowerCase()]).toBe('1')
    expect(response.body).toEqual([
      {
        code: 'private other-account execution',
        status: 'accepted',
        testResults: [],
        outputs: [],
        error: null,
        createdAt: '2026-01-04T12:00:00.000Z',
      },
    ])
    expect(await readPersistedExecutions()).toEqual(before)
  })
})
