import { MagnifyingGlass } from '@phosphor-icons/react'
import { InputHTMLAttributes } from 'react'

interface SearchProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Search({ ...rest }: SearchProps) {
  return (
    <label
      htmlFor="search"
      className="flex items-center gap-1 p-2 w-full bg-gray-700 border-2 border-gray-400 rounded-md brightness-95 focus-within:brightness-125"
    >
      <MagnifyingGlass className="text-gray-400" weight="bold" />
      <input
        type="search"
        id="search"
        className="bg-transparent text-gray-300 text-sm placeholder:text-gray-400 w-full outline-none"
        {...rest}
      />
    </label>
  )
}
