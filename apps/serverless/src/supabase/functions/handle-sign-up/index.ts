// deno-lint-ignore-file

// import { HandleSignUpController } from 'controllers/auth/HandleSignUpController'
import { HTTP_STATUS_CODE } from '@stardust/core'

Deno.serve(async (request) => {
  // const payload: SupabasePayload<SupabaseAuthUser> = await request.json()
  // const schema = {
  //   body: { userId: payload.record.id },
  // }

  // const http = DenoHttp<typeof schema>({ body: schema.body })
  // const controller = HandleSignUpController()
  // return controller.handle(http) as unknown as Response
  return new Response(JSON.stringify({ message: HTTP_STATUS_CODE.notFound }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200,
  })
})
