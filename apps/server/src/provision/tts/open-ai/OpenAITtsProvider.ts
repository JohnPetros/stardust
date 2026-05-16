import { randomUUID } from 'node:crypto'

import { AppError } from '@stardust/core/global/errors'
import { Text } from '@stardust/core/global/structures'
import type { AudioVoice } from '@stardust/core/lesson/structures'
import type { TtsProvider } from '@stardust/core/lesson/interfaces'

import { ENV } from '@/constants'

type OpenAICharacterVoice = {
  [key in AudioVoice['value']]: {
    voice: 'fable' | 'onyx' | 'nova'
    instructions: string
  }
}

export class OpenAITtsProvider implements TtsProvider {
  private static readonly BASE_URL = 'https://api.openai.com/v1/audio/speech'
  private static readonly MODEL = 'gpt-4o-mini-tts'
  private static readonly CHARACTER_VOICES: OpenAICharacterVoice = {
    panda: {
      voice: 'fable',
      instructions:
        "Speak Brazilian Portuguese with a childish, sweet, cute, and curious voice. Speak a little faster, with lively energy of a children's character, but keep the pronunciation clear. Do not sound like an adult.",
    },
    shark: {
      voice: 'onyx',
      instructions:
        'Speak Brazilian Portuguese with a deep, rough, masculine voice. Be sarcastic, aggressive, arrogant, and mocking, like a cartoon shark villain who loves teasing others. Keep it playful and exaggerated, not realistic. Add a confident villain energy, slightly faster pacing, and a sharp ironic tone.',
    },
    princess: {
      voice: 'nova',
      instructions:
        "Speak Brazilian Portuguese with a sweet, cheerful, charming, and magical feminine voice. Sound like a princess from a children's cartoon.",
    },
  }

  async generate(text: Text, voice: AudioVoice): Promise<File> {
    const apiKey = this.getApiKey()
    const characterVoice = this.resolveVoice(voice)

    try {
      const response = await fetch(OpenAITtsProvider.BASE_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: OpenAITtsProvider.MODEL,
          voice: characterVoice.voice,
          input: text.value,
          format: 'wav',
          instructions: characterVoice.instructions,
        }),
      })

      if (!response.ok) {
        throw new AppError(await this.buildErrorMessage(response))
      }

      const fileBuffer = await response.arrayBuffer()
      const fileName = `${randomUUID()}.wav`

      return new File([new Uint8Array(fileBuffer)], fileName, {
        type: 'audio/wav',
        lastModified: Date.now(),
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new AppError(`Falha ao gerar audio com OpenAI TTS: ${message}`)
    }
  }

  private getApiKey(): string {
    if (!ENV.openaiApiKey) {
      throw new AppError('OPENAI_API_KEY nao configurada para o provider de TTS')
    }

    return ENV.openaiApiKey
  }

  private resolveVoice(voice: AudioVoice): OpenAICharacterVoice[AudioVoice['value']] {
    return OpenAITtsProvider.CHARACTER_VOICES[voice.value]
  }

  private async buildErrorMessage(response: Response): Promise<string> {
    const statusMessage = `OpenAI returned ${response.status} ${response.statusText}`

    try {
      const data = (await response.clone().json()) as Record<string, unknown>
      const error = data.error

      if (error && typeof error === 'object' && 'message' in error) {
        const message = error.message
        if (typeof message === 'string' && message.length > 0) {
          return `${statusMessage}. ${message}`
        }
      }
    } catch {}

    try {
      const text = await response.clone().text()
      if (text) {
        return `${statusMessage}. ${text}`
      }
    } catch {}

    return statusMessage
  }
}
