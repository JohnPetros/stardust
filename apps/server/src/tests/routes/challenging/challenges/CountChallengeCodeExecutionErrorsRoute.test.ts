import request from 'supertest'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'

import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { ChallengingFixture } from '@/tests/fixtures/ChallengingFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /challenging/challenges/:challengeId/code-executions/errors-count', () => {
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
      `/challenging/challenges/${Id.create().value}/code-executions/errors-count`,
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should count penalizable errors without counting internal errors', async () => {
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
        code: 'wrong',
        createdAt: new Date('2026-01-01T12:00:00.000Z'),
        status: 'wrong_answer',
        testResults: [
          { position: 1, isCorrect: false, userOutput: 1, expectedOutput: 2 },
          { position: 2, isCorrect: false, userOutput: 2, expectedOutput: 3 },
          { position: 3, isCorrect: true, userOutput: 4, expectedOutput: 4 },
        ],
        outputs: [],
      },
      {
        userId: authFixture.getAccountId(),
        challengeId: challenge.id ?? '',
        code: 'syntax',
        createdAt: new Date('2026-01-02T12:00:00.000Z'),
        status: 'syntax_error',
        testResults: [],
        outputs: [],
      },
      {
        userId: authFixture.getAccountId(),
        challengeId: challenge.id ?? '',
        code: 'internal',
        createdAt: new Date('2026-01-03T12:00:00.000Z'),
        status: 'internal_error',
        testResults: [],
        outputs: [],
      },
      {
        userId: authFixture.getAccountId(),
        challengeId: challenge.id ?? '',
        code: 'runtime',
        createdAt: new Date('2026-01-04T12:00:00.000Z'),
        status: 'runtime_error',
        testResults: [],
        outputs: [],
      },
      {
        userId: authFixture.getAccountId(),
        challengeId: otherChallenge.id ?? '',
        code: 'other challenge syntax',
        createdAt: new Date('2026-01-05T12:00:00.000Z'),
        status: 'syntax_error',
        testResults: [],
        outputs: [],
      },
      {
        userId: authFixture.getAccountId(),
        challengeId: otherChallenge.id ?? '',
        code: 'other challenge runtime',
        createdAt: new Date('2026-01-06T12:00:00.000Z'),
        status: 'runtime_error',
        testResults: [],
        outputs: [],
      },
      {
        userId: otherAccount.getAccountId(),
        challengeId: challenge.id ?? '',
        code: 'other account syntax',
        createdAt: new Date('2026-01-07T12:00:00.000Z'),
        status: 'syntax_error',
        testResults: [],
        outputs: [],
      },
      {
        userId: otherAccount.getAccountId(),
        challengeId: challenge.id ?? '',
        code: 'other account runtime',
        createdAt: new Date('2026-01-08T12:00:00.000Z'),
        status: 'runtime_error',
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
      ['runtime', 'internal', 'syntax', 'wrong'],
      ['other challenge runtime', 'other challenge syntax'],
      ['other account runtime', 'other account syntax'],
    ])
    const response = await request(honoFixture.server)
      .get(`/challenging/challenges/${challenge.id}/code-executions/errors-count`)
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual({ errorsCount: 4 })
    const otherResponse = await request(honoFixture.server)
      .get(`/challenging/challenges/${challenge.id}/code-executions/errors-count`)
      .set(otherAccount.getAuthorizationHeader())
    expect(otherResponse.status).toBe(HTTP_STATUS_CODE.ok)
    expect(otherResponse.body).toEqual({ errorsCount: 2 })
    expect(await readPersistedExecutions()).toEqual(before)
  })
})
