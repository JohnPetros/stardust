import { ValidationError } from '#global/domain/errors/ValidationError'
import { StringValidation } from '#global/libs/index'

export type TextBlockAudioStatusValue =
  | 'idle'
  | 'pending'
  | 'error'
  | 'done'
  | 'cancelled'

export class TextBlockAudioStatus {
  private constructor(readonly value: TextBlockAudioStatusValue) {}

  static create(value?: string): TextBlockAudioStatus {
    if (!value) return new TextBlockAudioStatus('idle')

    if (!TextBlockAudioStatus.isTextBlockAudioStatusValue(value))
      throw new ValidationError([
        { name: 'audio status value', messages: ['Invalid value'] },
      ])

    return new TextBlockAudioStatus(value)
  }

  static createAsIdle(): TextBlockAudioStatus {
    return new TextBlockAudioStatus('idle')
  }

  static createAsPending(): TextBlockAudioStatus {
    return new TextBlockAudioStatus('pending')
  }

  static createAsDone(): TextBlockAudioStatus {
    return new TextBlockAudioStatus('done')
  }

  static createAsError(): TextBlockAudioStatus {
    return new TextBlockAudioStatus('error')
  }

  static createAsCancelled(): TextBlockAudioStatus {
    return new TextBlockAudioStatus('cancelled')
  }

  get isIdle(): boolean {
    return this.value === 'idle'
  }

  get isPending(): boolean {
    return this.value === 'pending'
  }

  get isDone(): boolean {
    return this.value === 'done'
  }

  get isError(): boolean {
    return this.value === 'error'
  }

  get isCancelled(): boolean {
    return this.value === 'cancelled'
  }

  private static isTextBlockAudioStatusValue(
    value: string,
  ): value is TextBlockAudioStatusValue {
    new StringValidation(value, 'Text block audio status value')
      .oneOf(['idle', 'pending', 'error', 'done', 'cancelled'])
      .validate()
    return true
  }
}
