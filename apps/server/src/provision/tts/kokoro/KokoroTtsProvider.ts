import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import { KokoroTTS } from 'kokoro-js'

import { AppError } from '@stardust/core/global/errors'
import type { Text } from '@stardust/core/global/structures'
import type { AudioVoice } from '@stardust/core/lesson/structures'
import type { TtsProvider } from '@stardust/core/lesson/interfaces'

type KokoroVoice = 'af_heart' | 'am_fenrir' | 'af_bella'

export class KokoroTtsProvider implements TtsProvider {
  private static readonly MODEL_ID = 'onnx-community/Kokoro-82M-v1.0-ONNX'
  private static modelPromise?: Promise<KokoroTTS>

  async generate(text: Text, voice: AudioVoice): Promise<File> {
    const fileName = `${randomUUID()}.wav`
    const filePath = path.join(os.tmpdir(), fileName)

    try {
      const model = await KokoroTtsProvider.getModel()
      const audio = await model.generate(text.value, {
        voice: this.resolveVoice(voice),
      })

      await audio.save(filePath)
      const fileBuffer = await fs.readFile(filePath)

      return new File([new Uint8Array(fileBuffer)], fileName, {
        type: 'audio/wav',
        lastModified: Date.now(),
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      throw new AppError(`Falha ao gerar audio com Kokoro: ${message}`)
    } finally {
      await fs.unlink(filePath).catch(() => undefined)
    }
  }

  private resolveVoice(voice: AudioVoice): KokoroVoice {
    const voices = {
      panda: 'af_heart',
      shark: 'am_fenrir',
      princess: 'af_bella',
    } as const

    return voices[voice.value]
  }

  private static async getModel(): Promise<KokoroTTS> {
    if (!KokoroTtsProvider.modelPromise) {
      KokoroTtsProvider.modelPromise = KokoroTtsProvider.createModel()
    }

    try {
      return await KokoroTtsProvider.modelPromise
    } catch (error) {
      KokoroTtsProvider.modelPromise = undefined
      throw error
    }
  }

  private static async createModel(): Promise<KokoroTTS> {
    try {
      return await KokoroTTS.from_pretrained(KokoroTtsProvider.MODEL_ID, {
        device: 'cpu',
        dtype: 'q8',
      })
    } catch {
      return await KokoroTTS.from_pretrained(KokoroTtsProvider.MODEL_ID, {
        device: 'cpu',
        dtype: 'fp32',
      })
    }
  }
}
