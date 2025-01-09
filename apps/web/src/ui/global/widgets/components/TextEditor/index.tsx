import {
  type ForwardedRef,
  forwardRef,
  useImperativeHandle,
  type ComponentProps,
} from 'react'
import { twMerge } from 'tailwind-merge'

import { useTextEditor } from './useTextEditor'
import type { TextEditorRef } from './types'

type TextEditorProps = {
  value: string
  onChange: (value: string) => void
} & Omit<ComponentProps<'textarea'>, 'onChange'>

const TextEditorComponent = (
  { value, placeholder, className, rows, onChange }: TextEditorProps,
  ref: ForwardedRef<TextEditorRef>,
) => {
  const {
    textareaRef,
    handleValueChange,
    handleKeyDown,
    insertValue,
    insertSnippet,
    moveCursorToEnd,
  } = useTextEditor(onChange)

  useImperativeHandle(
    ref,
    () => {
      return {
        moveCursorToEnd,
        insertSnippet,
        insertValue,
      }
    },
    [moveCursorToEnd, insertValue, insertSnippet],
  )

  return (
    <textarea
      ref={textareaRef}
      placeholder={placeholder}
      autoFocus={false}
      className={twMerge(
        'w-full resize-none rounded-md bg-transparent text-sm font-medium text-gray-300 outline-none placeholder:text-gray-500',
        className,
      )}
      value={value}
      rows={rows}
      onKeyDown={handleKeyDown}
      onChange={({ currentTarget }) => handleValueChange(currentTarget.value)}
    />
  )
}

export const TextEditor = forwardRef(TextEditorComponent)
