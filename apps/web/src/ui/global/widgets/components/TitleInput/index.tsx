import { twMerge, type ClassNameValue } from 'tailwind-merge'
import { ErrorMessage } from '../ErrorMessage'

type TitleInputProps = {
  value: string
  placeholder?: string
  errorMessage?: string
  className?: ClassNameValue
  onChange: (value: string) => void
}

export function TitleInput({
  value,
  placeholder,
  className,
  errorMessage,
  onChange,
}: TitleInputProps) {
  return (
    <div>
      <input
        type='text'
        value={value}
        placeholder={placeholder}
        onChange={({ currentTarget }) => onChange(currentTarget.value)}
        className={twMerge('text-xl outline-none border-none w-full', className)}
      />
      {errorMessage && <ErrorMessage className='mt-3'>{errorMessage}</ErrorMessage>}
    </div>
  )
}
