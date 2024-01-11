import { cache } from 'react'

import { IValidationProvider } from './interfaces/IValidationProvider'

import { zodProvider } from '@/services/validation/zod'

export const ValidationProvider = cache((): IValidationProvider => zodProvider)
