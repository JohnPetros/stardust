import { DialogClose } from '@/ui/global/widgets/components/Dialog'
import { Icon } from '@/ui/global/widgets/components/Icon'

type Props = {
  intent: 'bug' | 'idea' | 'other' | null
  content: string
  isSubmitting: boolean
  screenshotFile: File | null
  setContent: (content: string) => void
  setScreenshotFile: (file: File | null) => void
  onTakeScreenshot: () => void
  onSubmit: () => void
  onBack: () => void
}

export const FormStepView = ({
  intent,
  content,
  isSubmitting,
  screenshotFile,
  setContent,
  setScreenshotFile,
  onTakeScreenshot,
  onSubmit,
  onBack,
}: Props) => {
  const config = {
    bug: {
      title: 'Problema',
      icon: <Icon name='bug' size={24} weight='fill' className='text-purple-400' />,
      placeholder:
        'Algo não está funcionando bem? Queremos corrigir. Conte com detalhes o que está acontecendo...',
    },
    idea: {
      title: 'Ideia',
      icon: <Icon name='lightbulb' size={24} weight='fill' className='text-yellow-400' />,
      placeholder:
        'Teve uma ideia de melhoria ou de nova funcionalidade? Conta pra gente!',
    },
    other: {
      title: 'Outro',
      icon: <Icon name='comment' size={24} weight='fill' className='text-sky-400' />,
      placeholder: 'Queremos te ouvir. O que você gostaria de nos dizer?',
    },
  }[intent ?? 'other']

  return (
    <div className='animate-in fade-in slide-in-from-right-4 duration-300'>
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-3'>
          <button
            type='button'
            onClick={onBack}
            className='p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all'
            aria-label='Voltar'
          >
            <Icon name='arrow-left' size={20} />
          </button>
          <div className='flex items-center gap-2'>
            {config.icon}
            <h2 className='text-xl font-bold text-slate-100'>{config.title}</h2>
          </div>
        </div>
        <DialogClose className='p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-all'>
          <Icon name='close' size={20} />
        </DialogClose>
      </div>

      <div className='space-y-4'>
        <textarea
          autoFocus
          className='w-full min-h-[160px] bg-slate-950/40 border-2 border-slate-800/60 rounded-xl p-4 text-sm focus:outline-none focus:border-purple-500/40 focus:ring-4 focus:ring-purple-500/5 transition-all resize-none placeholder:text-slate-600 text-slate-200'
          placeholder={config.placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className='flex gap-3'>
          <div className='relative shrink-0'>
            {screenshotFile ? (
              <div className='h-12 w-12 relative group bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-inner'>
                {/* biome-ignore lint/performance/noImgElement: blob preview for user-selected file */}
                <img
                  src={URL.createObjectURL(screenshotFile)}
                  className='w-full h-full object-cover transition-transform group-hover:scale-110'
                  alt='Screenshot'
                />
                <button
                  type='button'
                  onClick={() => setScreenshotFile(null)}
                  className='absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'
                  aria-label='Remover imagem'
                >
                  <Icon name='close' size={16} className='text-white' />
                </button>
              </div>
            ) : (
              <button
                type='button'
                onClick={onTakeScreenshot}
                className='h-12 w-12 flex items-center justify-center bg-slate-800/40 hover:bg-slate-800/60 rounded-xl cursor-pointer transition-all border border-slate-700/50 hover:border-slate-600 text-slate-400 hover:text-slate-200 active:scale-95 group'
                aria-label='Tirar print da tela'
              >
                <Icon
                  name='camera'
                  size={22}
                  className='group-hover:scale-110 transition-transform'
                />
              </button>
            )}
          </div>

          <button
            type='button'
            onClick={onSubmit}
            disabled={isSubmitting || content.trim().length < 5}
            className={`
              flex-1 rounded-xl text-white font-bold py-3 px-6 
              transition-all duration-300 flex items-center justify-center gap-2
              shadow-lg shadow-purple-950/20
              ${
                isSubmitting || content.trim().length < 5
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 active:scale-[0.98]'
              }
            `}
          >
            {isSubmitting ? (
              <>
                <div className='h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                <span>Enviando...</span>
              </>
            ) : (
              'Enviar feedback'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
