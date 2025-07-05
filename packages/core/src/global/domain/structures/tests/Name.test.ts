import { ValidationError } from '../../errors'
import { Name } from '../Name'
import { Text } from '../Text'

describe('Name Struct', () => {
  it('should not be created if its value is lower than 2 characters', () => {
    expect(() => Name.create('J')).toThrow(ValidationError)
  })

  it('should be created', () => {
    const nameValue = 'John Petros'
    const name = Name.create(nameValue)

    expect(name).toHaveProperty('value', nameValue)
  })

  it('should remove accentuation from its value', () => {
    const nameValue = 'João Estêvão Körbchen de Sá Glänzen'
    const name = Name.create(nameValue)

    const nameWithoutAccentuation = name.removeAccentuation()

    expect(nameWithoutAccentuation.value).toBe('Joao Estevao Korbchen de Sa Glanzen')
  })

  it('should return true if the given Text is contained within the Name value', () => {
    const name = Name.create('Leonel Sanches')

    expect(name.isLike(Text.create('Leonel Sanches')).isTrue).toBeTruthy()
    expect(name.isLike(Text.create('Sanches')).isTrue).toBeTruthy()
    expect(name.isLike(Text.create('Leonel')).isTrue).toBeTruthy()
    expect(name.isLike(Text.create('sanches')).isTrue).toBeTruthy()
    expect(name.isLike(Text.create('leonel')).isTrue).toBeTruthy()
    expect(name.isLike(Text.create('  Leonel   ')).isTrue).toBeTruthy()
    expect(name.isLike(Text.create('leOnEl sAnchEs')).isTrue).toBeTruthy()
    expect(name.isLike(Text.create('')).isFalse).toBeTruthy()
    expect(name.isLike(Text.create('Samuel')).isFalse).toBeTruthy()
    expect(name.isLike(Text.create('Leonel Sanchez')).isFalse).toBeTruthy()
  })

  it('should return true if given text is like the Name value', () => {
    const name = Name.create('Leonel Sanches')

    expect(name.isLike(Text.create('Sanches')).isTrue).toBeTruthy()
  })
})
