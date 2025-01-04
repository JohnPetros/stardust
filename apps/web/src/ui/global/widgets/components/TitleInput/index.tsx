import { twMerge, type ClassNameValue } from 'tailwind-merge'

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
  erroMessage,
  onChange,
}: TitleInputProps) {
  return (
    <div>
      <input
        type='text'
        value={value}
        placeholder={placeholder}
        onChange={({ currentTarget }) => onChange(currentTarget.value)}
        className={twMerge('bg-tranparent text-xl', className)}
      />
      <p className='text-red-700 font-bold mt-3'>{erroMessage}</p>
    </div>
  )
}
