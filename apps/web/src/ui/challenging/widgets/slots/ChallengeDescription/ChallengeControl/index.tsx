import Link from 'next/link'

import { ROUTES } from '@/constants'
import { Button } from '@/ui/global/widgets/components/Button'
import { Switch } from '@/ui/global/widgets/components/Switch'
import { AlertDialog } from '@/ui/global/widgets/components/AlertDialog'
import { AnimatedBorder } from '@/ui/global/widgets/components/AnimatedBorder'
import { useChallengeControl } from './useChallengeControl'

type ChallengeControlControl = {
  challengeSlug: string
  isChallengePublic: boolean
}

export function ChallengeControl({
  challengeSlug,
  isChallengePublic,
}: ChallengeControlControl) {
  const { handleDeleteChallengeButtonClick, handleIsChallengePublicSwitchChange } =
    useChallengeControl(challengeSlug)

  return (
    <div>
      <AnimatedBorder>
        <p className='text-gray-50 font-medium'>
          Você é o autor do desafio, qualquer recompensa recebida será inválida. Use essa
          página apenas como um meio para testar o seu desafio. Lembre-se que você não
          habilitou seu desafio como público para outros usuários
        </p>
      </AnimatedBorder>
      <div className='flex items-center justify-center gap-3 mt-3'>
        <Button asChild>
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
              onClick={handleDeleteChallengeButtonClick}
              className='bg-red-700 text-gray-50'
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
          <Button className='h-8 text-gray-400 text-xs w-max bg-green-900/90 font-medium px-3'>
            deletar seu desafio
          </Button>
        </AlertDialog>
        <Switch
          label={isChallengePublic ? 'público' : 'privado'}
          defaultCheck={isChallengePublic}
          onCheck={handleIsChallengePublicSwitchChange}
        />
      </div>
    </div>
  )
}
