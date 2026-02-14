'use client'

import * as Dialog from '@/ui/global/widgets/components/Dialog'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { InitialStep } from './InitialStep'
import { FormStep } from './FormStep'
import { SuccessStep } from './SuccessStep'
import { ScreenCropper } from './ScreenCropper'
import type { FeedbackStep } from './useFeedbackDialog'
import type { IconName } from '@/ui/global/widgets/components/Icon/types'

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
  triggerClassName?: string
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
  { label: string; icon: IconName; color: string }
> = {
  bug: { label: 'Problema', icon: 'bug', color: 'text-green-500' },
  idea: { label: 'Ideia', icon: 'lightbulb', color: 'text-yellow-400' },
  other: { label: 'Outro', icon: 'comment', color: 'text-blue-400' },
}

export function FeedbackDialogView({
  isOpen,
  step,
  content,
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
  onOpenChange,
  onContentChange,
  triggerClassName = 'bottom-6 left-24',
}: Props) {
  const currentIntent = INTENT_HEADER_METADATA[intent] || INTENT_HEADER_METADATA.other

  return (
    <Dialog.Container
      open={!isCapturing && !isCropping && isOpen}
      onOpenChange={onOpenChange}
    >
      <Dialog.Content
        data-feedback-ignore-capture='true'
        className='sm:max-w-[400px] md:max-w-[620px] rounded-3xl border-gray-800 bg-[#121214] p-6 text-gray-100 overflow-hidden'
      >
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
                  name={currentIntent.icon}
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
              href='https://discord.com/channels/987782561252143205/1377325380037509212'
              target='_blank'
              rel='noreferrer'
              className='text-xs text-gray-400 underline underline-offset-4 hover:text-gray-300'
            >
              Nosso servidor do Discord
            </a>
          </div>
        )}
      </Dialog.Content>

      {!isCapturing && (
        <Dialog.Trigger
          data-feedback-ignore-capture='true'
          className={`hidden md:flex group fixed w-auto h-12 z-50 items-center justify-center rounded-full bg-green-500 text-black opacity-25 transition-all duration-300 hover:opacity-100 hover:scale-[1.02] active:scale-95 px-3 ${triggerClassName}`}
        >
          <button
            type='button'
            aria-label='Feedback'
            className='flex items-center gap-0 hover:gap-2 transition-all duration-300'
          >
            <Icon
              name='comment'
              size={24}
              className='transition-transform group-hover:rotate-12'
            />
            <span className='max-w-0 overflow-hidden whitespace-nowrap text-md font-semibold transition-all duration-300 group-hover:max-w-[124px]'>
              Fazer feedback
            </span>
          </button>
        </Dialog.Trigger>
      )}

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
