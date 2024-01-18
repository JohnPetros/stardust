'use client'

type Sound =
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

export function playSound(sound: Sound) {
  new Audio(`/sounds/${sound}`).play()
}
