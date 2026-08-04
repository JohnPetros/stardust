import type { RestClient } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { RestResponse as RestResponseClass } from '@stardust/core/global/responses'
import type {
  FeedbackReplyDiscordPayload,
  NotificationService,
} from '@stardust/core/notification/interfaces'
import type { EventPayload } from '@stardust/core/global/types'
import type { FeedbackReportSentEvent } from '@stardust/core/reporting/events'
import type { ChallengePostedEvent } from '@stardust/core/challenging/events'
import type { UserCreatedEvent } from '@stardust/core/profile/events'

import { ENV } from '@/constants'

export class DiscordNotificationService implements NotificationService {
  constructor(private readonly restClient: RestClient) {}

  private async post(body: unknown): Promise<RestResponse> {
    if (ENV.mode === 'development') return new RestResponseClass()

    return await this.restClient.post('/', body)
  }

  async sendPlanetCompletedNotification(
    userSlug: string,
    userName: string,
    planetName: string,
  ): Promise<RestResponse> {
    return await this.post({
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
    return await this.post({
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
    return await this.post({
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

    return await this.post({
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

  async sendFeedbackReplyNotification(
    payload: FeedbackReplyDiscordPayload,
  ): Promise<RestResponse> {
    return await this.post({
      embeds: [
        {
          title: 'Nova resposta em feedback',
          description: payload.preview || 'O usuário enviou uma nova mensagem.',
          color: 3447003,
          fields: [
            { name: 'Reporte', value: payload.reportId, inline: true },
            { name: 'Mensagem', value: payload.messageId, inline: true },
            { name: 'Usuário', value: payload.userName ?? 'Usuário', inline: true },
            {
              name: 'Anexos',
              value: payload.hasAttachments ? 'Sim' : 'Não',
              inline: true,
            },
            ...(payload.conversationUrl
              ? [{ name: 'Ver conversa', value: payload.conversationUrl, inline: false }]
              : []),
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    })
  }

  async sendChallengePostedNotification(
    payload: EventPayload<typeof ChallengePostedEvent>,
  ): Promise<RestResponse> {
    return await this.post({
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
              value: `https://stardust-app.com.br/challenging/challenges/${payload.challengeSlug}/challenge`,
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

  async sendUserCreatedNotification(
    payload: EventPayload<typeof UserCreatedEvent>,
  ): Promise<RestResponse> {
    return await this.post({
      embeds: [
        {
          title: 'Usuário criado',
          description: 'Um novo usuario concluiu o onboarding inicial da plataforma.',
          color: 3066993,
          fields: [
            {
              name: 'Nome de usuário',
              value: payload.userName,
              inline: false,
            },
            {
              name: 'Perfil',
              value: `https://stardust-app.com.br/profile/${payload.userSlug}`,
              inline: false,
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    })
  }
}
