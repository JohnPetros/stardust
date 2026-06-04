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

  it('should remove audio preserving the other fields and serialize dto without audio', () => {
    const dto = makeDto({ audio: makeAudioDto() })

    const textBlock = TextBlock.create(dto)
    const updatedTextBlock = textBlock.removeAudio()

    expect(updatedTextBlock).not.toBe(textBlock)
    expect(updatedTextBlock.audio).toBeUndefined()
    expect(updatedTextBlock.type).toBe(textBlock.type)
    expect(updatedTextBlock.content).toBe(textBlock.content)
    expect(updatedTextBlock.title?.value).toBe(textBlock.title?.value)
    expect(updatedTextBlock.picture?.value).toBe(textBlock.picture?.value)
    expect(updatedTextBlock.isRunnable.value).toBe(textBlock.isRunnable.value)
    expect(updatedTextBlock.dto).toEqual(makeDto())
    expect(updatedTextBlock.dto).not.toHaveProperty('audio')
    expect(textBlock.audio?.dto).toEqual(makeAudioDto())
  })

  it('should allow audio for image blocks and keep non eligible blocks disabled', () => {
    const imageBlock = TextBlock.create(makeDto({ type: 'image' }))
    const userBlock = TextBlock.create(makeDto({ type: 'user', picture: undefined }))

    expect(imageBlock.canHaveAudio.value).toBe(true)
    expect(userBlock.canHaveAudio.value).toBe(false)
  })
})
