import type { RefObject } from 'react'

import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { ChallengeNavigationAlertDialogView } from './ChallengeNavigationAlertDialogView'
import { useChallengeNavigationAlertDialog } from './useChallengeNavigationAlertDialog'

type Props = {
  dialogRef: RefObject<AlertDialogRef | null>
  onConfirm: () => void
  onCancel: () => void
}

export const ChallengeNavigationAlertDialog = ({
  dialogRef,
  onConfirm,
  onCancel,
}: Props) => {
  const { handleConfirmClick, handleCancelClick } = useChallengeNavigationAlertDialog({
    onConfirm,
    onCancel,
  })

  return (
    <ChallengeNavigationAlertDialogView
      dialogRef={dialogRef}
      onConfirm={handleConfirmClick}
      onCancel={handleCancelClick}
    />
  )
}
