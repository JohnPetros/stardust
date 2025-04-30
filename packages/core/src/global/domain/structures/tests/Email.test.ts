import { ValidationError } from '../../errors'
import { Email } from '../Email'

describe('Email structure', () => {
  it('should be created from a valid email value', () => {
    expect(() => Email.create('leonel@gmail.com')).not.toThrow()
    expect(() => Email.create('leonelgmailcom')).toThrow(ValidationError)
    expect(() => Email.create('test@domain.com')).not.toThrow()
    expect(() => Email.create('user.name@sub.domain.com')).not.toThrow(ValidationError)

    expect(() => Email.create('user@domain')).toThrow(ValidationError)
    expect(() => Email.create('user@.com')).toThrow(ValidationError)
    expect(() => Email.create('@domain.com')).toThrow(ValidationError)
    expect(() => Email.create('user@domain.c')).toThrow(ValidationError)
    expect(() => Email.create('user@domain..com')).toThrow(ValidationError)
    expect(() => Email.create('user@domain.com.')).toThrow(ValidationError)
    expect(() => Email.create('user@domain.123')).toThrow(ValidationError)
    expect(() => Email.create('user@domain@domain.com')).toThrow(ValidationError)
  })
})
