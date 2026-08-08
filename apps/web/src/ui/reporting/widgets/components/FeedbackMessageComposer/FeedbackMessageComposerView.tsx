import { Icon } from '@/ui/global/widgets/components/Icon'
import { FeedbackAttachmentsInput } from '../FeedbackAttachmentsInput'
import type { FeedbackConversationDraft } from '@/ui/reporting/types'

type Props = {
  draft: FeedbackConversationDraft
  onChange: (draft: FeedbackConversationDraft) => void
  onSubmit: () => void
  isLoading: boolean
  isClosed: boolean
}

export function FeedbackMessageComposerView({
  draft,
  onChange,
  onSubmit,
  isLoading,
  isClosed,
}: Props) {
  if (isClosed) {
    return (
      <div
        role='status'
        className='rounded-xl border border-gray-800 bg-gray-900/70 p-4 text-center text-sm text-gray-500'
      >
        Este reporte está fechado. A conversa permanece disponível para consulta.
      </div>
    )
  }
  const canSubmit =
    draft.content.trim().length > 0 && draft.content.trim().length <= 2000 && !isLoading
  return (
    <div className='space-y-3 border-t border-gray-800/80 pt-4'>
      <label
        htmlFor='feedback-reply'
        className='text-xs font-semibold uppercase tracking-[0.16em] text-gray-500'
      >
        Nova resposta
      </label>
      <textarea
        id='feedback-reply'
        value={draft.content}
        onChange={(event) => onChange({ ...draft, content: event.target.value })}
        placeholder='Escreva uma resposta para a equipe…'
        maxLength={2000}
        disabled={isLoading}
        className='min-h-24 w-full resize-y rounded-xl border border-gray-800 bg-gray-950 p-3 text-sm text-gray-100 outline-none placeholder:text-gray-600 focus:border-green-500'
        aria-describedby='feedback-reply-hint'
      />
      <div className='flex items-center justify-between gap-3'>
        <span id='feedback-reply-hint' className='text-[11px] text-gray-600'>
          {draft.content.length}/2.000 · rascunho salvo nesta sessão
        </span>
        <button
          type='button'
          onClick={onSubmit}
          disabled={!canSubmit}
          className='flex h-10 items-center gap-2 rounded-xl bg-green-400 px-4 text-xs font-black uppercase tracking-wide text-gray-950 transition hover:bg-green-300 disabled:cursor-not-allowed disabled:opacity-40'
        >
          <Icon name='send' size={15} /> Enviar
        </button>
      </div>
      <FeedbackAttachmentsInput
        attachments={draft.attachments}
        max={3}
        disabled={isLoading}
        onChange={(attachments) => onChange({ ...draft, attachments })}
        label='Imagens da resposta'
      />
    </div>
  )
}
