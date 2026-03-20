import { ImageIcon } from 'lucide-react'

type Props = {
  preview: string
  picture?: string
}

export const BlockPreviewView = ({ preview, picture }: Props) => {
  return (
    <div className='flex items-center gap-2 text-sm text-zinc-300'>
      <span className='line-clamp-2'>{preview || 'Sem conteúdo ainda'}</span>
      {picture && (
        <span className='inline-flex items-center gap-1 rounded-full border border-zinc-700 px-2 py-0.5 text-xs text-zinc-400'>
          <ImageIcon className='h-3.5 w-3.5' />
          imagem
        </span>
      )}
    </div>
  )
}
