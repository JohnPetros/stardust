import type { ReactNode } from 'react'

import { Badge } from '@/ui/shadcn/components/badge'
import { Button } from '@/ui/shadcn/components/button'
import { Icon } from '@/ui/global/widgets/components/Icon'

type Props = {
  isGenerating: boolean
  isGenerateDisabled: boolean
  canCancel: boolean
  statusLabel: string | null
  statusVariant: 'secondary' | 'destructive'
  selector: ReactNode
  player: ReactNode
  onGenerate: () => void
  onCancel: () => void
}

export const BlockAudioControlsView = ({
  isGenerating,
  isGenerateDisabled,
  canCancel,
  statusLabel,
  statusVariant,
  onGenerate,
  onCancel,
  selector,
  player,
}: Props) => {
  console.log({ isGenerating })
  return (
    <div className='space-y-3 rounded-lg border border-zinc-800 bg-zinc-950/70 p-3'>
      <div className='flex flex-wrap items-end gap-3'>
        {selector}
        <div className='flex gap-2'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            disabled={isGenerateDisabled}
            onClick={onGenerate}
          >
            {isGenerating ? (
              <Icon name='loading' className='h-4 w-4 animate-spin' />
            ) : null}
            {!isGenerating ? <Icon name='audio' className='h-4 w-4' /> : null}
            {isGenerating ? 'Gerando...' : 'Gerar áudio'}
          </Button>
          {canCancel ? (
            <Button type='button' variant='destructive' size='sm' onClick={onCancel}>
              Cancelar
            </Button>
          ) : null}
        </div>
      </div>

      {statusLabel ? <Badge variant={statusVariant}>{statusLabel}</Badge> : null}
      {player}
    </div>
  )
}
