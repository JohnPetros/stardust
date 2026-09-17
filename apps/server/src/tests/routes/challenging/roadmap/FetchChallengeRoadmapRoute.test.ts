import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AppError, ConflictError } from '@stardust/core/global/errors'
import { UpdateChallengeUseCase } from '@stardust/core/challenging/use-cases'
import { ChallengeCategoriesFaker } from '@stardust/core/challenging/entities/fakers'

import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'
import {
  filterValidChallengeRoadmapAssociations,
  SupabaseChallengeRoadmapsRepository,
  type ChallengeRoadmapTelemetry,
} from '@/database/supabase/repositories/challenging'
import { ChallengingFixture } from '@/tests/fixtures/ChallengingFixture'

describe('[GET] /challenging/roadmap', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const profileFixture = new ProfileFixture(supabaseFixture.supabase)
  const challengingFixture = new ChallengingFixture(supabaseFixture.supabase)

  beforeAll(async () => {
    await honoFixture.setup()
  })

  beforeEach(async () => {
    await supabaseFixture.clearDatabase()
  })

  it('returns the public snapshot for a visitor and ignores client completion ids', async () => {
    const response = await request(honoFixture.server)
      .get('/challenging/roadmap')
      .query({ completedChallengeIds: 'client-supplied-id' })

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body.revision).toEqual(
      expect.objectContaining({ key: 'desafios', version: 1 }),
    )
    expect(response.body.nodes).toHaveLength(8)
    expect(response.body.edges).toHaveLength(10)
    expect(
      response.body.nodes.reduce(
        (total: number, node: { totalChallenges: number }) =>
          total + node.totalChallenges,
        0,
      ),
    ).toBe(20)
    expect(response.body.progress).toBeNull()
    expect(response.body.recommendation).toBeNull()
    expect(response.body.nodes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          completedChallenges: null,
          isEligible: null,
          isCompleted: null,
        }),
      ]),
    )
  })

  it('returns editorial progress for an authenticated profile', async () => {
    await authFixture.createAccount()
    await profileFixture.createAccountUser(authFixture.getAccountId())

    const response = await request(honoFixture.server)
      .get('/challenging/roadmap')
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body.progress).toEqual({ completed: 0, total: 20, percentage: 0 })
    expect(response.body.nodes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          completedChallenges: 0,
          isEligible: expect.any(Boolean),
          isCompleted: false,
        }),
      ]),
    )
  })

  it('returns 500 when the published roadmap has a structural failure', async () => {
    const findPublishedSpy = jest
      .spyOn(SupabaseChallengeRoadmapsRepository.prototype, 'findPublished')
      .mockRejectedValue(new AppError('roadmap inválido'))

    const response = await request(honoFixture.server).get('/challenging/roadmap')

    expect(response.status).toBe(HTTP_STATUS_CODE.serverError)
    expect(response.body).toEqual({
      title: 'Erro interno da aplicação',
      message: 'roadmap inválido',
    })
    findPublishedSpy.mockRestore()
  })

  it('returns 409 when a mutation is rejected by the active-roadmap guard', async () => {
    await authFixture.createAccount()
    await profileFixture.createAccountUser(authFixture.getAccountId())
    const challenge = await challengingFixture.createChallenge(authFixture.getAccountId())
    const executeSpy = jest
      .spyOn(UpdateChallengeUseCase.prototype, 'execute')
      .mockRejectedValue(new ConflictError('Desafios publicados não podem ser alterados'))
    const updatePayload = {
      ...challenge,
      description: 'Descrição válida',
      initialCode: 'escreva("olá")',
      categories: [ChallengeCategoriesFaker.fakeDto()],
    }

    const response = await request(honoFixture.server)
      .put(`/challenging/challenges/${challenge.id}`)
      .set(authFixture.getAuthorizationHeader())
      .send(updatePayload)

    expect(response.status).toBe(HTTP_STATUS_CODE.conflict)
    expect(response.body).toEqual({
      title: 'Erro de conflito',
      message: 'Desafios publicados não podem ser alterados',
    })
    executeSpy.mockRestore()
  })

  it('reports invalid roadmap associations through the injected telemetry port', () => {
    const telemetry: ChallengeRoadmapTelemetry = {
      trackInvalidAssociation: jest.fn(),
    }
    const associations = [
      { node_id: 'node-id', challenge_id: 'private-challenge-id', position: 1 },
    ] as unknown as Parameters<typeof filterValidChallengeRoadmapAssociations>[1]
    const challenges = [
      {
        id: 'private-challenge-id',
        is_public: false,
        star_id: null,
        categories: [{ id: 'category-id' }],
      },
    ] as unknown as Parameters<typeof filterValidChallengeRoadmapAssociations>[2]
    const nodes = [{ id: 'node-id', key: 'basico', category_id: 'category-id' }] as unknown as Parameters<
      typeof filterValidChallengeRoadmapAssociations
    >[0]

    expect(
      filterValidChallengeRoadmapAssociations(nodes, associations, challenges, telemetry),
    ).toEqual([])
    expect(telemetry.trackInvalidAssociation).toHaveBeenCalledWith({
      challengeId: 'private-challenge-id',
      nodeKey: 'basico',
    })
  })
})
