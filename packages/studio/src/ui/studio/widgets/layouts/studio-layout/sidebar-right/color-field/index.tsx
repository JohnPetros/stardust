import { useEffect, useRef } from 'react'
import { hexToRgb, rgbToHex } from '../color-hex'

export type ColorFieldProps = {
  label: string
  value: [number, number, number, number]
  onChange(value: [number, number, number, number]): void
  onCommit(): void
}

export const ColorField = ({ label, value, onChange, onCommit }: ColorFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const hex = rgbToHex(value)

  // React's onChange fires on every picker movement (live preview); the native
  // change event fires once the pick is done, which is when the source is saved.
  const latestCommit = useRef(onCommit)
  latestCommit.current = onCommit
  useEffect(() => {
    const input = inputRef.current
    if (!input) return
    const handleNativeChange = () => latestCommit.current()
    input.addEventListener('change', handleNativeChange)
    return () => input.removeEventListener('change', handleNativeChange)
  }, [])

  return (
    // The native picker is overlaid transparently so the whole field opens it.
    <label className='relative flex h-7 flex-1 cursor-pointer select-none items-center gap-2 overflow-hidden rounded-md bg-input p-1 focus-ring'>
      <span className='size-5 shrink-0 rounded-sm' style={{ backgroundColor: hex }} />
      <span className='text-xxs uppercase text-foreground'>{hex.replace('#', '')}</span>
      <input
        ref={inputRef}
        type='color'
        value={hex}
        onChange={(e) => {
          const [r, g, b] = hexToRgb(e.target.value)
          onChange([r, g, b, value[3]])
        }}
        onBlur={onCommit}
        className='absolute inset-0 h-full w-full cursor-pointer opacity-0'
        aria-label={label}
      />
    </label>
  )
}
