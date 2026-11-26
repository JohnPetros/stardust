import request from 'supertest'

import { HTTP_HEADERS, HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { ValidationError } from '@stardust/core/global/errors'

import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { ForumFixture } from '@/tests/fixtures/ForumFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /forum/comments/challenge/:challengeId', () => {
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

  it('should return 400 when challenge id is invalid', async () => {
    const response = await request(honoFixture.server).get(
      '/forum/comments/challenge/invalid-id?sorter=date&order=descending&page=1&itemsPerPage=10',
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([{ name: 'challengeId', messages: ['Invalid uuid'] }]),
      }),
    )
  })

  it('should return a paginated list of challenge comments', async () => {
    await profileFixture.createAccountUser(authFixture.getAccountId())
    const challenge = await forumFixture.createChallenge(authFixture.getAccountId())
    const comment = await forumFixture.createChallengeComment(challenge.id ?? '', {
      authorId: authFixture.getAccountId(),
    })

    const response = await request(honoFixture.server).get(
      `/forum/comments/challenge/${challenge.id}?sorter=date&order=descending&page=1&itemsPerPage=10`,
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.headers[HTTP_HEADERS.xPaginationResponse.toLowerCase()]).toBe('true')
    expect(response.headers[HTTP_HEADERS.xTotalItemsCount.toLowerCase()]).toBe('1')
    expect(response.headers[HTTP_HEADERS.xTotalPagesCount.toLowerCase()]).toBe('1')
    expect(response.headers[HTTP_HEADERS.xItemsPerPage.toLowerCase()]).toBe('10')
    expect(response.headers[HTTP_HEADERS.xPage.toLowerCase()]).toBe('1')
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: comment.id,
          content: comment.content,
          upvotesCount: comment.upvotesCount,
          repliesCount: comment.repliesCount,
          author: expect.objectContaining({
            id: comment.author.id,
            entity: expect.objectContaining({
              name: comment.author.entity.name,
              slug: comment.author.entity.slug,
              avatar: comment.author.entity.avatar,
            }),
          }),
        }),
      ]),
    )
  })
})
