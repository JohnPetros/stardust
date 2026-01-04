import { AnimatedOpacity } from '@/ui/global/widgets/components/AnimatedOpacity'
import { Animation } from '@/ui/global/widgets/components/Animation'

type Props = {
  userName: string
}

export const AssistantGreetingView = ({ userName }: Props) => {
  return (
    <div className='flex flex-col items-center justify-center gap-2'>
      <AnimatedOpacity delay={1}>
        <div className='translate-y-6'>
          <Animation name='robot' size={320} hasLoop={true} />
        </div>
        <p className='text-xl text-center text-gray-100'>
          Olá, <span className='text-green-400'>{userName}</span>.
        </p>
      </AnimatedOpacity>
      <AnimatedOpacity delay={2}>
        <div className='max-w-96'>
          <p className='text-center text-gray-400 text-md'>
            Emperrado com o desafio? 😉.
          </p>
          <p className='text-center text-gray-400 text-md mt-3'>
            Posso te ajudar na solução, como também consigo resolver dúvidas sobre a
            linguagem Delégua.
          </p>
        </div>
      </AnimatedOpacity>
    </div>
  )
}
