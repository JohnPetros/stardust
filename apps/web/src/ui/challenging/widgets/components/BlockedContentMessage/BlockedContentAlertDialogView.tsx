'use client'

import Link from 'next/link'
import type { PropsWithChildren, RefObject } from 'react'

import { ROUTES } from '@/constants'
import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import { Button } from '@/ui/global/widgets/components/Button'
import { Loading } from '@/ui/global/widgets/components/Loading'
import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'

const CONTENT_TYPES = {
  comments: 'os comentários de outros usuários.',
  solutions: 'as soluções de outros usuários.',
  solution: 'essa solução.',
}

type Props = PropsWithChildren<{
  content: 'comments' | 'solutions' | 'solution'
  dialogRef: RefObject<AlertDialogRef | null>
  challengeSlug: string
  isVerifyingVisibility: boolean
  handleOpenChange: (isOpen: boolean) => void
}>

export const BlockedContentAlertDialogView = ({
  content,
  dialogRef,
  challengeSlug,
  isVerifyingVisibility,
  handleOpenChange,
  children,
}: Props) => {
  return (
    <>
      <AlertDialog
        ref={dialogRef}
        title='Ei, você ainda não completou esse desafio!'
        type='denying'
        body={
          <p className='text-gray-50'>
            Tente resolver esse desafio antes de ver {CONTENT_TYPES[content]}
          </p>
        }
        action={
          <Button asChild>
            <Link href={ROUTES.challenging.challenges.challenge(challengeSlug)}>
              Resolver desafio
            </Link>
          </Button>
        }
        onOpenChange={handleOpenChange}
      />
      {isVerifyingVisibility ? (
        <div className='grid h-full w-full place-content-center'>
          <Loading />
        </div>
      ) : (
        children
      )}
    </>
  )
}
