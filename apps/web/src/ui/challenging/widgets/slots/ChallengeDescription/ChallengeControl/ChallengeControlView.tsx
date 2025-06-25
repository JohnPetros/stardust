import Link from 'next/link'

import { ROUTES } from '@/constants'
import { Button } from '@/ui/global/widgets/components/Button'
import { Switch } from '@/ui/global/widgets/components/Switch'
import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'

type Props = {
  isChallengePublic: boolean
  challengeSlug: string
  onDeleteChallengeButtonClick: () => void
  onIsChallengePublicSwitchChange: (isPublic: boolean) => void
}

export const ChallengeControlView = ({
  isChallengePublic,
  challengeSlug,
  onDeleteChallengeButtonClick,
  onIsChallengePublicSwitchChange,
}: Props) => {
  return (
    <div>
      <div>
        <p className='p-3 rounded-md border border-dashed border-yellow-500 text-sm leading-6 text-yellow-500 font-medium'>
          Você é o autor desse desafio, qualquer recompensa recebida será inválida. Use
          essa página apenas como um meio para testar o seu desafio.{' '}
          {!isChallengePublic &&
            'Lembre-se também que você não habilitou seu desafio como público para outros usuários acessarem.'}
        </p>
      </div>
      <div className='flex items-center gap-3 mt-3 px-3'>
        <Button asChild className='w-max h-8 px-3 text-xs'>
          <Link href={ROUTES.challenging.challenge(challengeSlug)}>editar desafio</Link>
        </Button>
        <AlertDialog
          title='Seu desafio está preste a ser removido'
          type='crying'
          body={
            <div className='mt-3'>
              <p className='text-gray-50'>Tem certeza que deseja deletar essa desafio?</p>
              <p className='text-gray-50'>
                Todos os dados do seus desafio serão perdidos.
              </p>
            </div>
          }
          action={
            <Button
              onClick={onDeleteChallengeButtonClick}
              className='bg-red-800 text-gray-50'
            >
              Deletar meu desafio
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
            deletar seu desafio
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
