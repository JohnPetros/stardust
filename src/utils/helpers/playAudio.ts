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

export function playAudio(audioFile: AudioFile) {
  new Audio(`/audios/${audioFile}`).play()
}
