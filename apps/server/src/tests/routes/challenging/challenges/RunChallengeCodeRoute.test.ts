import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, ValidationError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'

import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { ForumFixture } from '@/tests/fixtures/ForumFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[POST] /challenging/challenges/:challengeId/code-executions', () => {
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

  it('should run code and persist the execution', async () => {
    const challenge = await forumFixture.createChallenge(authFixture.getAccountId())

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

    const { data, error } = await supabaseFixture.supabase
      .from('challenge_code_executions')
      .select('code, challenge_id, user_id')
      .eq('challenge_id', challenge.id)
      .eq('user_id', authFixture.getAccountId())

    if (error) throw error
    expect(data).toHaveLength(1)
    expect(data[0]).toEqual(
      expect.objectContaining({
        code: 'codigo invalido',
        challenge_id: challenge.id,
        user_id: authFixture.getAccountId(),
      }),
    )
  })
})
