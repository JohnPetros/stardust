import Link from 'next/link'

type Props = {
  activeView: 'roadmap' | 'catalog'
  roadmapHref: string
  catalogHref: string
}

export function ChallengesViewSwitchView({
  activeView,
  roadmapHref,
  catalogHref,
}: Props) {
  return (
    <nav
      aria-label='Visualização de desafios'
      className='inline-flex rounded-md border border-gray-700 bg-gray-900 p-1'
    >
      <Link
        href={roadmapHref}
        aria-current={activeView === 'roadmap' ? 'page' : undefined}
        className={`rounded px-3 py-2 text-sm transition-colors ${activeView === 'roadmap' ? 'bg-green-400 font-semibold text-gray-950' : 'text-gray-300 hover:bg-gray-800 hover:text-gray-100'}`}
      >
        Roadmap
      </Link>
      <Link
        href={catalogHref}
        aria-current={activeView === 'catalog' ? 'page' : undefined}
        className={`rounded px-3 py-2 text-sm transition-colors ${activeView === 'catalog' ? 'bg-green-400 font-semibold text-gray-950' : 'text-gray-300 hover:bg-gray-800 hover:text-gray-100'}`}
      >
        Todos os desafios
      </Link>
    </nav>
  )
}
