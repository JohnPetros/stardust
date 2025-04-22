import { StringValidation } from '@stardust/core/global/libs'

const SERVER_ENV = {
  inngestSigningKey: process.env.INNGEST_SIGNING_KEY,
  inngestEventKey: process.env.INNGEST_EVENT_KEY,
}

new StringValidation(SERVER_ENV.inngestSigningKey, 'Inngest Signing Key').validate()
new StringValidation(SERVER_ENV.inngestEventKey, 'Inngest Event Key').validate()

export { SERVER_ENV }
