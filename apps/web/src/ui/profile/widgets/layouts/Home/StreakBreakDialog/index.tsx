import { useRef } from 'react'

import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import { Button } from '@/ui/global/widgets/components/Button'
import { useStreakBreakDialog } from './useStreakBreakDialog'

export function StreakBreakDialog() {
  const alertDialogRef = useRef(null)
  const { handleAlertDialogOpenChange } = useStreakBreakDialog(alertDialogRef)

  return (
    <AlertDialog
      type='crying'
      ref={alertDialogRef}
      title='Ah não!'
      body={
        <p className='mb-3 text-center text-base text-green-500'>
          Você perdeu sua sequência ininterrupta de dias estudados.
        </p>
      }
      shouldPlayAudio={true}
      onOpenChange={handleAlertDialogOpenChange}
      action={<Button>Puxa</Button>}
    />
  )
}
