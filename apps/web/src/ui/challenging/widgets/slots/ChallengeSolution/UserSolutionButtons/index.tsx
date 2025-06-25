'use client'

import Link from 'next/link'

import { ROUTES } from '@/constants'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { Button } from '@/ui/global/widgets/components/Button'
import { useUserSolutionButtons } from './useUserSolutionButtons'
import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import { useRest } from '@/ui/global/hooks/useRest'
import { Id, Slug } from '@stardust/core/global/structures'

type UserSolutionButtonsProps = {
  solutionId: string
  solutionSlug: string
  authorId: string
  challengeSlug: string
}

export function UserSolutionButtons({
  solutionId,
  authorId,
  solutionSlug,
  challengeSlug,
}: UserSolutionButtonsProps) {
  const { user } = useAuthContext()
  const { challengingService } = useRest()
  const { handleDeleteSolutionButtonClick } = useUserSolutionButtons({
    solutionId: Id.create(solutionId),
    challengeSlug: Slug.create(challengeSlug),
    challengingService,
  })
  const isUserAuthor = user?.id.value === authorId

  if (user)
    return (
      <div className='flex gap-3'>
        {!isUserAuthor && (
          <Button asChild className='h-8 text-xs w-max px-3'>
            <Link
              href={ROUTES.challenging.challenges.challengeSolutions.list(challengeSlug)}
            >
              criar sua própria solução
            </Link>
          </Button>
        )}
        {isUserAuthor && (
          <Button
            asChild
            className='h-8 text-gray-200 text-xs w-max bg-green-900/90 font-medium px-3'
          >
            <Link
              href={ROUTES.challenging.challenges.solution(challengeSlug, solutionSlug)}
            >
              editar sua solução
            </Link>
          </Button>
        )}
        {isUserAuthor && (
          <AlertDialog
            title='Sua solução está preste a ser removida'
            type='crying'
            body={
              <div className='mt-3'>
                <p className='text-gray-50'>
                  Tem certeza que deseja deletar essa solução?
                </p>
                <p className='text-gray-50'>Nenhum outro usuário poderá visualizá-la.</p>
              </div>
            }
            action={
              <Button
                onClick={handleDeleteSolutionButtonClick}
                className='bg-red-800 text-gray-50'
              >
                Deletar minha solução
              </Button>
            }
            cancel={
              <Button autoFocus className='bg-green-400 text-gray-900'>
                Cancelar
              </Button>
            }
            shouldPlayAudio={false}
          >
            <Button className='h-8 text-gray-50 text-xs w-max bg-red-800 font-medium px-3'>
              deletar sua solução
            </Button>
          </AlertDialog>
        )}
      </div>
    )
}
