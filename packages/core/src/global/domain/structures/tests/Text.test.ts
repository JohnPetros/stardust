import { ValidationError } from '../../errors'
import { Text } from '../Text'

describe('Text Struct', () => {
  it('should be created if its value is a valid string', () => {
    expect(() => Text.create('JP')).not.toThrow()
    expect(() => Text.create('')).not.toThrow()
    expect(() => Text.create(false as unknown as string)).toThrow(ValidationError)
  })

  it('should count the caracters within the Text value', () => {
    expect(Text.create('Leonel Sanches da Silva').countCharacters('a').value).toBe(3)
    expect(Text.create('Leonel Sanches da Silva').countCharacters('e').value).toBe(3)
    expect(Text.create('Leonel Sanches da Silva').countCharacters('S').value).toBe(2)
    expect(Text.create('Leonel Sanches da Silva').countCharacters(' ').value).toBe(3)
    expect(Text.create('Leonel Sanches da Silva').countCharacters('l').value).toBe(2)
    expect(Text.create('Leonel Sanches da Silva').countCharacters('z').value).toBe(0)
    expect(Text.create('').countCharacters('a').value).toBe(0)
    expect(Text.create('aaaa').countCharacters('a').value).toBe(4)
    expect(Text.create('abc abc abc').countCharacters('c').value).toBe(3)
  })
})
