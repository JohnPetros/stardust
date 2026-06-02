import { randomUUID } from 'node:crypto'

import { AppError } from '@stardust/core/global/errors'
import type { Text } from '@stardust/core/global/structures'
import type { AudioVoice } from '@stardust/core/lesson/structures'
import type { TtsProvider } from '@stardust/core/lesson/interfaces'

import { ENV } from '@/constants'

type ElevenLabsCharacterVoice = {
  [key in AudioVoice['value']]: {
    voice: string
    voiceSettings: {
      stability: number
      similarity_boost: number
      style: number
      use_speaker_boost: boolean
    }
  }
}

export class ElevenLabsTtsProvider implements TtsProvider {
  private static readonly BASE_URL = 'https://api.elevenlabs.io/v1/text-to-speech'
  private static readonly MODEL = 'eleven_multilingual_v2'
  private static readonly OUTPUT_FORMAT = 'mp3_44100_128'
  private static readonly CHARACTER_VOICES: ElevenLabsCharacterVoice = {
    panda: {
      voice: 'RGbeQtiShYRDVCrd9b9w',
      voiceSettings: {
        stability: 0.35,
        similarity_boost: 0.65,
        style: 0.6,
        use_speaker_boost: true,
      },
    },
    shark: {
      voice: 'RGbeQtiShYRDVCrd9b9w',
      voiceSettings: {
        stability: 0.4,
        similarity_boost: 0.7,
        style: 0.75,
        use_speaker_boost: true,
      },
    },
    princess: {
      voice: 'RGbeQtiShYRDVCrd9b9w',
      voiceSettings: {
        stability: 0.3,
        similarity_boost: 0.65,
        style: 0.8,
        use_speaker_boost: true,
      },
    },
    alien: {
      voice: 'RGbeQtiShYRDVCrd9b9w',
      voiceSettings: {
        stability: 0.45,
        similarity_boost: 0.7,
        style: 0.75,
        use_speaker_boost: true,
      },
    },
    robot: {
      voice: 'RGbeQtiShYRDVCrd9b9w',
      voiceSettings: {
        stability: 0.55,
        similarity_boost: 0.65,
        style: 0.4,
        use_speaker_boost: true,
      },
    },
    salmonense: {
      voice: 'RGbeQtiShYRDVCrd9b9w',
      voiceSettings: {
        stability: 0.3,
        similarity_boost: 0.75,
        style: 0.85,
        use_speaker_boost: true,
      },
    },
  }

  async generate(text: Text, voice: AudioVoice): Promise<File> {
    const apiKey = this.getApiKey()
    const characterVoice = this.resolveVoice(voice)

    try {
      const response = await fetch(
        `${ElevenLabsTtsProvider.BASE_URL}/${characterVoice.voice}?output_format=${ElevenLabsTtsProvider.OUTPUT_FORMAT}`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': apiKey,
            'Content-Type': 'application/json',
            Accept: 'audio/mpeg',
          },
          body: JSON.stringify({
            model_id: ElevenLabsTtsProvider.MODEL,
            text: text.value,
            voice_settings: characterVoice.voiceSettings,
          }),
        },
      )

      if (!response.ok) {
        throw new AppError(await this.buildErrorMessage(response))
      }

      const fileBuffer = await response.arrayBuffer()
      const fileName = `${randomUUID()}.mp3`

      return new File([new Uint8Array(fileBuffer)], fileName, {
        type: 'audio/mpeg',
        lastModified: Date.now(),
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new AppError(`Falha ao gerar áudio com ElevenLabs: ${message}`)
    }
  }

  private getApiKey(): string {
    if (!ENV.elevenLabsApiKey) {
      throw new AppError('ELEVEN_LABS_API_KEY não configurada para o provider de TTS')
    }

    return ENV.elevenLabsApiKey
  }

  private resolveVoice(voice: AudioVoice): ElevenLabsCharacterVoice[AudioVoice['value']] {
    const characterVoice = ElevenLabsTtsProvider.CHARACTER_VOICES[voice.value]

    if (!characterVoice) {
      throw new AppError(`Voz de personagem não suportada: ${voice.value}`)
    }

    return characterVoice
  }

  private async buildErrorMessage(response: Response): Promise<string> {
    const statusMessage = `ElevenLabs returned ${response.status} ${response.statusText}`

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
