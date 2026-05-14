import type { TextBlockAudioDto } from '#global/domain/entities/dtos/TextBlockAudioDto'
import { Text } from '#global/domain/structures/Text'
import { StringValidation } from '#global/libs/index'
import { AudioVoice } from './AudioVoice'

export type TextBlockAudioStatus = 'idle' | 'pending' | 'error' | 'done'

type TextBlockAudioProps = {
  fileName: Text
  voice: AudioVoice
  status: TextBlockAudioStatus
}

export class TextBlockAudio {
  readonly fileName: Text
  readonly voice: AudioVoice
  readonly status: TextBlockAudioStatus

  private constructor(props: TextBlockAudioProps) {
    this.fileName = props.fileName
    this.voice = props.voice
    this.status = props.status
  }

  static create(dto: TextBlockAudioDto): TextBlockAudio {
    return new TextBlockAudio({
      fileName: Text.create(dto.fileName),
      voice: AudioVoice.create(dto.voice),
      status: TextBlockAudio.parseStatus(dto.status),
    })
  }

  static createAsPending(voice: AudioVoice): TextBlockAudio {
    return new TextBlockAudio({
      fileName: Text.create(''),
      voice,
      status: 'pending',
    })
  }

  markAsDone(fileName: string): TextBlockAudio {
    return this.clone({
      fileName: Text.create(fileName),
      status: 'done',
    })
  }

  markAsError(): TextBlockAudio {
    return this.clone({ status: 'error' })
  }

  get isPending(): boolean {
    return this.status === 'pending'
  }

  get isDone(): boolean {
    return this.status === 'done'
  }

  get dto(): TextBlockAudioDto {
    return {
      fileName: this.fileName.value,
      voice: this.voice.value,
      status: this.status,
    }
  }

  private static parseStatus(value: string): TextBlockAudioStatus {
    new StringValidation(value, 'Audio status')
      .oneOf(['idle', 'pending', 'error', 'done'])
      .validate()
    return value as TextBlockAudioStatus
  }

  private clone(props?: Partial<TextBlockAudioProps>): TextBlockAudio {
    return new TextBlockAudio({
      fileName: this.fileName,
      voice: this.voice,
      status: this.status,
      ...props,
    })
  }
}
