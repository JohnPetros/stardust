import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, ValidationError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import { CommentNotFoundError } from '@stardust/core/forum/errors'

import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { ForumFixture } from '@/tests/fixtures/ForumFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[POST] /forum/comments/:commentId/replies', () => {
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
      .post(`/forum/comments/${Id.create().value}/replies`)
      .send({ content: 'Nova resposta' })

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 400 when comment id is invalid', async () => {
    const response = await request(honoFixture.server)
      .post('/forum/comments/invalid-id/replies')
      .set(authFixture.getAuthorizationHeader())
      .send({ content: 'Nova resposta' })

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([{ name: 'commentId', messages: ['Invalid uuid'] }]),
      }),
    )
  })

  it('should return 404 when comment does not exist', async () => {
    const response = await request(honoFixture.server)
      .post(`/forum/comments/${Id.create().value}/replies`)
      .set(authFixture.getAuthorizationHeader())
      .send({ content: 'Nova resposta' })

    expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new CommentNotFoundError() }),
    )
  })

  it('should create a reply for a comment', async () => {
    await profileFixture.createAccountUser(authFixture.getAccountId())
    const challenge = await forumFixture.createChallenge(authFixture.getAccountId())
    const comment = await forumFixture.createChallengeComment(challenge.id ?? '', {
      authorId: authFixture.getAccountId(),
    })

    const response = await request(honoFixture.server)
      .post(`/forum/comments/${comment.id}/replies`)
      .set(authFixture.getAuthorizationHeader())
      .send({ content: 'Resposta criada pela rota' })

    const replies = await forumFixture.listReplies(comment.id)
    const persistedComment = await forumFixture.findCommentById(comment.id)

    expect(response.status).toBe(HTTP_STATUS_CODE.created)
    expect(replies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          content: 'Resposta criada pela rota',
          parentCommentId: comment.id,
          author: expect.objectContaining({
            id: authFixture.getAccountId(),
          }),
        }),
      ]),
    )
    expect(persistedComment?.repliesCount).toBe(1)
  })
})
