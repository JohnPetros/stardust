import * as Checkbox from '@radix-ui/react-checkbox'
import { type ClassNameValue, twMerge } from 'tailwind-merge'

import { AnimatedIndicator } from './AnimatedIndicator'
import { Icon } from '../Icon'

type Props = {
  id: string
  isChecked?: boolean
  className?: ClassNameValue
  onChange?: (isChecked: boolean) => void
}

export const CheckboxView = ({ id, isChecked, className, onChange }: Props) => {
  return (
    <Checkbox.Root
      className={twMerge(
        'h-[18px] w-[18px] rounded-md border-2 border-green-400',
        isChecked ? 'bg-green-400' : ' border-gray-500 bg-transparent',
        className,
      )}
      id={id}
      checked={isChecked}
      onCheckedChange={() => onChange?.(!isChecked)}
    >
      <AnimatedIndicator>
        <Icon name='check' size={14} className='text-green-900' weight='bold' />
      </AnimatedIndicator>
    </Checkbox.Root>
  )
}
