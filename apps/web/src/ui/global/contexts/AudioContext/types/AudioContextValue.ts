import type { AudioFile } from './AudioFile'

export type AudioContextValue = {
  isAudioDisabled: boolean
  playAudio: (audioFile: AudioFile) => void
  toggleAudioDisability: () => Promise<void>
}
