type Props = {
  title: string
  description: string
  completed: number | null
  total: number
  onClose: () => void
}

export function RoadmapDrawerHeaderView({
  title,
  description,
  completed,
  total,
  onClose,
}: Props) {
  return (
    <header className='border-b border-gray-700 pb-5'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h2 id='roadmap-drawer-title' className='text-xl font-semibold text-gray-100'>
            {title}
          </h2>
          <p className='mt-1 text-sm text-gray-400'>{description}</p>
        </div>
        <button
          type='button'
          aria-label='Fechar drawer'
          onClick={onClose}
          className='min-h-11 min-w-11 rounded text-2xl text-gray-300 hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-green-400'
        >
          ×
        </button>
      </div>
      <p className='mt-4 font-mono text-xs text-gray-400'>
        {completed === null
          ? `${total} desafios editoriais · progresso pessoal indisponível`
          : `${completed} de ${total} concluído${completed === 1 ? '' : 's'}`}
      </p>
      {completed === null ? null : (
        <div className='mt-2 h-1.5 rounded-full bg-gray-700'>
          <div
            className='h-full rounded-full bg-green-400'
            style={{ width: `${total ? (completed / total) * 100 : 0}%` }}
          />
        </div>
      )}
    </header>
  )
}
