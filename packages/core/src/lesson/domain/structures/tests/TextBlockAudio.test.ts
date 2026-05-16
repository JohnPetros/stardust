import { AudioVoice } from '../AudioVoice'
import { TextBlockAudio } from '../TextBlockAudio'

describe('TextBlockAudio Structure', () => {
  it('should create audio with cancelled status', () => {
    const textBlockAudio = TextBlockAudio.create({
      fileName: 'audio.wav',
      voice: 'princess',
      status: 'cancelled',
    })

    expect(textBlockAudio.status).toBe('cancelled')
    expect(textBlockAudio.isCancelled).toBe(true)
    expect(textBlockAudio.dto).toEqual({
      fileName: 'audio.wav',
      voice: 'princess',
      status: 'cancelled',
    })
  })

  it('should mark pending audio as cancelled without mutating the original instance', () => {
    const pendingAudio = TextBlockAudio.createAsPending(AudioVoice.create('panda'))

    const cancelledAudio = pendingAudio.markAsCancelled()

    expect(cancelledAudio).not.toBe(pendingAudio)
    expect(cancelledAudio.isCancelled).toBe(true)
    expect(cancelledAudio.status).toBe('cancelled')
    expect(cancelledAudio.voice.value).toBe('panda')
    expect(pendingAudio.isPending).toBe(true)
    expect(pendingAudio.isCancelled).toBe(false)
  })
})
