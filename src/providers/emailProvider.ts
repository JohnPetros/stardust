import { cache } from 'react'

import { EmailProvider } from '@/@types/emailProvider'
import { resendProvider } from '@/libs/resend'

export const getEmailProvider = cache((): EmailProvider => resendProvider)
