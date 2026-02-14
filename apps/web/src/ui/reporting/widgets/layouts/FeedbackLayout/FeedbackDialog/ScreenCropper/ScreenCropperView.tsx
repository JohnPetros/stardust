'use client'

import { Button } from '@/ui/global/widgets/components/Button'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { Cropper } from 'react-advanced-cropper'
import 'react-advanced-cropper/dist/style.css'
import type { RefObject } from 'react'

type Props = {
  image: string
  cropperRef: RefObject<any>
  onCancel: () => void
  onDone: () => void
  onZoomIn: () => void
  onZoomOut: () => void
}

export const ScreenCropperView = ({
  image,
  cropperRef,
  onCancel,
  onDone,
  onZoomIn,
  onZoomOut,
}: Props) => {
  return (
    <div className="fixed inset-0 z-[10000] flex flex-col bg-black/95 backdrop-blur-sm">
      {/* <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-4 py-3 md:px-6 md:py-4 bg-[#121214] border-b border-white/5 gap-4 md:gap-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <Icon name="camera" className="text-green-500" size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-tight">
              Recortar Captura
            </h3>
            <p className="text-xs text-gray-400 hidden sm:block">
              Selecione a área onde se encontra o bug
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onZoomOut}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 transition-colors"
              title="Diminuir Zoom"
            >
              <Icon name="minus" size={18} />
            </button>
            <button
              type="button"
              onClick={onZoomIn}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 transition-colors"
              title="Aumentar Zoom"
            >
              <Icon name="plus" size={18} />
            </button>
          </div>

          <div className="hidden md:block w-px h-6 bg-white/10 mx-2" />

          <div className="flex items-center gap-2 flex-1 md:flex-initial">
            <Button
              onClick={onCancel}
              className="h-9 flex-1 md:w-40 px-4 text-[10px] md:text-xs bg-transparent border border-white/10 text-gray-400 hover:bg-white/5 hover:text-white transition-all"
            >
              Cancelar
            </Button>
            <Button
              onClick={onDone}
              className="h-9 flex-1 md:w-48 px-6 text-[10px] md:text-xs bg-green-500 text-black hover:bg-green-600 shadow-lg shadow-green-500/20 transition-all whitespace-nowrap"
            >
              Confirmar recorte
            </Button>
          </div>
        </div>
      </div> */}

      <Cropper
        ref={cropperRef}
        src={image}
        className="h-full w-full"
        wrapperProps={{
          style: { position: 'absolute', inset: 0, width: '100%', height: '100%' },
        }}
        backgroundWrapperProps={{
          style: { position: 'absolute', inset: 0, width: '100%', height: '100%' },
        }}
        boundaryProps={{
          style: { position: 'absolute', inset: 0, width: '100%', height: '100%' },
        }}
        stencilProps={{
          grid: true,
        }}
      />

      <div className="bg-[#121214] px-4 md:px-6 py-3 flex justify-center border-t border-white/5 text-center">
        <p className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-widest font-medium">
          Arraste e redimensione o seletor para enquadrar o problema
        </p>
      </div>
    </div>
  )
}
