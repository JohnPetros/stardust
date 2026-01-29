import { Button } from '@/ui/global/widgets/components/Button'
import type { RefObject } from 'react'
import { Cropper } from 'react-advanced-cropper'
import 'react-advanced-cropper/dist/style.css'

type Props = {
  image: string
  cropperRef: RefObject<any>
  onCancel: () => void
  handleDone: () => void
}

export function ScreenCropperView({
  image,
  cropperRef,
  onCancel,
  handleDone,
}: Props) {
  return (
    <div className='fixed inset-0 z-[10000] flex flex-col bg-black'>
      <div className='relative flex-1 min-h-0'>
        <Cropper
          ref={cropperRef}
          src={image}
          className={'h-full w-full outline-none'}
          stencilProps={{
            grid: true,
          }}
          backgroundWrapperProps={{
            scaleImage: false,
            moveImage: false,
          }}
        />
      </div>

      <div className='relative z-50 flex h-20 items-center justify-between border-t border-gray-800 bg-[#121214] px-6'>
        <p className='text-sm text-gray-400 mr-auto hidden sm:block'>
          Selecione a área onde se encontra o bug
        </p>
        <div className='flex items-center gap-3'>
          <Button
            onClick={onCancel}
            className='w-32 border border-gray-800 bg-transparent text-gray-300 hover:bg-gray-800'
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDone}
            className='w-32 bg-purple-600 font-bold text-white hover:bg-purple-700'
          >
            Recortar
          </Button>
        </div>
      </div>
    </div>
  )
}
