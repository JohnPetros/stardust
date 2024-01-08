import { authEmails } from './authEmails'

import { EmailProvider } from '@/@types/emailProvider'

let emailProvider: EmailProvider

export function initializeEmailProvider(emailProviderInstance: EmailProvider) {
  emailProvider = emailProviderInstance
}

export function useEmail() {
  if (!emailProvider) throw new Error('Email provider must be provided')

  return {
    ...authEmails(emailProvider),
  }
}
