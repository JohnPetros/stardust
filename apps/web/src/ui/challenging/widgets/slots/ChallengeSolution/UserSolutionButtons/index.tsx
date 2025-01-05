'use client'

import Link from 'next/link'

import { ROUTES } from '@/constants'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { Button } from '@/ui/global/widgets/components/Button'
import { useUserSolutionButtons } from './useUserSolutionButtons'
import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'

type UserSolutionButtonsProps = {
  solutionId: string
  authorId: string
  challengeSlug: string
}

export function UserSolutionButtons({
  solutionId,
  authorId,
  challengeSlug,
}: UserSolutionButtonsProps) {
  const { user } = useAuthContext()
  const { handleDeleteSolutionButtonClick } = useUserSolutionButtons(solutionId)

  if (user)
    return (
      <div className='flex items-center justify-center gap-2'>
        {user.id !== authorId && (
          <Button asChild className='h-12 text-sm'>
            <Link
              href={ROUTES.challenging.challenges.challengeSolutions.list(challengeSlug)}
            >
              criar sua própria solução
            </Link>
          </Button>
        )}
        {user.id === authorId && (
          <Button asChild className='h-12 text-sm'>
            <Link
              href={ROUTES.challenging.challenges.challengeSolutions.list(challengeSlug)}
            >
              editar sua solução
            </Link>
          </Button>
        )}
        {user.id === authorId && (
          <AlertDialog
            title='Sua solução está preste a ser removida'
            type='crying'
            body={
              <div>
                <p>Tem certeza que deseja deletar essa solução?</p>
                <p>Nenhum outro usuário poderá visualizá-la.</p>
              </div>
            }
            action={
              <Button
                onClick={handleDeleteSolutionButtonClick}
                className='bg-red-700 text-gray-100'
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
            <Button asChild className='h-12 text-sm text-gray-50 bg-red-700'>
              deletar sua solução
            </Button>
          </AlertDialog>
        )}
      </div>
    )
}
