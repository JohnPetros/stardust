import type { PropsWithChildren, RefObject } from 'react'
import Link from 'next/link'

import { ROUTES } from '@/constants'
import type { AlertDialogRef } from '../AlertDialog/types'
import { AlertDialog } from '../AlertDialog'
import { Button } from '../Button'

type Props = {
  ref?: RefObject<AlertDialogRef | null>
  description: string
  nextRoute: string
}

export const AccountRequirementAlertDialogView = ({
  description,
  nextRoute,
  children,
  ref,
}: PropsWithChildren<Props>) => {
  return (
    <AlertDialog
      ref={ref}
      type='denying'
      title='Negado!'
      body={<p className='text-center leading-8 text-gray-100'>{description}</p>}
      action={
        <Button asChild autoFocus>
          <Link href={`${ROUTES.auth.signIn}?nextRoute=${nextRoute}`}>Fazer login</Link>
        </Button>
      }
      cancel={<Button className='bg-gray-900 text-gray-100'>Cancelar</Button>}
    >
      {children}
    </AlertDialog>
  )
}
