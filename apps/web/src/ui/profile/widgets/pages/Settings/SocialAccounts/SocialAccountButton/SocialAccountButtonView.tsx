import Image from 'next/image'

type Params = {
  name: string
  logoUrl: string
  isConnected: boolean
  onDisconnect: () => void
  onConnect: () => void
}

export const SocialAccountButtonView = ({
  name,
  logoUrl,
  isConnected,
  onDisconnect,
  onConnect,
}: Params) => {
  return (
    <div className='flex items-center justify-between border-b border-gray-700 pb-4'>
      <div className='flex items-center gap-4'>
        <Image src={`/images/${logoUrl}`} alt={name} width={24} height={24} />
        <span className='text-gray-100 font-semibold'>{name}</span>
      </div>

      <span className='text-gray-400 font-semibold'>
        {isConnected ? 'Conectado' : 'Desconectado'}
      </span>

      {isConnected ? (
        <button type='button' onClick={onDisconnect} className='text-green-400'>
          Desconectar
        </button>
      ) : (
        <button type='button' onClick={onConnect} className='text-green-400'>
          Conectar
        </button>
      )}
    </div>
  )
}
