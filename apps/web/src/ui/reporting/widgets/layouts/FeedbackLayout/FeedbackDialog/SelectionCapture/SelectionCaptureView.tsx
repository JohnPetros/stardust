'use client'

import { useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { Icon } from '@/ui/global/widgets/components/Icon'

type Props = {
  onCapture: (file: File | null) => void
  onCancel: () => void
}

export const SelectionCaptureView = ({ onCapture, onCancel }: Props) => {
  const [isSelecting, setIsSelecting] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 })
  const overlayRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsSelecting(true)
    setStartPos({ x: e.clientX, y: e.clientY })
    setCurrentPos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSelecting) return
    setCurrentPos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseUp = async () => {
    if (!isSelecting) return
    setIsSelecting(false)

    const x = Math.min(startPos.x, currentPos.x)
    const y = Math.min(startPos.y, currentPos.y)
    const width = Math.abs(startPos.x - currentPos.x)
    const height = Math.abs(startPos.y - currentPos.y)

    if (width < 10 || height < 10) return

    try {
      // Hide selection rectangle before capture
      const canvas = await html2canvas(document.body, {
        x: x + window.scrollX,
        y: y + window.scrollY,
        width,
        height,
        useCORS: true,
        backgroundColor: null,
      })

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], 'screenshot.png', { type: 'image/png' })
          onCapture(file)
        }
      })
    } catch (error) {
      console.error('Capture failed:', error)
      onCancel()
    }
  }

  const selectionRect = {
    left: Math.min(startPos.x, currentPos.x),
    top: Math.min(startPos.y, currentPos.y),
    width: Math.abs(startPos.x - currentPos.x),
    height: Math.abs(startPos.y - currentPos.y),
  }

  return (
    <button
      ref={overlayRef}
      type='button'
      className='fixed inset-0 z-[9999] cursor-crosshair bg-black/40 select-none flex flex-col items-center justify-center border-none'
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      aria-label='Selecionar área para captura'
      onKeyDown={(e) => {
        if (e.key === 'Escape') onCancel()
      }}
    >
      {!isSelecting && selectionRect.width === 0 && (
        <div className='bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-4 pointer-events-none animate-in zoom-in duration-300'>
          <div className='p-4 bg-purple-500/20 rounded-2xl border border-purple-500/30'>
            <Icon name='camera' size={32} className='text-purple-400' />
          </div>
          <div className='text-center space-y-1'>
            <p className='text-white font-bold text-lg'>Arraste para selecionar a área</p>
            <p className='text-slate-400 text-sm'>
              Pressione{' '}
              <kbd className='px-2 py-1 bg-slate-800 rounded border border-slate-700 text-xs'>
                ESC
              </kbd>{' '}
              para cancelar
            </p>
          </div>
        </div>
      )}

      {isSelecting && (
        <div
          className='absolute border-2 border-purple-500 bg-purple-500/10 shadow-[0_0_0_9999px_rgba(0,0,0,0.4)] pointer-events-none'
          style={{
            left: selectionRect.left,
            top: selectionRect.top,
            width: selectionRect.width,
            height: selectionRect.height,
          }}
        />
      )}
    </button>
  )
}
