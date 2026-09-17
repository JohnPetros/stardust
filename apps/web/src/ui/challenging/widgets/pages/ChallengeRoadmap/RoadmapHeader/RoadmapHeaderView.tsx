import type { ReactNode } from 'react'

type Props = { switchSlot: ReactNode }

export function RoadmapHeaderView({ switchSlot }: Props) {
  return (
    <header className='flex flex-col gap-5 border-b border-gray-800 pb-6 md:flex-row md:items-end md:justify-between'>
      <div>
        <p className='mb-2 font-mono text-xs uppercase tracking-[0.2em] text-green-400'>
          Trilha de aprendizado
        </p>
        <h1 className='text-3xl font-bold text-gray-100 md:text-4xl'>
          Roadmap de desafios
        </h1>
        <p className='mt-2 max-w-2xl text-sm text-gray-400'>
          Avance por conceitos conectados, no seu ritmo. Explore qualquer etapa ou siga a
          próxima recomendação.
        </p>
      </div>
      {switchSlot}
    </header>
  )
}
