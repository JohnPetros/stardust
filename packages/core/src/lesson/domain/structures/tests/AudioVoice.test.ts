import { ValidationError } from '#global/domain/errors/ValidationError'

import { AudioVoice } from '../AudioVoice'

describe('AudioVoice Structure', () => {
  it.each(['alien', 'robot', 'salmonense'] as const)(
    'should create the %s voice',
    (value) => {
      expect(AudioVoice.create(value).value).toBe(value)
    },
  )

  it('should throw validation error for invalid voices', () => {
    expect(() => AudioVoice.create('unknown')).toThrow(ValidationError)
  })
})
