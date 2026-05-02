import type { Action, Call } from '@stardust/core/global/interfaces'
import { User } from '@stardust/core/global/entities'

export const AccessSnippetsPageAction = (): Action => {
  return {
    async handle(call: Call) {
      User.create(await call.getUser())
    },
  }
}
