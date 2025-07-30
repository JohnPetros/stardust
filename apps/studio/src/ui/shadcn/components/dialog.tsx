import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'

import { cn } from '@/ui/shadcn/utils/index'

// Hook para gerenciar o estado do dialog
function useDialog(initialOpen = false) {
  const [open, setOpen] = React.useState(initialOpen)

  const openDialog = React.useCallback(() => {
    setOpen(true)
  }, [])

  const closeDialog = React.useCallback(() => {
    setOpen(false)
  }, [])

  const toggleDialog = React.useCallback(() => {
    setOpen((prev) => !prev)
  }, [])

  return {
    open,
    setOpen,
    openDialog,
    closeDialog,
    toggleDialog,
  }
}

// Interface para a ref do dialog
export interface DialogRef {
  open: () => void
  close: () => void
  toggle: () => void
}

// Componente Dialog com suporte a ref
const DialogComponent = React.forwardRef<
  DialogRef,
  React.ComponentProps<typeof DialogPrimitive.Root> & {
    defaultOpen?: boolean
  }
>(({ defaultOpen = false, children, ...props }, ref) => {
  const { open, setOpen, openDialog, closeDialog, toggleDialog } = useDialog(defaultOpen)

  React.useImperativeHandle(
    ref,
    () => ({
      open: openDialog,
      close: closeDialog,
      toggle: toggleDialog,
    }),
    [openDialog, closeDialog, toggleDialog],
  )

  return (
    <DialogPrimitive.Root
      data-slot='dialog'
      open={open}
      onOpenChange={setOpen}
      {...props}
    >
      {children}
    </DialogPrimitive.Root>
  )
})

DialogComponent.displayName = 'Dialog'

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot='dialog-trigger' {...props} />
}

function DialogPortal({ ...props }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot='dialog-portal' {...props} />
}

function DialogClose({ ...props }: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot='dialog-close' {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot='dialog-overlay'
      className={cn(
        'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
        className,
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal data-slot='dialog-portal'>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot='dialog-content'
        className={cn(
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg p-6 shadow-lg duration-200 sm:max-w-lg bg-zinc-900',
          className,
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot='dialog-close'
            className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <XIcon />
            <span className='sr-only'>Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='dialog-header'
      className={cn('flex flex-col gap-2 text-center sm:text-left', className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot='dialog-footer'
      className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot='dialog-title'
      className={cn('text-lg leading-none font-semibold', className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot='dialog-description'
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}

export {
  DialogComponent as Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}

/*
Exemplo de uso com ref:

import { useRef } from 'react'
import { Dialog, DialogContent, DialogTrigger, type DialogRef } from './dialog'
import { Button } from './button'

function MyComponent() {
  const dialogRef = useRef<DialogRef>(null)

  const handleOpenDialog = () => {
    dialogRef.current?.open()
  }

  const handleCloseDialog = () => {
    dialogRef.current?.close()
  }

  const handleToggleDialog = () => {
    dialogRef.current?.toggle()
  }

  return (
    <div>
      <Button onClick={handleOpenDialog}>Abrir Dialog</Button>
      <Button onClick={handleCloseDialog}>Fechar Dialog</Button>
      <Button onClick={handleToggleDialog}>Alternar Dialog</Button>

      <Dialog ref={dialogRef}>
        <DialogTrigger asChild>
          <Button>Trigger Normal</Button>
        </DialogTrigger>
        <DialogContent>
          <h2>Conteúdo do Dialog</h2>
          <p>Este dialog pode ser controlado via ref!</p>
        </DialogContent>
      </Dialog>
    </div>
  )
}
*/
