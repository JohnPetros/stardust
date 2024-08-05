import type { ClassNameValue } from 'tailwind-merge'

import type { IconName } from '../types/IconName'

import { ICONS } from './icons'

type IconProps = {
  name: IconName
  className?: ClassNameValue
  weight?: 'normal' | 'bold'
  size?: number
}

export function PhosphorIcon({ name, className, weight = 'bold', size = 24 }: IconProps) {
  const phosphorClassName = String(className)
  const phosphorWeight = weight === 'normal' ? 'regular' : 'bold'
  const Icon = ICONS[name]

  return (
    <Icon
      className={phosphorClassName}
      width={size}
      height={size}
      weight={phosphorWeight}
    />
  )
}
