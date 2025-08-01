import { useRef } from 'react'

import { useStreakBreakDialog } from './useStreakBreakDialog'
import { StreakBreakDialogView } from './StreakBreakDialogView'

export const StreakBreakDialog = () => {
  const alertDialogRef = useRef<AlertDialogRef | null>(null)
  const { handleAlertDialogOpenChange } = useStreakBreakDialog(alertDialogRef)

  return (
    <StreakBreakDialogView
      alertDialogRef={alertDialogRef}
      handleAlertDialogOpenChange={handleAlertDialogOpenChange}
    />
  )
}
