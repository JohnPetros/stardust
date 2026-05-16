import type { TextBlockDto } from '#global/domain/entities/dtos/TextBlockDto'

import { TextBlock } from '../TextBlock'
import { TextBlockAudio } from '../TextBlockAudio'

const makeAudioDto = () => ({
  fileName: 'story-audio.wav',
  voice: 'shark',
  status: 'done',
})

const makeDto = (overrides: Partial<TextBlockDto> = {}): TextBlockDto => ({
  type: 'default',
  content: 'Texto do bloco',
  title: 'Titulo',
  picture: 'image.png',
  isRunnable: false,
  ...overrides,
})

describe('TextBlock Structure', () => {
  it('should preserve audio when creating and serializing the block', () => {
    const dto = makeDto({ audio: makeAudioDto() })

    const textBlock = TextBlock.create(dto)

    expect(textBlock.audio?.dto).toEqual(dto.audio)
    expect(textBlock.dto).toEqual(dto)
  })

  it('should preserve audio when cloning through another setter', () => {
    const textBlock = TextBlock.create(makeDto({ audio: makeAudioDto() }))

    const updatedTextBlock = textBlock.setIsRunnable(true)

    expect(updatedTextBlock).not.toBe(textBlock)
    expect(updatedTextBlock.isRunnable.value).toBe(true)
    expect(updatedTextBlock.audio?.dto).toEqual(makeAudioDto())
    expect(textBlock.isRunnable.value).toBe(false)
    expect(textBlock.audio?.dto).toEqual(makeAudioDto())
  })

  it('should set audio by returning a new instance', () => {
    const textBlock = TextBlock.create(makeDto())
    const audio = TextBlockAudio.createAsPending(
      TextBlockAudio.create(makeAudioDto()).voice,
    )

    const updatedTextBlock = textBlock.setAudio(audio)

    expect(updatedTextBlock).not.toBe(textBlock)
    expect(updatedTextBlock.audio).toBe(audio)
    expect(updatedTextBlock.dto.audio).toEqual(audio.dto)
    expect(textBlock.audio).toBeUndefined()
  })
})
