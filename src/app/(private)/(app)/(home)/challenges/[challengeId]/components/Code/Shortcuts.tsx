import { SHORTCUTS } from '@/utils/constants'
import { X } from '@phosphor-icons/react'
import { Dialog, DialogTitle } from '@/app/components/Dialog'

interface ShortCutsProps {
  isOpen: boolean
  onClose: VoidFunction
}

export function Shortcuts({ isOpen, onClose }: ShortCutsProps) {
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <header className="flex justify-between border-b p-3">
        <DialogTitle className="mx-auto font-semibold text-white text-xl w-full flex justify-between items-center">
          Atalhos
          <button onClick={onClose}>
            <X className='text-xl' weight='bold' />
          </button>
        </DialogTitle>
      </header>
      <dl className='space-y-6 mt-3'>
        {SHORTCUTS.map((shortcut) => (
          <div key={shortcut.action} className='grid grid-cols-[2fr_1fr] items-center'>
            <dt className="text-gray-400">{shortcut.action}</dt>
            <dd className="ml-3 text-gray-400">{shortcut.command}</dd>
          </div>
        ))}
      </dl>
    </Dialog>
  )
}
