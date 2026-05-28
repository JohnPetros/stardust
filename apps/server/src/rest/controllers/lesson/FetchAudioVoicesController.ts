import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AudioVoiceDto } from '@stardust/core/lesson/structures/dtos'

export class FetchAudioVoicesController implements Controller {
  async handle(http: Http) {
    const voices: AudioVoiceDto[] = [
      { value: 'panda', label: 'Panda' },
      { value: 'shark', label: 'Tubarão' },
      { value: 'princess', label: 'Princesa' },
      { value: 'alien', label: 'Alien' },
      { value: 'robot', label: 'Robô' },
      { value: 'salmonense', label: 'Salmonense' },
    ]

    return http.send(voices)
  }
}
