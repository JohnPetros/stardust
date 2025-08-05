import type { PropsWithChildren } from 'react'

import { ClipboardButtonView } from './ClipboardButtonView'
import { useClipboard } from '../../../hooks/useClipboard'

type Props = {
  text: string
  className?: string
}

export const ClipboardButton = ({
  text,
  className,
  children,
}: PropsWithChildren<Props>) => {
  const { copy } = useClipboard()

  return (
    <ClipboardButtonView onClick={() => copy(text)} className={className}>
      {children}
    </ClipboardButtonView>
  )
}
