import type { RestClient } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { NotificationService } from '@stardust/core/notification/interfaces'
import type { EventPayload } from '@stardust/core/global/types'
import type { FeedbackReportSentEvent } from '@stardust/core/reporting/events'
import type { ChallengePostedEvent } from '@stardust/core/challenging/events'

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

  async sendFeedbackReportNotification(
    payload: EventPayload<typeof FeedbackReportSentEvent>,
  ): Promise<RestResponse> {
    const colors = {
      bug: 16711680, // Red
      idea: 16776960, // Yellow
      other: 65280, // Green
    }
    const intents = {
      bug: 'Bug',
      idea: 'Sugerir Ideia',
      other: 'Outro',
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
            ...(payload.author.entity?.slug
              ? [
                  {
                    name: 'Link para o perfil',
                    value: `https://stardust-app.com.br/profile/${payload.author.entity.slug}`,
                    inline: true,
                  },
                ]
              : []),
            {
              name: 'Link para o ver o feedback',
              value: `https://stardust-app.com.br/reporting/feedback/${payload.feedbackReportId}`,
              inline: false,
            },
          ],
          image: payload.screenshot ? { url: payload.screenshot } : undefined,
          timestamp: payload.feedbackReportSentAt,
        },
      ],
    })
  }

  async sendChallengePostedNotification(
    payload: EventPayload<typeof ChallengePostedEvent>,
  ): Promise<RestResponse> {
    return await this.restClient.post('/', {
      embeds: [
        {
          title: '🎯 Novo Desafio Criado!',
          description: `Um novo desafio foi criado pelo sistema: **${payload.challengeTitle}**`,
          color: 5763719, // Purple
          fields: [
            {
              name: 'Título',
              value: payload.challengeTitle,
              inline: false,
            },
            {
              name: 'Link do desafio',
              value: `https://stardust-app.com.br/challenging/${payload.challengeSlug}`,
              inline: false,
            },
            {
              name: 'Autor',
              value: payload.challengeAuthor.entity?.name ?? 'Sistema',
              inline: false,
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    })
  }
}
