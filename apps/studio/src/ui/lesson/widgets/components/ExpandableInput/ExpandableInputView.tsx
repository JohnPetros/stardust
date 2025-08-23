import type { RefObject } from 'react'

type Props = {
  inputValue: string
  spanRef: RefObject<HTMLSpanElement | null>
  inputRef: RefObject<HTMLInputElement | null>
  placeholder?: string
  onValueChange?: (value: string) => void
  onBlur?: (value: string) => void
  className?: string
}

export const ExpandableInputView = ({
  inputValue,
  spanRef,
  inputRef,
  placeholder,
  className,
  onValueChange,
  onBlur,
}: Props) => {
  return (
    <div className='flex items-center'>
      <span ref={spanRef} className='absolute invisible whitespace-pre px-2'>
        {inputValue || placeholder || 'Digite...'}
      </span>

      <input
        ref={inputRef}
        value={inputValue}
        onChange={(e) => onValueChange?.(e.target.value)}
        onBlur={(e) => onBlur?.(e.target.value)}
        className={className}
      />
    </div>
  )
}
