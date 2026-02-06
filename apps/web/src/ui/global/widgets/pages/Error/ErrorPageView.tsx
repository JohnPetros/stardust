import Image from 'next/image'

import { Animation } from '../../components/Animation'
import { DecryptedText } from '../../components/DecryptedText'
import { Button } from '../../components/Button'

type Props = {
  errorMessage: string
  onReload: () => void
}

export const ErrorPageView = ({ errorMessage, onReload }: Props) => {
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

      <Button className='w-48' onClick={onReload}>
        Tentar novamente
      </Button>

      <a
        href="https://discord.com/channels/987782561252143205/1377325380037509212"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline hover:text-blue-800 transition-colors"
      >
        Pedir ajuda no Discord
      </a>
    </div>
  )
}
