import type { IAction, IActionServer } from '@stardust/core/interfaces'
import { User } from '@stardust/core/global/entities'

export const AccessEndingPageAction = (): IAction => {
  return {
    async handle(actionServer: IActionServer) {
      const user = User.create(await actionServer.getUser())
      if (user.hasCompletedSpace.isFalse) {
        actionServer.notFound()
      }
    },
  }
}
