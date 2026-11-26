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

describe('[PATCH] /forum/comments/:commentId', () => {
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
      .patch(`/forum/comments/${Id.create().value}`)
      .send({ content: 'Comentário editado' })

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 400 when comment id is invalid', async () => {
    const response = await request(honoFixture.server)
      .patch('/forum/comments/invalid-id')
      .set(authFixture.getAuthorizationHeader())
      .send({ content: 'Comentário editado' })

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([{ name: 'commentId', messages: ['Invalid uuid'] }]),
      }),
    )
  })

  it('should return 404 when comment does not exist', async () => {
    const response = await request(honoFixture.server)
      .patch(`/forum/comments/${Id.create().value}`)
      .set(authFixture.getAuthorizationHeader())
      .send({ content: 'Comentário editado' })

    expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new CommentNotFoundError() }),
    )
  })

  it('should edit an existing comment', async () => {
    await profileFixture.createAccountUser(authFixture.getAccountId())
    const challenge = await forumFixture.createChallenge(authFixture.getAccountId())
    const comment = await forumFixture.createChallengeComment(challenge.id ?? '', {
      authorId: authFixture.getAccountId(),
    })

    const response = await request(honoFixture.server)
      .patch(`/forum/comments/${comment.id}`)
      .set(authFixture.getAuthorizationHeader())
      .send({ content: 'Comentário editado pela rota' })

    const persistedComment = await forumFixture.findCommentById(comment.id)

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(persistedComment).toEqual(
      expect.objectContaining({
        id: comment.id,
        content: 'Comentário editado pela rota',
      }),
    )
  })
})
