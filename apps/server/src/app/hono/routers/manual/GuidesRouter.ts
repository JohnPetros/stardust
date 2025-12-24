import { Hono } from 'hono'
import { FetchAllGuidesController } from '@/rest/controllers/manual'
import { SupabaseGuidesRepository } from '@/database'
import { HonoHttp } from '../../HonoHttp'
import { HonoRouter } from '../../HonoRouter'

export class GuidesRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/guides')

  private registerFetchAllGuidesRoute(): void {
    this.router.get('/', async (context) => {
      const http = new HonoHttp(context)
      const repository = new SupabaseGuidesRepository(context.get('supabase'))
      const controller = new FetchAllGuidesController(repository)
      const response = await controller.handle(http)
      return http.sendResponse(response)
    })
  }

  registerRoutes(): Hono {
    this.registerFetchAllGuidesRoute()
    return this.router
  }
}
