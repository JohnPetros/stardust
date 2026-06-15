import { Event } from '#global/domain/abstracts/Event'

type Payload = {
  userId: string
  challengeId: string
}

export class ChallengeCompletedEvent extends Event<Payload> {
  static readonly _NAME = 'profile/challenge.completed'

  constructor(readonly payload: Payload) {
    super(ChallengeCompletedEvent._NAME, payload)
  }
}
