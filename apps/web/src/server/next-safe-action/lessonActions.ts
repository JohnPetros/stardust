'use server'

import { authActionClient } from './clients/authActionClient'
import { NextActionServer } from '../next/NextActionServer'
import { AccessEndingPageAction } from '../actions/lesson'
import { SupabaseServerActionClient } from '@/api/supabase/clients'

const accessEndingPage = authActionClient.action(async ({ clientInput, ctx }) => {
  const actionServer = NextActionServer({
    request: clientInput,
    user: ctx.user,
  })
  const supabase = SupabaseServerActionClient()
  const action = AccessEndingPageAction()
  return action.handle(actionServer)
})

export { accessEndingPage }
