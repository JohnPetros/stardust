'use client'

import { Animation } from '../../shared/Animation'
import { Button } from '../../shared/Button'
import { useRouter } from '../../../hooks'
import { ROUTES } from '../../../constants'

import { Animated404 } from './Animated404'

export function NotFoundPage() {
  const router = useRouter()

  return (
    <main className='grid h-screen w-screen place-content-center bg-gray-900'>
      <Animated404>
        <div className='flex flex-col items-center gap-3 uppercase sm:flex-row '>
          <h1 className='text-6xl font-semibold text-green-400'>
            Código <span className='sr-only'>404</span>
          </h1>

          <div className='-mt-[2rem]'>
            <Animation name='404' size={240} />
          </div>
        </div>

        <div className='-mt-6'>
          <p className='text-lg leading-8 text-gray-300'>
            Parece que você se perdeu no espaço! <br /> Clique abaixo para puxarmos você
            de volta.
          </p>
        </div>

        <Button
          className='mt-6'
          onClick={() => router.goTo(ROUTES.private.app.home.space)}
        >
          Retornar
        </Button>
      </Animated404>
    </main>
  )
}
