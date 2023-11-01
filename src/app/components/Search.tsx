import { InputHTMLAttributes } from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'

interface SearchProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string
}

export function Search({ className, ...rest }: SearchProps) {
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
        {...rest}
      />
    </label>
  )
}
