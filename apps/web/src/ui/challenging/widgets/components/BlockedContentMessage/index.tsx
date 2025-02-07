import Link from 'next/link'

import { type PropsWithChildren, useRef } from 'react'

import { ROUTES } from '@/constants'
import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import { Animation } from '@/ui/global/widgets/components/Animation'
import { Button } from '@/ui/global/widgets/components/Button'
import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { Loading } from '@/ui/global/widgets/components/Loading'
import { useBlockedContentAlertDialog } from './useBlockedContentAlertDialog'

type BlockedContentMessageProps = {
  content: 'comments' | 'solutions'
}

export function BlockedContentAlertDialog({
  content,
  children,
}: PropsWithChildren<BlockedContentMessageProps>) {
  const ref = useRef<AlertDialogRef>(null)
  const { challengeSlug, isVerifyingVisibility } = useBlockedContentAlertDialog(ref)

  return (
    <>
      <AlertDialog
        ref={ref}
        title='Ei, você ainda não completou esse desafio!'
        type='denying'
        body={
          <div>
            <Animation name='apollo-denying' size={290} />
          </div>
        }
        action={
          <Button>
            <Link href={ROUTES.challenging.challenge(challengeSlug)}>
              Tente resolvê-lo antes de ver{' '}
              {content === 'solutions' ? 'as soluções' : 'os comentários'} de outros
              usuários
            </Link>
          </Button>
        }
      />
      {isVerifyingVisibility ? (
        <div className='grid place w-full h-full'>
          <Loading />
        </div>
      ) : (
        children
      )}
    </>
  )
}
