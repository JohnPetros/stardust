type Props = {
  value: string
  onChange: (value: string) => void
  onBlur: (value: string) => void
}

export const TextInputView = ({ value, onChange, onBlur }: Props) => {
  return (
    <input
      value={value}
      size={value.length || 1}
      onBlur={(event) => onBlur(event.target.value)}
      onChange={(event) => onChange(event.target.value)}
      className='group-hover:border-green-400 transition-colors duration-300 text-sm outline-none border-b border-dashed border-zinc-200 text-zinc-200 px-2'
    />
  )
}
