import { Button } from '@/ui/global/widgets/components/Button'
import { Icon } from '@/ui/global/widgets/components/Icon'
import Image from 'next/image'
import type { ChangeEventHandler } from 'react'
import type { FeedbackFormMetadata } from './useFeedbackFormStep'

export type FormStepViewProps = {
  content: string
  onContentChange: (content: string) => void
  screenshotPreview?: string
  isLoading: boolean
  onCapture: () => void
  metadata: FeedbackFormMetadata
  onFileInputChange: ChangeEventHandler<HTMLInputElement>
  onDeleteScreenshot: () => void
  onSubmit: () => void
}

export const FormStepView = ({
  content,
  onContentChange,
  screenshotPreview,
  isLoading,
  onCapture,
  metadata,
  onFileInputChange,
  onDeleteScreenshot,
  onSubmit,
}: FormStepViewProps) => {
  return (
    <div className='flex flex-col gap-4 py-2'>
      <textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        maxLength={1000}
        minLength={10}
        aria-label='Descrição do feedback'
        placeholder={metadata.placeholder}
        className='h-40 w-full resize-none rounded-lg border border-gray-800 bg-gray-950 p-4 text-sm text-gray-100 outline-none transition-all placeholder:text-gray-500 focus:border-green-500'
        autoFocus
      />

      <div className='flex gap-2 items-end'>
        <button
          onClick={onCapture}
          type='button'
          aria-label='Adicionar captura de tela'
          className='flex h-12 w-12 items-center justify-center rounded-lg border border-gray-800 bg-gray-900/50 text-gray-500 hover:bg-gray-800 hover:text-gray-400'
        >
          <Icon name='camera' size={24} />
        </button>

        <label className='flex h-12 w-12 cursor-pointer items-center justify-center rounded-lg border border-gray-800 bg-gray-900/50 text-gray-500 hover:bg-gray-800 hover:text-gray-400'>
          <Icon name='file' size={24} />
          <span className='sr-only'>Selecionar imagem PNG ou JPEG</span>
          <input
            type='file'
            accept='image/png,image/jpeg'
            aria-label='Selecionar imagem PNG ou JPEG'
            className='sr-only'
            onChange={onFileInputChange}
          />
        </label>

        <Button
          onClick={onSubmit}
          isLoading={isLoading}
          className='flex-1 h-12 rounded-lg bg-green-500 text-sm text-gray-900 hover:bg-green-600'
        >
          Enviar feedback
        </Button>
      </div>
      <p className='text-right text-[11px] text-gray-600'>
        {content.length}/1.000 · mínimo de 10 caracteres
      </p>

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
