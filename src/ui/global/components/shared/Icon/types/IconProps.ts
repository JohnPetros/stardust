import type { ClassNameValue } from 'tailwind-merge'
import type { IconName } from './IconName'

export type IconProps = {
  name: IconName
  className?: ClassNameValue
  weight?: 'normal' | 'bold'
  size?: number
}
