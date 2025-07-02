import Link from 'next/link'

import { ROUTES } from '@/constants'
import { Button } from '@/ui/global/widgets/components/Button'
import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'

type Props = {
  solutionSlug: string
  challengeSlug: string
  isUserAuthor: boolean
  onDeleteSolutionButtonClick: () => void
}

export const UserSolutionButtonsView = ({
  solutionSlug,
  challengeSlug,
  isUserAuthor,
  onDeleteSolutionButtonClick,
}: Props) => {
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
              <p className='text-gray-50'>Tem certeza que deseja deletar essa solução?</p>
              <p className='text-gray-50'>Nenhum outro usuário poderá visualizá-la.</p>
            </div>
          }
          action={
            <Button
              onClick={onDeleteSolutionButtonClick}
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
