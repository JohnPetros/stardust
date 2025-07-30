import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './dialog'
import { Button } from './button'
import { Input } from './input'
import { useDialogRef } from './use-dialog-ref'

/**
 * Exemplo avançado de uso do Dialog com controle via ref
 *
 * Demonstra cenários reais como:
 * - Formulários com validação
 * - Confirmações de ações
 * - Feedback de operações
 */
export function DialogAdvancedExample() {
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [isLoading, setIsLoading] = useState(false)

  // Múltiplos dialogs para diferentes propósitos
  const formDialog = useDialogRef()
  const confirmDialog = useDialogRef()
  const successDialog = useDialogRef()

  const handleFormSubmit = async () => {
    setIsLoading(true)

    // Simula uma operação assíncrona
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)
    formDialog.closeDialog()
    successDialog.openDialog()
  }

  const handleDeleteAction = () => {
    confirmDialog.openDialog()
  }

  const handleConfirmDelete = () => {
    confirmDialog.closeDialog()
    // Simula a exclusão
    console.log('Item deletado!')
  }

  return (
    <div className='space-y-6 p-6'>
      <h2 className='text-2xl font-semibold'>Exemplos Avançados de Dialog</h2>

      {/* Seção de Formulário */}
      <div className='space-y-4'>
        <h3 className='text-lg font-medium'>1. Formulário com Validação</h3>
        <Button onClick={formDialog.openDialog} variant='default'>
          Abrir Formulário
        </Button>
      </div>

      {/* Seção de Confirmação */}
      <div className='space-y-4'>
        <h3 className='text-lg font-medium'>2. Confirmação de Ação</h3>
        <Button onClick={handleDeleteAction} variant='destructive'>
          Deletar Item
        </Button>
      </div>

      {/* Dialog do Formulário */}
      <Dialog ref={formDialog.dialogRef}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Usuário</DialogTitle>
          </DialogHeader>

          <div className='space-y-4 py-4'>
            <div>
              <label className='text-sm font-medium'>Nome</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder='Digite o nome'
              />
            </div>

            <div>
              <label className='text-sm font-medium'>Email</label>
              <Input
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder='Digite o email'
                type='email'
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant='outline'
              onClick={formDialog.closeDialog}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleFormSubmit}
              disabled={isLoading || !formData.name || !formData.email}
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Confirmação */}
      <Dialog ref={confirmDialog.dialogRef}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>

          <div className='py-4'>
            <p>Tem certeza que deseja excluir este item?</p>
            <p className='text-sm text-zinc-400 mt-2'>Esta ação não pode ser desfeita.</p>
          </div>

          <DialogFooter>
            <Button variant='outline' onClick={confirmDialog.closeDialog}>
              Cancelar
            </Button>
            <Button variant='destructive' onClick={handleConfirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Sucesso */}
      <Dialog ref={successDialog.dialogRef}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sucesso!</DialogTitle>
          </DialogHeader>

          <div className='py-4'>
            <p>Usuário adicionado com sucesso!</p>
          </div>

          <DialogFooter>
            <Button onClick={successDialog.closeDialog}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
