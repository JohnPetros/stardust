import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'

import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /challenging/roadmap/nodes/:nodeKey/challenges', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()

  beforeAll(async () => {
    await honoFixture.setup()
  })

  beforeEach(async () => {
    await supabaseFixture.clearDatabase()
  })

  it('returns the curried challenges for a roadmap node in editorial order', async () => {
    const response = await request(honoFixture.server).get(
      '/challenging/roadmap/nodes/basico/challenges',
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body.nodeKey).toBe('basico')
    expect(response.body.challenges).toHaveLength(3)
    expect(
      response.body.challenges.map((challenge: { slug: string }) => challenge.slug),
    ).toEqual(['enviando-mensagem', 'pedido-de-ajuda', 'acoplagem-no-nucleo-da-nave'])
    expect(response.body.challenges).toEqual(
      expect.arrayContaining([expect.objectContaining({ order: 1, isCompleted: null })]),
    )
  })

  it('returns not found when the node is outside the published revision', async () => {
    const response = await request(honoFixture.server).get(
      '/challenging/roadmap/nodes/not-in-roadmap/challenges',
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
  })
})
