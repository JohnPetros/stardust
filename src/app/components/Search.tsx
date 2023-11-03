import { InputHTMLAttributes, useState } from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'

import { useDebounce } from '@/hooks/useDebounce'

interface SearchProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
  onSearchChange: (...args: any[]) => void  // eslint-disable-line
}

export function Search({ className, onSearchChange, ...rest }: SearchProps) {
  const [value, setValue] = useState('')
  const debouceChange = useDebounce(onSearchChange, 450)

  function handleValueChange(value: string) {
    setValue(value)
    debouceChange(value)
  }

  return (
    <label
      htmlFor="search"
      className={twMerge(
        'flex w-full items-center gap-1 rounded-md border-2 border-gray-400 bg-gray-700 p-2 brightness-95 focus-within:brightness-125',
        className
      )}
    >
      <MagnifyingGlass className="text-gray-400" weight="bold" />
      <input
        role="textbox"
        type="search"
        id="search"
        className="w-full bg-transparent text-sm text-gray-300 outline-none placeholder:text-gray-400"
        value={value}
        onChange={({ target }) => handleValueChange(target.value)}
        {...rest}
      />
    </label>
  )
}
