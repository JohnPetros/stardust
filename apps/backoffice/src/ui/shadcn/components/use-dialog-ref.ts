import { useRef, useCallback } from 'react'
import type { DialogRef } from './dialog'

/**
 * Hook personalizado para facilitar o uso do Dialog com ref
 *
 * @returns Objeto contendo a ref e funções para controlar o dialog
 */
export function useDialogRef() {
  const dialogRef = useRef<DialogRef>(null)

  const openDialog = useCallback(() => {
    dialogRef.current?.open()
  }, [])

  const closeDialog = useCallback(() => {
    dialogRef.current?.close()
  }, [])

  const toggleDialog = useCallback(() => {
    dialogRef.current?.toggle()
  }, [])

  return {
    dialogRef,
    openDialog,
    closeDialog,
    toggleDialog,
  }
}
