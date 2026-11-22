import { ValidationError } from '#global/domain/errors/ValidationError'
import { PlanetProgressState } from '../PlanetProgressState'

describe('PlanetProgressState Structure', () => {
  it('should be created from each valid value', () => {
    expect(PlanetProgressState.create('locked').value).toBe('locked')
    expect(PlanetProgressState.create('liberated').value).toBe('liberated')
    expect(PlanetProgressState.create('opened').value).toBe('opened')
  })

  it('should throw ValidationError for an invalid value', () => {
    expect(() => PlanetProgressState.create('available')).toThrow(ValidationError)
    expect(() => PlanetProgressState.create('')).toThrow(ValidationError)
  })

  it('should answer each predicate only for its own value', () => {
    expect(PlanetProgressState.create('locked').isLocked.isTrue).toBe(true)
    expect(PlanetProgressState.create('liberated').isLiberated.isTrue).toBe(true)
    expect(PlanetProgressState.create('opened').isOpened.isTrue).toBe(true)
    expect(PlanetProgressState.create('opened').isLocked.isFalse).toBe(true)
  })
})
