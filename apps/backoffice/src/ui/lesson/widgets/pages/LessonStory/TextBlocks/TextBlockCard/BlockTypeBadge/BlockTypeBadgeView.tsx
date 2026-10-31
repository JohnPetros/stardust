import { Badge } from '@/ui/shadcn/components/badge'
import type { TextBlockEditorItem } from '../../../types'

type Props = {
  type: TextBlockEditorItem['type']
}

const TYPE_CLASSNAME: Record<TextBlockEditorItem['type'], string> = {
  default: 'border-sky-500/40 bg-sky-500/10 text-sky-200',
  user: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200',
  alert: 'border-amber-500/40 bg-amber-500/10 text-amber-200',
  quote: 'border-fuchsia-500/40 bg-fuchsia-500/10 text-fuchsia-200',
  code: 'border-zinc-500/50 bg-zinc-800 text-zinc-200',
  image: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-200',
}

export const BlockTypeBadgeView = ({ type }: Props) => {
  return <Badge className={TYPE_CLASSNAME[type]}>{type}</Badge>
}
