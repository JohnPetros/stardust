import { randomUUID } from 'node:crypto'

import { HTTP_HEADERS } from '@stardust/core/global/constants'
import { AppError } from '@stardust/core/global/errors'
import { Text } from '@stardust/core/global/structures'
import type { AudioVoice } from '@stardust/core/lesson/structures'
import type { TtsProvider } from '@stardust/core/lesson/interfaces'

import { ENV } from '@/constants'

type OpenRouterCharacterVoice = {
  [key in AudioVoice['value']]: {
    voice: string
    instructions: string
  }
}

export class OpenRouterElevenLabsTtsProvider implements TtsProvider {
  private static readonly BASE_URL = 'https://openrouter.ai/api/v1/audio/speech'
  private static readonly MODEL = 'elevenlabs/eleven-turbo-v2'
  private static readonly CHARACTER_VOICES: OpenRouterCharacterVoice = {
    panda: {
      voice: 'RGbeQtiShYRDVCrd9b9w',
      instructions:
        'Fale em português do Brasil com voz masculina jovem, fofa, animada, gentil e amigável. Soe como um panda infantil acolhedor de desenho animado. Fale com energia leve e ritmo um pouco acelerado, mantendo a pronúncia clara.',
    },
    shark: {
      voice: 'RGbeQtiShYRDVCrd9b9w',
      instructions:
        'Fale em português do Brasil com voz masculina grave, irônica, provocadora, agressiva de forma cartunesca e confiante. Soe como um tubarão vilão de desenho animado, debochado e teatral, mas ainda divertido.',
    },
    princess: {
      voice: 'RGbeQtiShYRDVCrd9b9w',
      instructions:
        'Fale em português do Brasil com voz feminina doce, alegre, encantadora e mágica. Soe como uma princesa de desenho infantil, com tom delicado, expressivo e acolhedor.',
    },
  }

  async generate(text: Text, voice: AudioVoice): Promise<File> {
    const apiKey = this.getApiKey()
    const characterVoice = this.resolveVoice(voice)
    const input = this.buildInput(text, characterVoice)

    try {
      const response = await fetch(OpenRouterElevenLabsTtsProvider.BASE_URL, {
        method: 'POST',
        headers: {
          [HTTP_HEADERS.authorization]: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: OpenRouterElevenLabsTtsProvider.MODEL,
          voice: characterVoice.voice,
          input,
          response_format: 'mp3',
        }),
      })

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
      throw new AppError(`Falha ao gerar áudio com OpenRouter ElevenLabs: ${message}`)
    }
  }

  private getApiKey(): string {
    if (!ENV.openrouterApiKey) {
      throw new AppError('OPENROUTER_API_KEY não configurada para o provider de TTS')
    }

    return ENV.openrouterApiKey
  }

  private resolveVoice(voice: AudioVoice): OpenRouterCharacterVoice[AudioVoice['value']] {
    const characterVoice = OpenRouterElevenLabsTtsProvider.CHARACTER_VOICES[voice.value]

    if (!characterVoice) {
      throw new AppError(`Voz de personagem não suportada: ${voice.value}`)
    }

    return characterVoice
  }

  private buildInput(
    text: Text,
    characterVoice: OpenRouterCharacterVoice[AudioVoice['value']],
  ): string {
    return [
      `Estilo da voz: ${characterVoice.instructions}`,
      '',
      `Texto para falar: ${text.value}`,
    ].join('\n')
  }

  private async buildErrorMessage(response: Response): Promise<string> {
    const statusMessage = `OpenRouter returned ${response.status} ${response.statusText}`

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
