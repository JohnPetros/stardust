import { type ForwardedRef, forwardRef, type InputHTMLAttributes } from 'react'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'

import { useSearch } from './useSearch'

type SearchProps = {
  className?: string
  onSearchChange: (...args: any[]) => void
}

const SearchComponent = (
  {
    id,
    className,
    onSearchChange,
    ...inputProps
  }: SearchProps & InputHTMLAttributes<HTMLInputElement>,
  ref: ForwardedRef<HTMLInputElement>,
) => {
  const { value, handleValueChange } = useSearch(onSearchChange)

  return (
    <label
      htmlFor={id}
      className={twMerge(
        'flex w-full items-center gap-1 rounded-md border-2 border-gray-400 bg-gray-700 p-2 brightness-95 focus-within:brightness-125',
        className,
      )}
    >
      <MagnifyingGlass className='text-gray-400' weight='bold' />
      <input
        ref={ref}
        id={id}
        role='textbox'
        type='search'
        className='w-full bg-transparent text-sm text-gray-300 outline-none placeholder:text-gray-400'
        value={value}
        onChange={({ target }) => handleValueChange(target.value)}
        {...inputProps}
      />
    </label>
  )
}

export const Search = forwardRef(SearchComponent)
