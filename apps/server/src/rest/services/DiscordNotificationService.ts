import type { RestClient } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { NotificationService } from '@stardust/core/notification/interfaces'

export class DiscordNotificationService implements NotificationService {
  constructor(private readonly restClient: RestClient) {}

  async sendPlanetCompletedNotification(
    userSlug: string,
    userName: string,
    planetName: string,
  ): Promise<RestResponse> {
    return await this.restClient.post('/', {
      content: `🎉 Um usuário concluiu o planeta ${planetName} 🪐, seu nome é ${userName}. Link do perfil: https://stardust-app.com.br/profile/${userSlug}`,
    })
  }

  async sendSpaceCompletedNotification(
    userSlug: string,
    userName: string,
  ): Promise<RestResponse> {
    return await this.restClient.post('/', {
      content: `🎉 Um usuário concluiu todo o espaço de exploração 🌌, seu nome é ${userName}. Link do perfil: https://stardust-app.com.br/profile/${userSlug}`,
    })
  }

  async sendErrorNotification(errorMessage: string): Promise<RestResponse> {
    return await this.restClient.post('/', {
      content: `🚨 Erro interno da aplicação server: ${errorMessage}`,
    })
  }
}
