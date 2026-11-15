import Link from 'next/link'

import { ROUTES } from '@/constants'
import { Icon } from '@/ui/global/widgets/components/Icon'

export type Props = {
  galaxyName: string
}

function GalaxyControlIcon() {
  return (
    <svg
      aria-hidden='true'
      focusable='false'
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
      className='shrink-0 text-theme-accent-text'
    >
      <ellipse
        cx='10'
        cy='10'
        rx='9.25'
        ry='4.25'
        stroke='currentColor'
        strokeWidth='1.5'
        transform='rotate(-20 10 10)'
      />
      <circle cx='10' cy='10' r='3' fill='currentColor' />
    </svg>
  )
}

export function GalaxyControlView({ galaxyName }: Props) {
  return (
    <Link
      href={ROUTES.galaxies}
      aria-label={`${galaxyName}: ver galáxias`}
      className='flex h-[48px] w-full items-center gap-2 border-y border-theme-border bg-theme-surface px-[24px] transition-colors hover:border-theme-accent-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-theme-action md:h-theme-control md:w-fit md:rounded-theme md:border md:bg-transparent md:px-theme-control-x'
    >
      <GalaxyControlIcon />
      <span className='min-w-0 flex-1 truncate text-[14px] font-semibold text-theme-text-primary md:flex-none'>
        {galaxyName}
      </span>
      <span aria-hidden='true' className='text-[14px] text-theme-text-secondary'>
        Ver galáxias
      </span>
      <span aria-hidden='true' className='flex text-theme-text-secondary'>
        <Icon name='simple-arrow-right' size={16} />
      </span>
    </Link>
  )
}
