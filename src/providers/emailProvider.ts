import { cache } from 'react'

import { IEmailProvider } from './interfaces/IEmailProvider'

import { resendProvider } from '@/services/email/resend'

export const EmailProvider = cache((): IEmailProvider => resendProvider)
