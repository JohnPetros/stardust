import { Hono } from 'hono'
import { FetchAllDocsController } from '@/rest/controllers/documentation'
import { SupabaseDocsRepository } from '@/database'
import { HonoHttp } from '../../HonoHttp'
import { HonoRouter } from '../../HonoRouter'

export class DocsRouter extends HonoRouter {
  private readonly router = new Hono().basePath('/docs')

  private registerFetchAllDocsRoute(): void {
    this.router.get('/', async (context) => {
      const http = new HonoHttp(context)
      const repository = new SupabaseDocsRepository(context.get('supabase'))
      const controller = new FetchAllDocsController(repository)
      const response = await controller.handle(http)
      return http.sendResponse(response)
    })
  }

  registerRoutes(): Hono {
    this.registerFetchAllDocsRoute()
    return this.router
  }
}
