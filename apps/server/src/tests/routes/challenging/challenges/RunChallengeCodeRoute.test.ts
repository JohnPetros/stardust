import { asc, eq } from 'drizzle-orm'
import request from 'supertest'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { challengeCodeExecutionModel } from '@/database/drizzle/schema'
import { ENV } from '@/constants'
import { ChallengeNotFoundError } from '@stardust/core/challenging/errors'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, ValidationError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'

import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { ChallengingFixture } from '@/tests/fixtures/ChallengingFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[POST] /challenging/challenges/:challengeId/code-executions', () => {
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
    const response = await request(honoFixture.server)
      .post(`/challenging/challenges/${Id.create().value}/code-executions`)
      .send({ code: 'escreva("ok")' })

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 400 when code is missing', async () => {
    const response = await request(honoFixture.server)
      .post(`/challenging/challenges/${Id.create().value}/code-executions`)
      .set(authFixture.getAuthorizationHeader())
      .send({})

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([{ name: 'code', messages: ['Campo obrigatório'] }]),
      }),
    )
  })

  it('should persist the private owner execution and reject another account without writing', async () => {
    ENV.godAccountIds = []
    const otherAccount = new AuthFixture(supabaseFixture.supabase)
    await otherAccount.createAccount()
    await profileFixture.createAccountUser(otherAccount.getAccountId())
    const challengeId = Id.create().value
    await challengingFixture.createChallenge(authFixture.getAccountId(), {
      id: challengeId,
      isPublic: false,
      starId: null,
    })
    const response = await request(honoFixture.server)
      .post(`/challenging/challenges/${challengeId}/code-executions`)
      .set(authFixture.getAuthorizationHeader())
      .send({ code: 'codigo invalido' })
    expect(response.status).toBe(HTTP_STATUS_CODE.created)
    expect(response.body).toEqual(
      expect.objectContaining({
        code: 'codigo invalido',
        status: expect.stringMatching(/syntax_error|runtime_error|internal_error/),
      }),
    )
    async function readExecutions() {
      return supabaseFixture.database
        .select()
        .from(challengeCodeExecutionModel)
        .where(eq(challengeCodeExecutionModel.challengeId, challengeId))
        .orderBy(asc(challengeCodeExecutionModel.createdAt))
    }
    const before = await readExecutions()
    expect(before).toHaveLength(1)
    expect(before[0]).toEqual(
      expect.objectContaining({
        userId: authFixture.getAccountId(),
        challengeId,
        code: 'codigo invalido',
        status: response.body.status,
      }),
    )
    expect(ENV.godAccountIds).toEqual([])
    const denied = await request(honoFixture.server)
      .post(`/challenging/challenges/${challengeId}/code-executions`)
      .set(otherAccount.getAuthorizationHeader())
      .send({ code: 'codigo invalido' })
    expect(denied.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(denied.body).toEqual(
      expect.objectContaining({ ...new ChallengeNotFoundError() }),
    )
    const after = await readExecutions()
    expect(after).toEqual(before)
    expect(
      after.filter((execution) => execution.userId === otherAccount.getAccountId()),
    ).toEqual([])
  })

  it('should persist exact accepted and wrong-answer outcomes for separate public challenge actors', async () => {
    ENV.godAccountIds = []
    const otherAccount = new AuthFixture(supabaseFixture.supabase)
    await otherAccount.createAccount()
    await profileFixture.createAccountUser(otherAccount.getAccountId())
    const challengeId = Id.create().value
    await challengingFixture.createChallenge(authFixture.getAccountId(), {
      id: challengeId,
      isPublic: true,
      starId: null,
      isEvaluatedByFunction: false,
      initialCode: 'escreva(leia())',
      testCases: [{ position: 1, inputs: [2], expectedOutput: '3', isLocked: false }],
    })
    async function readExecutions() {
      return supabaseFixture.database
        .select()
        .from(challengeCodeExecutionModel)
        .where(eq(challengeCodeExecutionModel.challengeId, challengeId))
        .orderBy(
          asc(challengeCodeExecutionModel.userId),
          asc(challengeCodeExecutionModel.id),
        )
    }
    expect(await readExecutions()).toEqual([])
    const scenarios = [
      {
        account: authFixture,
        code: 'escreva(leia() + 1)',
        status: 'accepted',
        output: 3,
        correct: true,
      },
      {
        account: otherAccount,
        code: 'escreva(leia() + 2)',
        status: 'wrong_answer',
        output: 4,
        correct: false,
      },
    ]
    let ownerSnapshot: Awaited<ReturnType<typeof readExecutions>> = []
    for (const [index, scenario] of scenarios.entries()) {
      const response = await request(honoFixture.server)
        .post(`/challenging/challenges/${challengeId}/code-executions`)
        .set(scenario.account.getAuthorizationHeader())
        .send({ code: scenario.code })
      expect(response.status).toBe(HTTP_STATUS_CODE.created)
      const payload = {
        code: scenario.code,
        status: scenario.status,
        testResults: [
          {
            position: 1,
            isCorrect: scenario.correct,
            userOutput: JSON.stringify(String(scenario.output)),
            expectedOutput: '3',
          },
        ],
        outputs: [String(scenario.output)],
        error: null,
      }
      expect(response.body).toEqual({ ...payload, createdAt: expect.any(String) })
      const rows = await readExecutions()
      expect(rows).toHaveLength(index + 1)
      const ownRows = rows.filter((row) => row.userId === scenario.account.getAccountId())
      expect(ownRows).toHaveLength(1)
      expect(ownRows[0]).toEqual({
        id: expect.any(String),
        userId: scenario.account.getAccountId(),
        challengeId,
        ...payload,
        createdAt: new Date(response.body.createdAt),
      })
      if (index === 0) ownerSnapshot = rows
      else
        expect(rows.filter((row) => row.userId === authFixture.getAccountId())).toEqual(
          ownerSnapshot,
        )
    }
  })

  it('should run code and persist the execution', async () => {
    const challenge = await challengingFixture.createChallenge(authFixture.getAccountId())

    const response = await request(honoFixture.server)
      .post(`/challenging/challenges/${challenge.id}/code-executions`)
      .set(authFixture.getAuthorizationHeader())
      .send({ code: 'codigo invalido' })

    expect(response.status).toBe(HTTP_STATUS_CODE.created)
    expect(response.body).toEqual(
      expect.objectContaining({
        code: 'codigo invalido',
        status: expect.stringMatching(/syntax_error|runtime_error|internal_error/),
      }),
    )

    const data = await challengingFixture.findCodeExecutions(
      authFixture.getAccountId(),
      challenge.id ?? '',
    )
    expect(data).toHaveLength(1)
    expect(data[0]).toEqual(
      expect.objectContaining({
        code: 'codigo invalido',
        challengeId: challenge.id,
        userId: authFixture.getAccountId(),
      }),
    )
  })
})
