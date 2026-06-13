import { Id, Text } from '#global/domain/structures/index'
import { ValidationError } from '#global/domain/errors/index'
import { AnalyticsEvent } from '../AnalyticsEvent'

describe('Analytics Event Structure', () => {
  it('should be created from a valid dto', () => {
    const dto = {
      name: 'profile/user.rewarded',
      distinctId: Id.create().value,
      insertId: 'event-id',
      properties: { xp: 100 },
    }

    const analyticsEvent = AnalyticsEvent.create(dto)

    expect(analyticsEvent.name).toBeInstanceOf(Text)
    expect(analyticsEvent.insertId).toBeInstanceOf(Text)
    expect(analyticsEvent.properties).toEqual(dto.properties)
  })

  it('should convert to dto', () => {
    const dto = {
      name: 'profile/challenge.completed',
      distinctId: Id.create().value,
      insertId: 'insert-id',
      properties: { challengeId: Id.create().value },
    }

    const analyticsEvent = AnalyticsEvent.create(dto)

    expect(analyticsEvent.dto).toEqual(dto)
  })

  it('should create the distinct id as Id when it is an uuid', () => {
    const distinctId = Id.create().value

    const analyticsEvent = AnalyticsEvent.create({
      name: 'auth/account.signed.in',
      distinctId,
      insertId: 'insert-id',
      properties: {},
    })

    expect(analyticsEvent.distinctId).toBeInstanceOf(Id)
    expect(analyticsEvent.distinctId.value).toBe(distinctId)
  })

  it('should create the distinct id as Text when it is not an uuid', () => {
    const distinctId = 'user-slug'

    const analyticsEvent = AnalyticsEvent.create({
      name: 'space/planet.completed',
      distinctId,
      insertId: 'insert-id',
      properties: {},
    })

    expect(analyticsEvent.distinctId).toBeInstanceOf(Text)
    expect(analyticsEvent.distinctId.value).toBe(distinctId)
  })

  it('should validate required text fields', () => {
    expect(() =>
      AnalyticsEvent.create({
        name: undefined as unknown as string,
        distinctId: Id.create().value,
        insertId: 'insert-id',
        properties: {},
      }),
    ).toThrow(ValidationError)

    expect(() =>
      AnalyticsEvent.create({
        name: 'profile/user.rewarded',
        distinctId: Id.create().value,
        insertId: undefined as unknown as string,
        properties: {},
      }),
    ).toThrow(ValidationError)
  })
})
