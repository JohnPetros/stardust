import { type ForwardedRef, type ReactNode, forwardRef, useImperativeHandle } from 'react'

import type { PromptRef } from './types'
import { usePrompt } from './usePrompt'
import { PromptView } from './PromptView'

type PromptProps = {
  children?: ReactNode
  title?: string
  onConfirm: () => void
  onCancel?: () => void
}

export function PromptComponent(
  { onConfirm, onCancel, children: trigger, title: initialTitle }: PromptProps,
  ref: ForwardedRef<PromptRef>,
) {
  const { title, value, dialogRef, open, close, setTitle, setValue } = usePrompt(
    initialTitle ?? '',
  )

  useImperativeHandle(ref, () => {
    return {
      open,
      close,
      setTitle,
      setValue,
      value,
    }
  }, [value, open, close, setTitle, setValue])

  return (
    <PromptView
      title={title}
      value={value}
      dialogRef={dialogRef}
      onValueChange={setValue}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      {trigger}
    </PromptView>
  )
}

export const Prompt = forwardRef(PromptComponent)
