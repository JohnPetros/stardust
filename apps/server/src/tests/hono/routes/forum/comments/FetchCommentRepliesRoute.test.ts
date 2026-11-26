import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { ValidationError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import { CommentNotFoundError } from '@stardust/core/forum/errors'

import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { ForumFixture } from '@/tests/fixtures/ForumFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /forum/comments/:commentId/replies', () => {
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

  it('should return 400 when comment id is invalid', async () => {
    const response = await request(honoFixture.server).get(
      '/forum/comments/invalid-id/replies',
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([{ name: 'commentId', messages: ['Invalid uuid'] }]),
      }),
    )
  })

  it('should return 404 when comment does not exist', async () => {
    const response = await request(honoFixture.server).get(
      `/forum/comments/${Id.create().value}/replies`,
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new CommentNotFoundError() }),
    )
  })

  it('should return the replies of a comment', async () => {
    await profileFixture.createAccountUser(authFixture.getAccountId())
    const challenge = await forumFixture.createChallenge(authFixture.getAccountId())
    const comment = await forumFixture.createChallengeComment(challenge.id ?? '', {
      authorId: authFixture.getAccountId(),
    })
    const reply = await forumFixture.createReply({
      authorId: authFixture.getAccountId(),
      commentId: comment.id,
    })

    const response = await request(honoFixture.server).get(
      `/forum/comments/${comment.id}/replies`,
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: reply.id,
          content: reply.content,
          upvotesCount: reply.upvotesCount,
          repliesCount: reply.repliesCount,
          author: expect.objectContaining({
            id: reply.author.id,
            entity: expect.objectContaining({
              name: reply.author.entity.name,
              slug: reply.author.entity.slug,
              avatar: reply.author.entity.avatar,
            }),
          }),
        }),
      ]),
    )
  })
})
