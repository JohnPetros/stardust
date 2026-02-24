import Link from 'next/link'

import { ROUTES } from '@/constants'
import { Button } from '@/ui/global/widgets/components/Button'
import { Switch } from '@/ui/global/widgets/components/Switch'
import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'

type Props = {
  isChallengePublic: boolean
  isManagingAsAdmin: boolean
  challengeSlug: string
  onDeleteChallengeButtonClick: () => void
  onIsChallengePublicSwitchChange: (isPublic: boolean) => void
}

export const ChallengeControlView = ({
  isChallengePublic,
  isManagingAsAdmin,
  challengeSlug,
  onDeleteChallengeButtonClick,
  onIsChallengePublicSwitchChange,
}: Props) => {
  return (
    <div>
      <div>
        <p className='p-3 rounded-md border border-dashed border-yellow-500 text-sm leading-6 text-yellow-500 font-medium'>
          {isManagingAsAdmin
            ? 'Você está gerenciando este desafio como administrador. Alterações e remoções impactam o conteúdo original do autor.'
            : 'Você é o autor desse desafio, qualquer recompensa recebida será inválida. Use essa página apenas como um meio para testar o seu desafio.'}{' '}
          {!isChallengePublic &&
            (isManagingAsAdmin
              ? 'Este desafio está privado para outros usuários.'
              : 'Lembre-se também que você não habilitou seu desafio como público para outros usuários acessarem.')}
        </p>
      </div>
      <div className='flex items-center gap-3 mt-3 px-3'>
        <Button asChild className='w-max h-8 px-3 text-xs'>
          <Link href={ROUTES.challenging.challenge(challengeSlug)}>editar desafio</Link>
        </Button>
        <AlertDialog
          title={
            isManagingAsAdmin
              ? 'Este desafio está prestes a ser removido'
              : 'Seu desafio está prestes a ser removido'
          }
          type='crying'
          body={
            <div className='mt-3'>
              <p className='text-gray-50'>
                {isManagingAsAdmin
                  ? 'Tem certeza que deseja deletar o desafio de outro autor?'
                  : 'Tem certeza que deseja deletar esse desafio?'}
              </p>
              <p className='text-gray-50'>
                {isManagingAsAdmin
                  ? 'Todos os dados desse desafio serão perdidos.'
                  : 'Todos os dados do seu desafio serão perdidos.'}
              </p>
            </div>
          }
          action={
            <Button
              onClick={onDeleteChallengeButtonClick}
              className='bg-red-800 text-gray-50'
            >
              {isManagingAsAdmin ? 'Deletar desafio' : 'Deletar meu desafio'}
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
            {isManagingAsAdmin ? 'deletar desafio' : 'deletar seu desafio'}
          </Button>
        </AlertDialog>
        <Switch
          label={isChallengePublic ? 'público' : 'privado'}
          defaultCheck={isChallengePublic}
          onCheck={onIsChallengePublicSwitchChange}
        />
      </div>
    </div>
  )
}
