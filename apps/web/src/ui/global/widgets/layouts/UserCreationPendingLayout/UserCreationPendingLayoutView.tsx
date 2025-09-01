import type { PropsWithChildren } from 'react'
import { Animation } from '../../components/Animation'
import { Loading } from '../../components/Loading'
import { AnimatedLayout } from './AnimatedLayout'

type Props = {
  isUserCreationPending: boolean
}

export const UserCreationPendingLayoutView = ({
  children,
  isUserCreationPending,
}: PropsWithChildren<Props>) => {
  if (isUserCreationPending)
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <AnimatedLayout>
          <div className='flex flex-col items-center justify-center'>
            <Animation name='apollo-denying' size={240} hasLoop={true} />
            <p className='text-center text-lg text-gray-500'>
              A gente está criando seu perfil.
            </p>
            <p className='text-center text-lg text-gray-500'>
              Então, aguarde enquanto criamos seu perfil...
            </p>
            <Loading />
          </div>
        </AnimatedLayout>
      </div>
    )

  return children
}
