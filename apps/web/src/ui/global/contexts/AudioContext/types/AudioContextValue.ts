import type { AudioFile } from './AudioFile'

export type AudioContextValue = {
  playAudio: (audioFile: AudioFile) => void
}
