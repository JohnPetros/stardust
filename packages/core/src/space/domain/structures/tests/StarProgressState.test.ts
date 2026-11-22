import { ValidationError } from '#global/domain/errors/ValidationError'
import { StarProgressState } from '../StarProgressState'

describe('StarProgressState Structure', () => {
  it('should be created from each valid value', () => {
    expect(StarProgressState.create('locked').value).toBe('locked')
    expect(StarProgressState.create('available').value).toBe('available')
    expect(StarProgressState.create('completed').value).toBe('completed')
  })

  it('should throw ValidationError for an invalid value', () => {
    expect(() => StarProgressState.create('opened')).toThrow(ValidationError)
    expect(() => StarProgressState.create('')).toThrow(ValidationError)
  })

  it('should answer each predicate only for its own value', () => {
    expect(StarProgressState.create('locked').isLocked.isTrue).toBe(true)
    expect(StarProgressState.create('available').isAvailable.isTrue).toBe(true)
    expect(StarProgressState.create('completed').isCompleted.isTrue).toBe(true)
    expect(StarProgressState.create('locked').isAvailable.isFalse).toBe(true)
  })

  it('should be accessible when available or completed', () => {
    expect(StarProgressState.create('locked').isAccessible.isFalse).toBe(true)
    expect(StarProgressState.create('available').isAccessible.isTrue).toBe(true)
    expect(StarProgressState.create('completed').isAccessible.isTrue).toBe(true)
  })
})
