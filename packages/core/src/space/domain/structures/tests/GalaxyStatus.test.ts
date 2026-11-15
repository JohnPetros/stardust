import { ValidationError } from '#global/domain/errors/ValidationError'
import { GalaxyStatus } from '../GalaxyStatus'

describe('GalaxyStatus Structure', () => {
  it('should be created from each valid status value', () => {
    expect(GalaxyStatus.create('published').value).toBe('published')
    expect(GalaxyStatus.create('announced').value).toBe('announced')
    expect(GalaxyStatus.create('unpublished').value).toBe('unpublished')
  })

  it('should throw ValidationError for an invalid status value', () => {
    expect(() => GalaxyStatus.create('draft')).toThrow(ValidationError)
    expect(() => GalaxyStatus.create('')).toThrow(ValidationError)
  })

  it('should create each status by its dedicated factory method', () => {
    expect(GalaxyStatus.createAsPublished().value).toBe('published')
    expect(GalaxyStatus.createAsAnnounced().value).toBe('announced')
    expect(GalaxyStatus.createAsUnpublished().value).toBe('unpublished')
  })

  it('should be published only when the status is published', () => {
    expect(GalaxyStatus.createAsPublished().isPublished.isTrue).toBe(true)
    expect(GalaxyStatus.createAsAnnounced().isPublished.isFalse).toBe(true)
    expect(GalaxyStatus.createAsUnpublished().isPublished.isFalse).toBe(true)
  })

  it('should be announced only when the status is announced', () => {
    expect(GalaxyStatus.createAsAnnounced().isAnnounced.isTrue).toBe(true)
    expect(GalaxyStatus.createAsPublished().isAnnounced.isFalse).toBe(true)
    expect(GalaxyStatus.createAsUnpublished().isAnnounced.isFalse).toBe(true)
  })

  it('should be visible when the status is published or announced', () => {
    expect(GalaxyStatus.createAsPublished().isVisible.isTrue).toBe(true)
    expect(GalaxyStatus.createAsAnnounced().isVisible.isTrue).toBe(true)
    expect(GalaxyStatus.createAsUnpublished().isVisible.isFalse).toBe(true)
  })
})
