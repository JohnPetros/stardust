import { useEffect, useState } from 'react'

import type { NotificationService } from '@stardust/core/notification/interfaces'
import type { ToastProvider } from '@stardust/core/global/interfaces'
import { RestResponse } from '@stardust/core/global/responses'

import type { ChatErrorType } from './ChatErrorType'
import { CLIENT_ENV } from '@/constants'

type Params = {
  error?: Error
  service: NotificationService
  toastProvider: ToastProvider
}

export function useAssistantChatError({ error, service, toastProvider }: Params) {
  const [errorType, setErrorType] = useState<ChatErrorType | null>(null)

  useEffect(() => {
    if (!error) return

    async function handleChatError(error: Error) {
      let response: RestResponse = new RestResponse()

      console.log(error.message.includes('Limite de mensagens por chat excedido'))

      if (error.message.includes('You exceeded your current quota')) {
        if (CLIENT_ENV.mode === 'production' || CLIENT_ENV.mode === 'staging') {
          response = await service.sendErrorNotification(
            'web',
            'Cota da llm do chat assistente excedida',
          )
        }
        setErrorType('llm-quota-exceed')
      } else if (error.message.includes('Limite de mensagens por chat excedido')) {
        setErrorType('chat-messages-exceeded')
      }

      if (response.isFailure) {
        toastProvider.showError(response.errorMessage)
      }
    }
    handleChatError(error)
  }, [error, service.sendErrorNotification])

  return {
    errorType,
    setErrorType,
  }
}
