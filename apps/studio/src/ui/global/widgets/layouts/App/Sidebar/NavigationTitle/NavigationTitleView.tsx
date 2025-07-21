import { cn } from '@/ui/shadcn/utils'

type Props = {
  children: React.ReactNode
  className?: string
}

export const NavigationTitleView = ({ children, className }: Props) => (
  <span className={cn('text-xs text-zinc-500 mb-2 block', className)}>{children}</span>
)
