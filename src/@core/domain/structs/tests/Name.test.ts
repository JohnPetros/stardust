import { ValidationError } from '@/@core/errors/lib'
import { Name } from '../Name'

describe('Name Struct', () => {
  it('should not be created if its value is lower than 3 characters', () => {
    expect(() => {
      Name.create('Jo')
    }).toThrow(ValidationError)
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
})
