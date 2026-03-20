'use client'

import { type PropsWithChildren, useRef } from 'react'

import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { BlockedContentAlertDialogView } from './BlockedContentAlertDialogView'
import { useBlockedContentAlertDialog } from './useBlockedContentAlertDialog'

type BlockedContentMessageProps = {
  content: 'comments' | 'solutions' | 'solution'
}

export const BlockedContentAlertDialog = ({
  content,
  children,
}: PropsWithChildren<BlockedContentMessageProps>) => {
  const ref = useRef<AlertDialogRef>(null)
  const { challengeSlug, isVerifyingVisibility, handleOpenChange } =
    useBlockedContentAlertDialog(ref, content)

  return (
    <BlockedContentAlertDialogView
      content={content}
      dialogRef={ref}
      challengeSlug={challengeSlug}
      isVerifyingVisibility={isVerifyingVisibility}
      handleOpenChange={handleOpenChange}
    >
      {children}
    </BlockedContentAlertDialogView>
  )
}
