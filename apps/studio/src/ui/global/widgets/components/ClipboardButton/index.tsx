import type { PropsWithChildren } from 'react'

import { ClipboardButtonView } from './ClipboardButtonView'
import { useClipboard } from './useClipboard'

type Props = {
  text: string
  className?: string
}

export const ClipboardButton = ({
  text,
  className,
  children,
}: PropsWithChildren<Props>) => {
  const { copy } = useClipboard(text)

  return (
    <ClipboardButtonView onClick={copy} className={className}>
      {children}
    </ClipboardButtonView>
  )
}
