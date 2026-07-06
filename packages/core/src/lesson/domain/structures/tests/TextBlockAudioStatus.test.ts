import { ValidationError } from '#global/domain/errors/ValidationError'

import { TextBlockAudioStatus } from '../TextBlockAudioStatus'

describe('TextBlockAudioStatus', () => {
  it('should default to idle when no value is provided', () => {
    const status = TextBlockAudioStatus.create()

    expect(status.value).toBe('idle')
    expect(status.isIdle).toBe(true)
  })

  it('should create all named statuses through factory helpers', () => {
    expect(TextBlockAudioStatus.createAsPending().isPending).toBe(true)
    expect(TextBlockAudioStatus.createAsDone().isDone).toBe(true)
    expect(TextBlockAudioStatus.createAsError().isError).toBe(true)
    expect(TextBlockAudioStatus.createAsCancelled().isCancelled).toBe(true)
  })

  it('should throw when value is invalid', () => {
    expect(() => TextBlockAudioStatus.create('invalid')).toThrow(ValidationError)
  })
})
