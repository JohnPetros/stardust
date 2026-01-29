import React from 'react'
import * as Dialog from '@/ui/global/widgets/components/Dialog'
import { Icon } from '@/ui/global/widgets/components/Icon'

type Props = {
  onSelect: (intent: 'bug' | 'idea' | 'other') => void
}

export const InitialStepView = ({ onSelect }: Props) => {
  return (
    <div className='p-8 animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <div className='flex items-center justify-between mb-8'>
        <Dialog.DialogTitle className='text-2xl font-bold bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent underline decoration-purple-500/30 underline-offset-8'>
          Deixe seu feedback
        </Dialog.DialogTitle>
        <Dialog.DialogClose className='p-2 rounded-xl text-slate-500 hover:text-slate-100 hover:bg-slate-800 transition-all active:scale-95'>
          <Icon name='close' size={24} />
        </Dialog.DialogClose>
      </div>

      <div className='grid grid-cols-3 gap-4'>
        <IntentButton
          icon={<Icon name='bug' size={32} weight='fill' className='text-purple-400' />}
          label='Problema'
          onClick={() => onSelect('bug')}
          hoverBg='hover:bg-purple-500/10'
          hoverBorder='hover:border-purple-500/50'
        />
        <IntentButton
          icon={
            <Icon name='lightbulb' size={32} weight='fill' className='text-yellow-400' />
          }
          label='Ideia'
          onClick={() => onSelect('idea')}
          hoverBg='hover:bg-yellow-500/10'
          hoverBorder='hover:border-yellow-500/50'
        />
        <IntentButton
          icon={<Icon name='comment' size={32} weight='fill' className='text-sky-400' />}
          label='Outro'
          onClick={() => onSelect('other')}
          hoverBg='hover:bg-sky-500/10'
          hoverBorder='hover:border-sky-500/50'
        />
      </div>
    </div>
  )
}

type IntentButtonProps = {
  icon: React.ReactNode
  label: string
  onClick: () => void
  hoverBg: string
  hoverBorder: string
}

const IntentButton = ({
  icon,
  label,
  onClick,
  hoverBg,
  hoverBorder,
}: IntentButtonProps) => (
  <button
    type='button'
    onClick={onClick}
    className={`
      flex flex-col items-center justify-center py-8 rounded-xl
      bg-slate-800/30 border border-slate-700/50 
      transition-all duration-300 group
      ${hoverBg} ${hoverBorder}
      hover:scale-[1.02] active:scale-95
    `}
  >
    <div className='mb-3 transition-transform duration-300 group-hover:scale-110'>
      {icon}
    </div>
    <span className='text-sm font-semibold tracking-tight text-slate-400 group-hover:text-slate-100 transition-colors'>
      {label}
    </span>
  </button>
)
