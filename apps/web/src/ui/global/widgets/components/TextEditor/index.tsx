import { type ForwardedRef, forwardRef, useImperativeHandle } from 'react'
import { type ClassNameValue, twMerge } from 'tailwind-merge'

import { Text } from '@stardust/core/global/structs'

import { useTextEditor } from './useTextEditor'
import type { TextEditorRef } from './types'

type TextEditorProps = {
  value: string
  className?: ClassNameValue
  placeholder?: string
  hasAutoFocus?: boolean
  onChange: (value: string) => void
}

const TextEditorComponent = (
  { value, placeholder, className, hasAutoFocus, onChange }: TextEditorProps,
  ref: ForwardedRef<TextEditorRef>,
) => {
  const { textareaRef, handleValueChange, insertSnippet, moveCursorToEnd } =
    useTextEditor(onChange)

  useImperativeHandle(
    ref,
    () => {
      return {
        moveCursorToEnd,
        insertSnippet,
      }
    },
    [moveCursorToEnd, insertSnippet],
  )

  return (
    <textarea
      ref={textareaRef}
      placeholder={placeholder}
      className={twMerge(
        'w-full resize-none rounded-md bg-transparent text-sm font-medium text-gray-300 outline-none placeholder:text-gray-500 bg-red-700',
        className,
      )}
      // rows={value.length > 3 ? Text.create(value).countCharacters('\n') : 1}
      value={value}
      autoFocus={hasAutoFocus}
      onChange={({ currentTarget }) => handleValueChange(currentTarget.value)}
    />
  )
}

export const TextEditor = forwardRef(TextEditorComponent)
