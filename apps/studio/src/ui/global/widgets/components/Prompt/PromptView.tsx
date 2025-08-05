import { type ReactNode, useRef } from 'react'

import { Button } from '@/ui/shadcn/components/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/ui/shadcn/components/dialog'
import type { DialogRef } from '@/ui/shadcn/components/dialog'
import { cn } from '@/ui/shadcn/utils/index'

type PromptViewProps = {
  children?: ReactNode
  title: string
  value: string
  dialogRef: React.RefObject<DialogRef | null>
  onValueChange: (value: string) => void
  onConfirm: () => void
  onCancel?: () => void
}

export const PromptView = ({
  children: trigger,
  title,
  value,
  dialogRef,
  onValueChange,
  onConfirm,
  onCancel,
}: PromptViewProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)

  return (
    <Dialog ref={dialogRef}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{title ?? 'Digite um valor no campo abaixo'}</DialogTitle>
        </DialogHeader>

        <div className='mx-auto my-6 w-full items-center justify-center'>
          <input
            ref={(ref) => {
              inputRef.current = ref
              setTimeout(() => {
                inputRef.current?.focus()
              }, 10)
            }}
            type='text'
            value={value}
            onChange={({ currentTarget }) => onValueChange(currentTarget.value)}
            autoCapitalize='none'
            className={cn(
              'file:text-foreground dark selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
              'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
              'prompt-input border-gray-100 bg-purple-700 text-gray-100 focus:border-green-500',
            )}
          />
        </div>

        <DialogFooter className='flex gap-2'>
          <Button variant='destructive' className='w-32 text-sm' onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            className='w-32 bg-green-400 text-sm text-green-900'
            onClick={onConfirm}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
