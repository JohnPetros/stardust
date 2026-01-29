'use client'

import * as Dialog from '@/ui/global/widgets/components/Dialog'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { InitialStep } from './InitialStep'
import { FormStep } from './FormStep'
import { SuccessStep } from './SuccessStep'
import { ScreenCropper } from '../../../../../global/widgets/components/ScreenCropper'
import type { FeedbackStep } from './useFeedbackDialog'

type Props = {
  isOpen: boolean
  step: FeedbackStep
  content: string
  intent: string
  screenshotPreview?: string
  rawScreenshot?: string
  isCapturing: boolean
  isCropping: boolean
  isLoading: boolean
  onOpenChange: (open: boolean) => void
  onContentChange: (content: string) => void
  handleSelectIntent: (intent: string) => void
  handleBack: () => void
  handleReset: () => void
  handleCapture: () => void
  handleCropComplete: (image: string) => void
  handleCancelCrop: () => void
  handleDeleteScreenshot: () => void
  handleSubmit: () => void
}

const INTENT_HEADER_METADATA: Record<
  string,
  { label: string; icon: string; color: string }
> = {
  bug: { label: 'Problema', icon: 'bug', color: 'text-purple-500' },
  idea: { label: 'Ideia', icon: 'lightbulb', color: 'text-yellow-400' },
  other: { label: 'Outro', icon: 'comment', color: 'text-blue-400' },
}

export function FeedbackDialogView({
  isOpen,
  onOpenChange,
  step,
  content,
  onContentChange,
  intent,
  screenshotPreview,
  rawScreenshot,
  isCapturing,
  isCropping,
  isLoading,
  handleSelectIntent,
  handleBack,
  handleReset,
  handleCapture,
  handleCropComplete,
  handleCancelCrop,
  handleDeleteScreenshot,
  handleSubmit,
}: Props) {
  const currentIntent = INTENT_HEADER_METADATA[intent] || INTENT_HEADER_METADATA.other

  return (
    <Dialog.Container
      open={!isCapturing && !isCropping && isOpen}
      onOpenChange={onOpenChange}
    >
      <Dialog.Content className='sm:max-w-[400px] md:max-w-[620px] rounded-3xl border-gray-800 bg-[#121214] p-6 text-gray-100 shadow-2xl overflow-hidden'>
        <div className='flex items-center justify-between mb-2'>
          {step === 'form' ? (
            <button
              onClick={handleBack}
              type='button'
              className='text-gray-500 hover:text-gray-300 transition-colors'
            >
              <Icon name='arrow-left' size={20} />
            </button>
          ) : (
            <div className='w-5' />
          )}

          <Dialog.Title className='flex items-center gap-2'>
            {step === 'form' ? (
              <>
                <Icon
                  name={currentIntent.icon as any}
                  className={currentIntent.color}
                  size={24}
                />
                <span className='text-lg font-bold'>{currentIntent.label}</span>
              </>
            ) : (
              <span className='text-lg font-bold'>
                {step === 'initial' ? 'Deixe seu feedback' : ''}
              </span>
            )}
          </Dialog.Title>

          <Dialog.Close className='text-gray-500 hover:text-gray-300 transition-colors'>
            <Icon name='close' size={20} />
          </Dialog.Close>
        </div>

        {step === 'initial' && <InitialStep onSelectIntent={handleSelectIntent} />}

        {step === 'form' && (
          <FormStep
            intent={intent}
            content={content}
            onContentChange={onContentChange}
            screenshotPreview={screenshotPreview}
            isLoading={isLoading}
            onCapture={handleCapture}
            onDeleteScreenshot={handleDeleteScreenshot}
            onSubmit={handleSubmit}
          />
        )}

        {step === 'success' && <SuccessStep onReset={handleReset} />}

        {(step === 'initial' || step === 'form' || step === 'success') && (
          <div className='mt-4 flex justify-center'>
            <a
              href='https://discord.gg/stardust'
              target='_blank'
              rel='noreferrer'
              className='text-xs text-gray-400 underline underline-offset-4 hover:text-gray-300'
            >
              Nosso servidor do Discord
            </a>
          </div>
        )}
      </Dialog.Content>

      <Dialog.Trigger>
        <button
          type='button'
          className='group fixed bottom-6 right-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-[#8257e5] text-white shadow-[0_8px_32px_rgba(130,87,229,0.4)] transition-all duration-300 hover:scale-110 active:scale-95'
          aria-label='Feedback'
        >
          <Icon
            name='comment'
            size={28}
            className='transition-transform group-hover:rotate-12'
          />
          <div className='absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#121214] bg-[#8257e5]' />
        </button>
      </Dialog.Trigger>

      {isCropping && rawScreenshot && (
        <ScreenCropper
          image={rawScreenshot}
          onCropComplete={handleCropComplete}
          onCancel={handleCancelCrop}
        />
      )}
    </Dialog.Container>
  )
}
