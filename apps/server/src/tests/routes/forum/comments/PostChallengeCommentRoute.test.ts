import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, ValidationError } from '@stardust/core/global/errors'

import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { ForumFixture } from '@/tests/fixtures/ForumFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[POST] /forum/comments/challenge/:challengeId', () => {
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
  })

  it('should return 401 when not authenticated', async () => {
    const response = await request(honoFixture.server)
      .post('/forum/comments/challenge/invalid-id')
      .send({ content: 'Novo comentário' })

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 400 when challenge id is invalid', async () => {
    const response = await request(honoFixture.server)
      .post('/forum/comments/challenge/invalid-id')
      .set(authFixture.getAuthorizationHeader())
      .send({ content: 'Novo comentário' })

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([{ name: 'challengeId', messages: ['Invalid uuid'] }]),
      }),
    )
  })

  it('should create a challenge comment', async () => {
    await profileFixture.createAccountUser(authFixture.getAccountId())
    const challenge = await forumFixture.createChallenge(authFixture.getAccountId())

    const response = await request(honoFixture.server)
      .post(`/forum/comments/challenge/${challenge.id}`)
      .set(authFixture.getAuthorizationHeader())
      .send({ content: 'Comentário da rota de desafio' })

    const comments = await forumFixture.listChallengeComments(challenge.id ?? '')

    expect(response.status).toBe(HTTP_STATUS_CODE.created)
    expect(comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          content: 'Comentário da rota de desafio',
          author: expect.objectContaining({
            id: authFixture.getAccountId(),
          }),
        }),
      ]),
    )
  })
})
