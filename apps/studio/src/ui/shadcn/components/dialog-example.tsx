import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './dialog'
import { Button } from './button'
import { useDialogRef } from './use-dialog-ref'

/**
 * Exemplo de uso do Dialog com controle via ref usando o hook personalizado
 *
 * Este componente demonstra como usar o Dialog com controle programático
 * através de uma ref, permitindo abrir, fechar e alternar o dialog
 * de qualquer lugar do código.
 */
export function DialogExample() {
  // Hook personalizado para controlar o dialog
  const { dialogRef, openDialog, closeDialog, toggleDialog } = useDialogRef()

  return (
    <div className='space-y-4 p-6'>
      <h2 className='text-xl font-semibold'>Dialog com Controle via Ref</h2>

      {/* Botões para controlar o dialog programaticamente */}
      <div className='flex gap-2'>
        <Button onClick={openDialog} variant='default'>
          Abrir Dialog
        </Button>
        <Button onClick={closeDialog} variant='outline'>
          Fechar Dialog
        </Button>
        <Button onClick={toggleDialog} variant='secondary'>
          Alternar Dialog
        </Button>
      </div>

      {/* Dialog com ref */}
      <Dialog ref={dialogRef}>
        {/* Trigger normal ainda funciona */}
        <DialogTrigger asChild>
          <Button variant='outline'>Abrir via Trigger</Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dialog Controlado via Ref</DialogTitle>
          </DialogHeader>

          <div className='py-4'>
            <p>Este dialog pode ser controlado de duas formas:</p>
            <ul className='list-disc list-inside mt-2 space-y-1 text-sm text-zinc-400'>
              <li>Através do trigger normal (botão acima)</li>
              <li>Programaticamente via ref (botões externos)</li>
            </ul>
          </div>

          <DialogFooter>
            <Button onClick={closeDialog}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
