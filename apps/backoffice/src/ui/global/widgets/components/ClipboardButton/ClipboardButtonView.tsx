import type { PropsWithChildren } from 'react'

import { CopyButton } from '@/ui/shadcn/components/copy-button'

type Props = {
  onClick: () => void
  className?: string
}

export const ClipboardButtonView = ({
  onClick,
  className,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <CopyButton onClick={onClick} className={className}>
      {children}
    </CopyButton>
  )
}
