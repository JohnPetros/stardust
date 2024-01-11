import { ValidationProvider } from '@/providers/validationProvider'

const validationProvider = ValidationProvider()

export function useValidation() {
  return validationProvider
}
