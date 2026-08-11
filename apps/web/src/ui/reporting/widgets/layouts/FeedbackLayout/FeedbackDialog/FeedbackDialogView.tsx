'use client'

import { CLIENT_ENV } from '@/constants'
import * as Dialog from '@/ui/global/widgets/components/Dialog'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { InitialStep } from './InitialStep'
import { FormStep } from './FormStep'
import { SuccessStep } from './SuccessStep'
import { ScreenCropper } from './ScreenCropper'
import type { FeedbackStep } from './useFeedbackDialog'
import type { FeedbackDialogHeaderMetadata } from './useFeedbackDialogHeader'
import { FeedbackReportsHistory } from '@/ui/reporting/widgets/components/FeedbackReportsHistory'
import { FeedbackReportConversation } from '@/ui/reporting/widgets/components/FeedbackReportConversation'
import { FeedbackMessageComposer } from '@/ui/reporting/widgets/components/FeedbackMessageComposer'
import { FeedbackUnreadBadge } from '@/ui/reporting/widgets/components/FeedbackUnreadBadge'
import type {
  FeedbackConversationDraft,
  FeedbackFilter,
  FeedbackRequestState,
} from '@/ui/reporting/types'
import type {
  FeedbackReportDetailsDto,
  FeedbackReportDto,
} from '@stardust/core/reporting/entities/dtos'

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
  handleSelectScreenshot: (file: File) => void
  handleBack: () => void
  handleReset: () => void
  handleCapture: () => void
  handleCropComplete: (image: string) => void
  handleCancelCrop: () => void
  handleDeleteScreenshot: () => void
  handleSubmit: () => void
  view: 'dialog' | 'history' | 'detail'
  reports: FeedbackReportDto[]
  detail: FeedbackReportDetailsDto | null
  filter: FeedbackFilter
  listState: FeedbackRequestState
  unreadCount: number
  hasMore: boolean
  draft: FeedbackConversationDraft
  replyLoading: boolean
  detailState: FeedbackRequestState
  onOpenHistory: () => void
  onFilterChange: (filter: FeedbackFilter) => void
  onSelectReport: (id: string) => void
  onLoadMore: () => void
  onRetry: () => void
  onBackToHome: () => void
  onDraftChange: (draft: FeedbackConversationDraft) => void
  onSendReply: () => void
  currentIntent: FeedbackDialogHeaderMetadata
}

export const FeedbackDialogView = ({
  isOpen,
  step,
  content,
  intent,
  screenshotPreview,
  rawScreenshot,
  isCapturing,
  isCropping,
  isLoading,
  triggerClassName = 'bottom-6 left-24',
  handleSelectIntent,
  handleSelectScreenshot,
  handleBack,
  handleReset,
  handleCapture,
  handleCropComplete,
  handleCancelCrop,
  handleDeleteScreenshot,
  handleSubmit,
  onOpenChange,
  onContentChange,
  view,
  reports,
  detail,
  filter,
  listState,
  unreadCount,
  hasMore,
  draft,
  replyLoading,
  detailState,
  onOpenHistory,
  onFilterChange,
  onSelectReport,
  onLoadMore,
  onRetry,
  onBackToHome,
  onDraftChange,
  onSendReply,
  currentIntent,
}: Props) => {
  return (
    <Dialog.Container
      open={!isCapturing && !isCropping && isOpen}
      onOpenChange={onOpenChange}
    >
      <Dialog.Content
        data-feedback-ignore-capture='true'
        animationClassName={`flex h-full w-full flex-col ${view === 'history' ? 'sm:min-h-[604px]' : view === 'detail' ? 'sm:min-h-[480px]' : step === 'initial' ? 'sm:min-h-[394px]' : ''}`}
        className='w-[calc(100vw-1rem)] max-h-[calc(100dvh-1rem)] overflow-y-auto rounded-3xl border-gray-800 bg-[#121214] p-0 text-gray-100 sm:max-w-[665px]'
      >
        <div
          className={`mb-2 flex items-center ${view === 'dialog' ? 'justify-between' : 'gap-4'}`}
        >
          {view !== 'dialog' ? (
            <button
              onClick={onBackToHome}
              type='button'
              className='text-gray-500 hover:text-gray-900 transition-colors'
            >
              <Icon name='arrow-left' size={20} />
            </button>
          ) : step === 'form' ? (
            <button
              onClick={handleBack}
              type='button'
              className='text-gray-500 hover:text-gray-900 transition-colors'
            >
              <Icon name='arrow-left' size={20} />
            </button>
          ) : (
            <div className='w-5' />
          )}

          <Dialog.Title
            id={view === 'history' ? 'feedback-history-title' : undefined}
            className='flex items-center gap-2'
          >
            {view === 'history' ? (
              <span className='text-xl font-semibold text-gray-100'>Meus reportes</span>
            ) : view === 'detail' ? (
              <span className='text-lg font-bold'>{detail?.title ?? 'Conversa'}</span>
            ) : step === 'form' ? (
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

          <Dialog.Close
            className={`text-gray-500 transition-colors hover:text-gray-300 ${view !== 'dialog' ? 'ml-auto' : ''}`}
          >
            <Icon name='close' size={20} />
          </Dialog.Close>
        </div>

        {view === 'history' && (
          <FeedbackReportsHistory
            reports={reports}
            filter={filter}
            state={listState}
            onFilterChange={onFilterChange}
            onSelect={onSelectReport}
            onLoadMore={onLoadMore}
            hasMore={hasMore}
            onRetry={onRetry}
          />
        )}
        {view === 'detail' && detailState === 'loading' && (
          <div role='status' className='py-12 text-center text-sm text-gray-500'>
            Carregando conversa…
          </div>
        )}
        {view === 'detail' && detailState === 'error' && (
          <div role='alert' className='py-12 text-center'>
            <p className='text-sm text-gray-300'>Não foi possível abrir este reporte.</p>
            <button
              type='button'
              onClick={onBackToHome}
              className='mt-4 text-xs font-bold text-green-400 underline'
            >
              Voltar
            </button>
          </div>
        )}
        {view === 'detail' && detailState === 'content' && detail && (
          <div className='flex min-h-0 flex-1 flex-col'>
            <div className='mb-4 flex items-center justify-between gap-3'>
              <p className='text-[10px] uppercase tracking-[0.16em] text-gray-500'>
                REPORTE #{detail.id?.slice(0, 5).toUpperCase()} ·{' '}
                <span>{detail.status === 'closed' ? 'Fechado' : 'Aberto'}</span> ·{' '}
                {detail.messages.length + 1} MENSAGENS
              </p>
            </div>
            <FeedbackReportConversation detail={detail} cdnUrl={CLIENT_ENV.cdnUrl} />
            <FeedbackMessageComposer
              draft={draft}
              onChange={onDraftChange}
              onSubmit={onSendReply}
              isLoading={replyLoading}
              isClosed={detail.status === 'closed'}
            />
          </div>
        )}
        {view === 'dialog' && step === 'initial' && (
          <InitialStep
            onSelectIntent={handleSelectIntent}
            onOpenHistory={onOpenHistory}
            unreadCount={unreadCount}
          />
        )}

        {step === 'form' && (
          <FormStep
            intent={intent}
            content={content}
            onContentChange={onContentChange}
            onSelectFile={handleSelectScreenshot}
            screenshotPreview={screenshotPreview}
            isLoading={isLoading}
            onCapture={handleCapture}
            onDeleteScreenshot={handleDeleteScreenshot}
            onSubmit={handleSubmit}
          />
        )}

        {step === 'success' && <SuccessStep onReset={handleReset} />}

        {view === 'dialog' &&
          (step === 'initial' || step === 'form' || step === 'success') && (
            <div className='mt-4 flex justify-center'>
              <a
                href={CLIENT_ENV.discordChannelUrl}
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
          className={`group fixed bottom-4 right-4 md:bottom-6 md:left-24 md:right-auto w-auto h-12 z-50 flex items-center justify-center rounded-full bg-transparent px-3 text-black transition-transform duration-300 hover:scale-[1.02] active:scale-95 ${triggerClassName}`}
        >
          <button
            type='button'
            aria-label='Feedback'
            className='z-10 flex items-center gap-0 transition-all duration-300 hover:gap-2'
          >
            <span
              aria-hidden='true'
              className='absolute inset-0 rounded-full bg-green-500 opacity-25 transition-opacity duration-300 group-hover:opacity-100'
            />
            <span className='relative z-10 flex items-center gap-0 text-black opacity-25 transition-opacity duration-300 group-hover:opacity-100'>
              <Icon
                name='comment'
                size={24}
                className='transition-transform group-hover:rotate-12'
              />
              <span className='inline-block w-0 shrink-0 overflow-hidden whitespace-nowrap text-md font-semibold text-gray-950 transition-[width] duration-300 group-hover:w-[124px]'>
                Fazer feedback
              </span>
            </span>
            <FeedbackUnreadBadge count={unreadCount} />
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
