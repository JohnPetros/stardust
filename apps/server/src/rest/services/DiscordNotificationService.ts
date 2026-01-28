import type { RestClient } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { NotificationService } from '@stardust/core/notification/interfaces'
import type { EventPayload } from '@stardust/core/global/types'
import type { FeedbackReportSentEvent } from '@stardust/core/reporting/events'

export class DiscordNotificationService implements NotificationService {
  constructor(private readonly restClient: RestClient) {}

  async sendPlanetCompletedNotification(
    userSlug: string,
    userName: string,
    planetName: string,
  ): Promise<RestResponse> {
    return await this.restClient.post('/', {
      embeds: [
        {
          title: '🪐 Planeta Concluído!',
          description: `Um usuário concluiu o planeta **${planetName}**`,
          color: 3447003, // Blue
          fields: [
            {
              name: 'Usuário',
              value: userName,
              inline: true,
            },
            {
              name: 'Link do perfil',
              value: `https://stardust-app.com.br/profile/${userSlug}`,
              inline: true,
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    })
  }

  async sendSpaceCompletedNotification(
    userSlug: string,
    userName: string,
  ): Promise<RestResponse> {
    return await this.restClient.post('/', {
      embeds: [
        {
          title: '🌌 Espaço Concluído!',
          description: 'Um usuário concluiu todo o espaço de exploração',
          color: 16776960, // Yellow
          fields: [
            {
              name: 'Usuário',
              value: userName,
              inline: true,
            },
            {
              name: 'Link do perfil',
              value: `https://stardust-app.com.br/profile/${userSlug}`,
              inline: true,
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    })
  }

  async sendErrorNotification(
    app: 'server' | 'web',
    errorMessage: string,
  ): Promise<RestResponse> {
    return await this.restClient.post('/', {
      embeds: [
        {
          title: '🚨 Erro Interno Detectado',
          description: errorMessage,
          color: 16711680, // Red
          fields: [
            {
              name: 'Aplicação',
              value: app,
              inline: true,
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    })
  }

  async sendFeedbackReportNotification(payload: EventPayload<typeof FeedbackReportSentEvent>): Promise<RestResponse> {
    const colors = {
      ISSUE: 16711680, // Red
      IDEA: 16776960, // Yellow
      PRAISE: 65280, // Green
    }
    const intents = {
      ISSUE: 'Bug',
      IDEA: 'Sugerir Ideia',
      PRAISE: 'Elogio',
    }

    const color = colors[payload.feedbackReportIntent as keyof typeof colors] || 0x3498db

    return await this.restClient.post('/', {
      embeds: [
        {
          title: `Novo Feedback de ${intents[payload.feedbackReportIntent as keyof typeof intents]}`,
          description: payload.feedbackReportContent,
          color: color,
          fields: [
            {
              name: 'Autor',
              value: payload.author.entity?.name ?? 'Anônimo',
              inline: true,
            },
            {
              name: 'Link para o perfil',
              value: `https://stardust-app.com.br/profile/${payload.author.entity?.slug}`,
              inline: true,
            },
             {
              name: 'Link para o ver o feedback',
              value: `https://stardust-app.com.br/reporting/feedback/${payload.feedbackReportId}`,
              inline: false,
            },
          ],
          timestamp: payload.feedbackReportSentAt,
        },
      ],
    })
  }
}
