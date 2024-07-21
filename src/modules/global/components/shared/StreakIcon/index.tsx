'use client'

import { Animation } from '../Animation'

type StreakIconProps = {
  size: number
}

export function StreakIcon({ size }: StreakIconProps) {
  return <Animation name='streak' size={size} hasLoop={false} />
}
