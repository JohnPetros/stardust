import Image from 'next/image'

import { Animation } from '../../components/Animation'
import { DecryptedText } from '../../components/DecryptedText'
import { Button } from '../../components/Button'

type Props = {
  errorMessage: string
  onReaload: () => void
}

export const ErrorPageView = ({ errorMessage, onReaload }: Props) => {
  return (
    <div className='flex flex-col items-center justify-center gap-6 h-full w-full'>
      <header className='flex flex-col items-center justify-center gap-4'>
        <Animation name='internal-error' size={150} />
        <h1 className='text-2xl font-bold text-gray-500'>
          <DecryptedText>Erro interno da aplicação</DecryptedText>
        </h1>
      </header>

      <div className='flex flex-col items-center justify-center'>
        <p className='text-gray-500'>
          <DecryptedText>{errorMessage}</DecryptedText>
        </p>
      </div>

      <Image
        src='/images/apollo-mendigo.jpg'
        alt='apollo pedindo ajuda'
        width={180}
        height={180}
        className='rounded-md'
      />

      <Button className='w-48' onClick={onReaload}>
        Voltar
      </Button>
    </div>
  )
}
