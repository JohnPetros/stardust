import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'

import { HonoFixture } from '@/tests/fixtures/HonoFixture'

describe('[PUT] /profile/users/:userId/reward/star', () => {
  const honoFixture = new HonoFixture()

  beforeAll(async () => {
    await honoFixture.setup()
  })

  it('should return 401 when not authenticated', async () => {
    const response = await request(honoFixture.server)
      .put(`/profile/users/${Id.create().value}/reward/star`)
      .send({
        starId: Id.create().value,
        questionsCount: 10,
        incorrectAnswersCount: 1,
      })

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })
})
