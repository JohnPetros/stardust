import type { RefObject } from 'react'

import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import { Button } from '@/ui/global/widgets/components/Button'

type Props = {
  alertDialogRef: RefObject<AlertDialogRef | null>
  handleAlertDialogOpenChange: (isOpen: boolean) => void
}

export const StreakBreakDialogView = ({
  alertDialogRef,
  handleAlertDialogOpenChange,
}: Props) => {
  return (
    <AlertDialog
      ref={alertDialogRef}
      type='crying'
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
