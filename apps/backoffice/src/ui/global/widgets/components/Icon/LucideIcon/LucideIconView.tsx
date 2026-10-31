import type { ClassNameValue } from 'tailwind-merge'
import type { IconName } from '../types/IconName'
import { ICONS } from './icons'

type IconProps = {
  name: IconName
  className?: ClassNameValue
  size?: number
}

export const LucideIconView = ({ name, className, size = 24 }: IconProps) => {
  const lucideClassName = String(className)
  const Icon = ICONS[name]

  return <Icon className={lucideClassName} size={size} />
}
