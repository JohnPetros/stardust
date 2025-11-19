export type AudioContextValue = {
  isAudioDisabled: boolean
  playAudio: (audioFile: string) => void
  toggleAudioDisability: () => Promise<void>
}
