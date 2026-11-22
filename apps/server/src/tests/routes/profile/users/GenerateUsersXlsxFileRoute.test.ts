import request from 'supertest'
import JSZip from 'jszip'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, NotGodAccountError } from '@stardust/core/global/errors'

import { ENV } from '@/constants'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SpaceFixture } from '@/tests/fixtures/SpaceFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /profile/users/xlsx', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const spaceFixture = new SpaceFixture(supabaseFixture.supabase)
  const profileFixture = new ProfileFixture(supabaseFixture.supabase)

  beforeAll(async () => {
    await honoFixture.setup()
  })

  beforeEach(async () => {
    ENV.godAccountIds = []
    await supabaseFixture.clearDatabase()
    await authFixture.createAccount()
  })

  it('should return 401 when not authenticated', async () => {
    const response = await request(honoFixture.server).get('/profile/users/xlsx')

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 401 when authenticated account is not a god account', async () => {
    const response = await request(honoFixture.server)
      .get('/profile/users/xlsx')
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new NotGodAccountError() }),
    )
  })

  it('should export the total of completed stars of the account for a god account', async () => {
    const accountId = authFixture.getAccountId()
    ENV.godAccountIds = [accountId]
    await profileFixture.createAccountUser(accountId)
    const stars = [await spaceFixture.createStar(), await spaceFixture.createStar()]
    for (const star of stars) await profileFixture.completeStar(accountId, star.id)

    const response = await request(honoFixture.server)
      .get('/profile/users/xlsx')
      .set(authFixture.getAuthorizationHeader())
      .buffer(true)
      .parse((res, callback) => {
        const chunks: Buffer[] = []
        res.on('data', (chunk: Buffer) => chunks.push(chunk))
        res.on('end', () => callback(null, Buffer.concat(chunks)))
      })

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    const zip = await JSZip.loadAsync(response.body as Buffer)
    const sheet = await zip.file('xl/worksheets/sheet1.xml')?.async('string')
    expect(sheet).toContain('Estrelas Concluídas')
    expect(sheet).not.toContain('Estrelas Desbloqueadas')
    expect(sheet).toMatch(/<v>2<\/v>/)
    await spaceFixture.cleanupCreatedStars(stars)
  })
})
