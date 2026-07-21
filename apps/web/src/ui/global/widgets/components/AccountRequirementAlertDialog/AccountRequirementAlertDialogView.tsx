import type { PropsWithChildren, RefObject } from 'react'

import type { AlertDialogRef } from '../AlertDialog/types'
import { AlertDialog } from '../AlertDialog'
import { Button } from '../Button'

type Props = {
  ref?: RefObject<AlertDialogRef | null>
  description: string
  onConfirm: () => void
}

export const AccountRequirementAlertDialogView = ({
  description,
  onConfirm,
  children,
  ref,
}: PropsWithChildren<Props>) => {
  return (
    <AlertDialog
      ref={ref}
      type='denying'
      title='Negado!'
      body={<p className='text-center leading-8 text-gray-100'>{description}</p>}
      action={<Button onClick={onConfirm}>Fazer login</Button>}
      cancel={<Button className='bg-gray-900 text-gray-100'>Cancelar</Button>}
    >
      {children}
    </AlertDialog>
  )
}
