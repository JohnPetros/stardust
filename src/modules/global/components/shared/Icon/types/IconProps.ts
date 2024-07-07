import { ClassNameValue } from 'tailwind-merge'
import { IconName } from './IconName'

export type IconProps = {
  name: IconName
  className?: ClassNameValue
  weight?: 'normal' | 'bold'
  size?: number
}
