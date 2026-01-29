import type { ClassNameValue } from 'tailwind-merge'
import type { IconName } from '../types/IconName'
import { ICONS } from './icons'

type IconWeight = 'regular' | 'bold' | 'fill' | 'light' | 'thin' | 'duotone'

type IconProps = {
  name: IconName
  className?: ClassNameValue
  weight?: IconWeight
  size?: number
}

export const PhosphorIconView = ({
  name,
  className,
  weight = 'bold',
  size = 24,
}: IconProps) => {
  const phosphorClassName = String(className)
  const Icon = ICONS[name]

  return <Icon className={phosphorClassName} width={size} height={size} weight={weight} />
}
