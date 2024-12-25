// deno-lint-ignore-file

// import { HandleSignUpController } from 'controllers/auth/HandleSignUpController'
// import { DenoHttp } from 'deno/DenoHttp'
import { SupabaseAuthUser, SupabasePayload } from '../types/index.ts'
import { AchievementsFaker } from 'npm:@stardust-org/core@0.1.12'

Deno.serve(async (request) => {
  const payload: SupabasePayload<SupabaseAuthUser> = await request.json()
  const schema = {
    body: { userId: payload.record.id },
  }

  const achievement = AchievementsFaker.fakeDto()

  // const http = DenoHttp<typeof schema>({ body: schema.body })
  // const controller = HandleSignUpController()
  // return controller.handle(http) as unknown as Response
  return new Response(JSON.stringify({ achievement }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
})
