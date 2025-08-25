import { useId } from 'react'
import { Root, Thumb } from '@radix-ui/react-switch'
import { twMerge } from 'tailwind-merge'

type Props = {
  label?: string
  name?: string
  value?: string
  isChecked?: boolean
  defaultChecked?: boolean
  isDisabled?: boolean
  className?: string
  onCheck: (isChecked: boolean) => void
}

export const SwitchView = ({
  onCheck,
  label,
  name,
  value,
  isChecked = false,
  defaultChecked = false,
  isDisabled = false,
  className,
}: Props) => {
  const id = useId()

  return (
    <div
      className={twMerge(
        'flex items-center justify-center gap-2 px-3 py-2 border border-gray-500 rounded-full',
        isDisabled ? 'pointer-events-none' : '',
        className,
      )}
    >
      {label && (
        <label
          htmlFor={id}
          className={twMerge(
            'cursor-pointer text-sm text-gray-100',
            isChecked ? 'opacity-1' : 'opacity-50',
          )}
        >
          {label}
        </label>
      )}

      <Root
        id={id}
        name={name}
        value={value}
        checked={isChecked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheck}
        className='h-4 w-8 rounded-lg bg-gray-600'
      >
        <Thumb
          className={twMerge(
            'block size-4 rounded-full transition-transform',
            isChecked ? 'translate-x-4 bg-green-400' : 'bg-green-800',
          )}
        />
      </Root>
    </div>
  )
}
