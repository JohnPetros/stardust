type Props = {
  variant: 'error' | 'empty' | 'comingSoon'
  message?: string
  onAction?: () => void
}

const content = {
  error: {
    title: 'Não foi possível carregar o roadmap',
    message: 'Tente novamente para buscar uma revisão publicada.',
  },
  empty: {
    title: 'Roadmap indisponível',
    message: 'Ainda não há uma trilha publicada. Você pode explorar todos os desafios.',
  },
  comingSoon: {
    title: 'Em breve',
    message: 'Novos desafios desta categoria estão sendo preparados.',
  },
} as const

export function RoadmapStateMessageView({ variant, message, onAction }: Props) {
  const state = content[variant]
  return (
    <section
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live='polite'
      className='rounded-lg border border-gray-700 bg-gray-900 p-8 text-center'
    >
      <h2 className='text-xl font-semibold text-gray-100'>{state.title}</h2>
      <p className='mx-auto mt-2 max-w-md text-sm text-gray-400'>
        {message ?? state.message}
      </p>
      {onAction && (
        <button
          type='button'
          onClick={onAction}
          className='mt-5 min-h-11 rounded bg-green-400 px-5 py-2 text-sm font-semibold text-gray-950'
        >
          Tentar novamente
        </button>
      )}
    </section>
  )
}
