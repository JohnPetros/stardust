'use client'

export type AudioFile =
  | 'asking.wav'
  | 'crying.wav'
  | 'denying.wav'
  | 'end.mp3'
  | 'star.wav'
  | 'success.wav'
  | 'switch.wav'
  | 'earning.wav'
  | 'fail.wav'
  | 'running-code.wav'

export function useAudio(audioFile: AudioFile | null) {
  if (!audioFile) return null

  const audio = new Audio(`/audios/${audioFile}`)

  function play() {
    audio
  }

  return {
    play,
  }
}
