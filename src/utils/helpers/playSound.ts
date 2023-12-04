'use client'

export function playSound(sound: string) {
  new Audio(`/sounds/${sound}`).play()
}
