import { createTool } from '@mastra/core/tools'

import { supabase } from '@/database/supabase'
import { SupabaseUsersRepository } from '@/database/supabase/repositories'
import { TOOLS_DESCRIPTIONS } from '@/ai/profile/constants'
import { GetAccountUserTool } from '@/ai/profile/tools'
import { MastraMcp } from '../MastraMcp'
import { userSchema } from '@stardust/validation/profile/schemas'

export class ProfileToolkit {
  static get getAccountUserTool() {
    return createTool({
      id: 'get-account-user-tool',
      description: TOOLS_DESCRIPTIONS.getAccountUser,
      outputSchema: userSchema,
      execute: async (input, context) => {
        const mcp = new MastraMcp(input, context)
        const usersRepository = new SupabaseUsersRepository(supabase)
        const tool = new GetAccountUserTool(usersRepository)
        return await tool.handle(mcp)
      },
    })
  }

  static get publicTools() {
    return {
      getAccountUserTool: ProfileToolkit.getAccountUserTool,
    }
  }
}
