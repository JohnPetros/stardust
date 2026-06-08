import type { ReactNode } from 'react'

import { Badge } from '@/ui/shadcn/components/badge'
import { Button } from '@/ui/shadcn/components/button'
import { Icon } from '@/ui/global/widgets/components/Icon'

type Props = {
  isGenerating: boolean
  isRemoving: boolean
  isGenerateDisabled: boolean
  canCancel: boolean
  canRemove: boolean
  statusLabel: string | null
  statusVariant: 'secondary' | 'destructive'
  selector: ReactNode
  player: ReactNode
  onGenerate: () => void
  onCancel: () => void
  onRemove: () => void
}

export const BlockAudioControlsView = ({
  isGenerating,
  isRemoving,
  isGenerateDisabled,
  canCancel,
  canRemove,
  statusLabel,
  statusVariant,
  onGenerate,
  onCancel,
  onRemove,
  selector,
  player,
}: Props) => {
  return (
    <div className='space-y-3 rounded-lg border border-zinc-800 bg-zinc-950/70 p-3'>
      <div className='flex flex-wrap items-end gap-3'>
        {selector}
        <div className='flex gap-2'>
          <Button
            type='button'
            variant='outline'
            size='sm'
            disabled={isGenerateDisabled || isRemoving}
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
          {canRemove ? (
            <Button
              type='button'
              variant='outline'
              size='sm'
              disabled={isRemoving}
              onClick={onRemove}
            >
              {isRemoving ? (
                <Icon name='loading' className='h-4 w-4 animate-spin' />
              ) : null}
              {isRemoving ? 'Removendo...' : 'Remover audio'}
            </Button>
          ) : null}
        </div>
      </div>

      {statusLabel ? <Badge variant={statusVariant}>{statusLabel}</Badge> : null}
      {player}
    </div>
  )
}
