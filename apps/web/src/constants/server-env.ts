import { StringValidation } from '@stardust/core/libs'

const SERVER_ENV = {
  inngestSigningKey: process.env.INNGEST_SIGNING_KEY,
}

new StringValidation(SERVER_ENV.inngestSigningKey, 'Inmgest Signing Key').validate()

export { SERVER_ENV }
