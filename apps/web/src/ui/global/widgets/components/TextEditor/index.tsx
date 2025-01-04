import {
  type ForwardedRef,
  forwardRef,
  useImperativeHandle,
  type KeyboardEvent,
} from 'react'
import { type ClassNameValue, twMerge } from 'tailwind-merge'

import { useTextEditor } from './useTextEditor'
import type { TextEditorRef } from './types'

type TextEditorProps = {
  value: string
  className?: ClassNameValue
  placeholder?: string
  hasAutoFocus?: boolean
  onChange: (value: string) => void
  onKeyUp?: (event: KeyboardEvent<HTMLTextAreaElement>) => void
}

const TextEditorComponent = (
  { value, placeholder, className, hasAutoFocus, onChange, onKeyUp }: TextEditorProps,
  ref: ForwardedRef<TextEditorRef>,
) => {
  const { textareaRef, handleValueChange, insertValue, insertSnippet, moveCursorToEnd } =
    useTextEditor(onChange)

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
      className={twMerge(
        'w-full resize-none rounded-md bg-transparent text-sm font-medium text-gray-300 outline-none placeholder:text-gray-500',
        className,
      )}
      // rows={value.length > 3 ? Text.create(value).countCharacters('\n') : 1}
      value={value}
      autoFocus={hasAutoFocus}
      onKeyUp={onKeyUp}
      onChange={({ currentTarget }) => handleValueChange(currentTarget.value)}
    />
  )
}

export const TextEditor = forwardRef(TextEditorComponent)
