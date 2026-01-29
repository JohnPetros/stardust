import { Icon } from '@/ui/global/widgets/components/Icon'

type Props = {
  onClose: () => void
}

export const SuccessStepView = ({ onClose }: Props) => (
  <div className='flex flex-col items-center justify-center p-8 space-y-8 animate-in zoom-in-95 fade-in duration-300'>
    <div className='flex flex-col items-center gap-4'>
      <div className='h-16 w-16 bg-green-500/10 rounded-2xl flex items-center justify-center border-2 border-green-500/20 shadow-xl shadow-green-500/5'>
        <div className='h-12 w-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20'>
          <Icon name='check' size={32} weight='fill' className='text-white' />
        </div>
      </div>
      <p className='text-2xl font-bold text-center text-slate-100 tracking-tight'>
        Agradecemos o feedback!
      </p>
    </div>

    <button
      type='button'
      onClick={onClose}
      className='bg-slate-800 hover:bg-slate-700 text-slate-100 text-sm font-bold py-3.5 px-8 rounded-xl transition-all w-full border border-slate-700 hover:border-slate-600 active:scale-95 shadow-lg shadow-slate-950/20'
    >
      Quero enviar outro
    </button>
  </div>
)
