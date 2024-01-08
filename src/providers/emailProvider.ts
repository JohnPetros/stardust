import { cache } from 'react'

import { IEmailProvider } from './interfaces/IEmailProvider'

import { resendProvider } from '@/libs/resend'

export const EmailProvider = cache((): IEmailProvider => resendProvider)
