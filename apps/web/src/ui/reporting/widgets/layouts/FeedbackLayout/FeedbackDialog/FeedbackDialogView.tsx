import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/ui/global/widgets/components/Dialog'
import { Icon } from '@/ui/global/widgets/components/Icon'
import type { useFeedbackDialog } from './useFeedbackDialog'
import { SuccessStep } from './SuccessStep'
import { ErrorStep } from './ErrorStep'
import { InitialStep } from './InitialStep'
import { FormStep } from './FormStep'
import { SelectionCapture } from './SelectionCapture'

type Props = ReturnType<typeof useFeedbackDialog>

export const FeedbackDialogView = ({
  isOpen,
  setIsOpen,
  step,
  intent,
  isSubmitting,
  isCapturing,
  content,
  screenshotFile,
  setContent,
  setScreenshotFile,
  handleSelectIntent,
  handleStartCapture,
  handleFinishCapture,
  handleSubmit,
  reset,
  setStep,
}: Props) => {
  return (
    <>
      {isCapturing && (
        <SelectionCapture
          onCapture={handleFinishCapture}
          onCancel={() => {
            setIsOpen(true)
            handleFinishCapture(null)
          }}
        />
      )}

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) reset()
        }}
      >
        <DialogTrigger>
        <button
          type='button'
          className='fixed top-6 right-6 z-[60] flex items-center gap-2 px-5 py-2.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-slate-100 rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group'
        >
          <Icon
            name='comment'
            size={20}
            weight='fill'
            className='text-purple-400 group-hover:rotate-12 transition-transform'
          />
          <span className='font-semibold text-xs tracking-widest uppercase'>
            Feedback
          </span>
        </button>
      </DialogTrigger>

      <DialogContent className='sm:max-w-[400px] md:max-w-[500px] bg-slate-900 border border-slate-800 text-slate-100 p-0 overflow-hidden rounded-2xl shadow-2xl outline-none select-none'>
        <div className='relative'>
          {step === 'initial' && <InitialStep onSelect={handleSelectIntent} />}
            {step === 'form' && (
              <FormStep
                intent={intent}
                content={content}
                setContent={setContent}
                screenshotFile={screenshotFile}
                setScreenshotFile={setScreenshotFile}
                isSubmitting={isSubmitting}
                onTakeScreenshot={handleStartCapture}
                onSubmit={handleSubmit}
                onBack={() => setStep('initial')}
              />
            )}
          {step === 'success' && <SuccessStep onClose={reset} />}
          {step === 'error' && <ErrorStep onRetry={() => setStep('form')} />}

          <div className='pb-4'>
            <a
              href='https://discord.gg/stardust'
              target='_blank'
              rel='noopener noreferrer'
              className='block mx-auto text-xs text-center text-slate-500 font-medium tracking-wide hover:text-slate-300 transition-colors'
            >
              Nosso servidor do Discord
            </a>
          </div>
        </div>
      </DialogContent>
      </Dialog>
    </>
  )
}
