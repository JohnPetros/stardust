import { Icon } from '@/ui/global/widgets/components/Icon'

type Props = {
  onRetry: () => void
}

export const ErrorStepView = ({ onRetry }: Props) => (
  <div className='flex flex-col items-center justify-center p-8 space-y-8 animate-in shake duration-500'>
    <div className='flex flex-col items-center gap-4'>
      <div className='h-16 w-16 bg-red-500/10 rounded-2xl flex items-center justify-center border-2 border-red-500/20 shadow-xl shadow-red-500/5'>
        <div className='h-12 w-12 bg-red-500 rounded-xl flex items-center justify-center shadow-lg shadow-red-500/20'>
          <Icon name='alert' size={32} weight='fill' className='text-white' />
        </div>
      </div>
      <div className='space-y-1 text-center'>
        <p className='text-2xl font-bold text-slate-100 tracking-tight'>
          Algo deu errado!
        </p>
        <p className='text-sm text-slate-400'>
          Não foi possível enviar seu feedback neste momento.
        </p>
      </div>
    </div>

    <button
      type='button'
      onClick={onRetry}
      className='bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-bold py-3.5 px-8 rounded-xl transition-all w-full border border-slate-700 hover:border-slate-600 active:scale-95 shadow-lg shadow-slate-950/20'
    >
      Tentar novamente
    </button>
  </div>
)
