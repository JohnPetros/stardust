import { useRefMock } from '@/__tests__/mocks/hooks/useRefMock'
import type { AlertDialogRef } from '../../types'

const openMock = jest.fn()
const closeMock = jest.fn()

export const alertDialogRefMock = useRefMock<AlertDialogRef>({
  open: openMock,
  close: closeMock,
})
