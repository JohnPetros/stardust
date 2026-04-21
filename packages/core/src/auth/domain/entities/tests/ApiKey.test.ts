import { Id } from '#global/domain/structures/Id'
import { ApiKeysFaker } from '../fakers/ApiKeysFaker'

describe('ApiKey Entity', () => {
  it('should rename the api key', () => {
    const apiKey = ApiKeysFaker.fake({ name: 'Chave antiga' })

    apiKey.rename('Chave nova')

    expect(apiKey.name.value).toBe('Chave nova')
  })

  it('should revoke the api key', () => {
    const apiKey = ApiKeysFaker.fake({ revokedAt: undefined })
    const revokedAt = new Date('2026-04-18T10:00:00.000Z')

    apiKey.revoke(revokedAt)

    expect(apiKey.revokedAt).toEqual(revokedAt)
    expect(apiKey.isRevoked.isTrue).toBe(true)
  })

  it('should tell when the api key belongs to the user', () => {
    const userId = Id.create()
    const apiKey = ApiKeysFaker.fake({ userId: userId.value })

    expect(apiKey.belongsToUser(userId).isTrue).toBe(true)
    expect(apiKey.belongsToUser(Id.create()).isFalse).toBe(true)
  })

  it('should return the api key dto', () => {
    const dto = ApiKeysFaker.fakeDto({
      revokedAt: new Date('2026-04-18T12:00:00.000Z'),
    })
    const apiKey = ApiKeysFaker.fake(dto)

    expect(apiKey.dto).toEqual(dto)
  })
})
