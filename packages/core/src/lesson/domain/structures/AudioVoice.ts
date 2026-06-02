import { ValidationError } from '#global/domain/errors/ValidationError'
import { StringValidation } from '#global/libs/index'

export type AudioVoiceValue =
  | 'panda'
  | 'shark'
  | 'princess'
  | 'alien'
  | 'robot'
  | 'salmonense'

export class AudioVoice {
  private constructor(readonly value: AudioVoiceValue) {}

  static create(value?: string): AudioVoice {
    if (!value) return new AudioVoice('panda')

    if (!AudioVoice.isAudioVoiceValue(value))
      throw new ValidationError([
        { name: 'audio voice value', messages: ['Invalid value'] },
      ])

    return new AudioVoice(value)
  }

  private static isAudioVoiceValue(name: string): name is AudioVoiceValue {
    new StringValidation(name)
      .oneOf(['panda', 'shark', 'princess', 'alien', 'robot', 'salmonense'])
      .validate()
    return true
  }
}
