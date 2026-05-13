import type { Text } from '#global/domain/entities/Text'
import type { AudioVoice } from '#lesson/domain/structures/AudioVoice'

export interface TtsProvider {
  generate(text: Text, voice: AudioVoice): Promise<File>
}
