'use client'

import Link from 'next/link'

import { type PropsWithChildren, useRef } from 'react'

import { ROUTES } from '@/constants'
import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import { Button } from '@/ui/global/widgets/components/Button'
import { Loading } from '@/ui/global/widgets/components/Loading'
import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { useBlockedContentAlertDialog } from './useBlockedContentAlertDialog'

const CONTENT_TYPES = {
  comments: 'os comentários de outros usuários.',
  solutions: 'as soluções de outros usuários.',
  solution: 'essa solução.',
}

type BlockedContentMessageProps = {
  content: 'comments' | 'solutions' | 'solution'
}

export function BlockedContentAlertDialog({
  content,
  children,
}: PropsWithChildren<BlockedContentMessageProps>) {
  const ref = useRef<AlertDialogRef>(null)
  const { challengeSlug, isVerifyingVisibility, handleOpenChange } =
    useBlockedContentAlertDialog(ref)

  return (
    <>
      <AlertDialog
        ref={ref}
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
        <div className='grid place-content-center w-full h-full'>
          <Loading />
        </div>
      ) : (
        children
      )}
    </>
  )
}
