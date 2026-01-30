import { Button } from '@/ui/global/widgets/components/Button'
import { Icon } from '@/ui/global/widgets/components/Icon'
import Image from 'next/image'

type Props = {
  intent: string
  content: string
  onContentChange: (content: string) => void
  screenshotPreview?: string
  isLoading: boolean
  onCapture: () => void
  onDeleteScreenshot: () => void
  onSubmit: () => void
}

const INTENT_METADATA: Record<
  string,
  { label: string; icon: string; color: string; placeholder: string }
> = {
  bug: {
    label: 'Problema',
    icon: 'bug',
    color: 'text-green-500',
    placeholder:
      'Algo não está funcionando bem? Queremos corrigir. Conte com detalhes o que está acontecendo...',
  },
  idea: {
    label: 'Ideia',
    icon: 'lightbulb',
    color: 'text-yellow-400',
    placeholder: 'Teve uma ideia de melhoria ou de nova funcionalidade? Conta pra gente!',
  },
  other: {
    label: 'Outro',
    icon: 'comment',
    color: 'text-blue-400',
    placeholder: 'Queremos te ouvir. O que você gostaria de nos dizer?',
  },
}

export const FormStepView = ({
  intent,
  content,
  onContentChange,
  screenshotPreview,
  isLoading,
  onCapture,
  onDeleteScreenshot,
  onSubmit,
}: Props) => {
  const metadata = INTENT_METADATA[intent] || INTENT_METADATA.other

  return (
    <div className='flex flex-col gap-4 py-2'>
      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder={metadata.placeholder}
        className='h-40 w-full resize-none rounded-lg border border-gray-800 bg-gray-950 p-4 text-sm text-gray-100 outline-none transition-all placeholder:text-gray-500 focus:border-green-500'
        autoFocus
      />

      <div className='flex gap-2 items-end'>
        <button
          onClick={onCapture}
          type='button'
          className='flex h-12 w-12 items-center justify-center rounded-lg border border-gray-800 bg-gray-900/50 text-gray-500 hover:bg-gray-800 hover:text-gray-400'
        >
          <Icon name='camera' size={24} />
        </button>

        <Button
          onClick={onSubmit}
          isLoading={isLoading}
          className='flex-1 h-12 rounded-lg bg-green-500 text-sm text-gray-900 hover:bg-green-600'
        >
          Enviar feedback
        </Button>
      </div>

      {screenshotPreview && (
        <div className='group relative mt-2 overflow-hidden rounded-lg border border-gray-800'>
          <Image
            src={screenshotPreview}
            alt='Screenshot'
            width={400}
            height={225}
            className='aspect-video w-full object-cover'
            unoptimized
          />
          <div className='absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100'>
            <Button
              onClick={onDeleteScreenshot}
              className='h-8 w-auto border-none bg-red-500/80 px-3 text-white hover:bg-red-500'
            >
              Remover anexo
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
