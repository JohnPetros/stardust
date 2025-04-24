import type { Action, Call } from '@stardust/core/global/interfaces'
import { User } from '@stardust/core/global/entities'

export const AccessEndingPageAction = (): Action => {
  return {
    async handle(call: Call) {
      const user = User.create(await call.getUser())
      if (user.hasCompletedSpace.isFalse) {
        call.notFound()
      }
    },
  }
}
