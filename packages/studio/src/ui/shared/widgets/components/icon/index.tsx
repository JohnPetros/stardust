import type { ComponentType, SVGProps } from 'react'
import { cn } from '@/ui/shadcn/utils'

// Eagerly load all icons as React components (via vite-plugin-svgr)
const icons = import.meta.glob<ComponentType<SVGProps<SVGSVGElement>>>(
  '/src/assets/icons/*.svg',
  { eager: true, query: '?react', import: 'default' },
)

export type IconProps = {
  name: string
  className?: string
}

export const Icon = ({ name, className }: IconProps) => {
  const IconComponent = icons[`/src/assets/icons/${name}.svg`]

  return IconComponent ? (
    <IconComponent className={cn('size-6 shrink-0', className)} />
  ) : null
}
