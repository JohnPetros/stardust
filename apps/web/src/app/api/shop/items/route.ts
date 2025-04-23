import { NextHttp } from '@/rest/next/NextHttp'
import { runApiRoute } from '@/rest/next/utils'
import { FetchShopItemsController } from '@/rest/controllers/shop'
import { SupabaseRouteHandlerClient } from '@/rest/supabase/clients'
import { SupabaseShopService } from '@/rest/supabase/services'

export const dynamic = 'force-dynamic'

export async function GET() {
  return runApiRoute(async () => {
    const http = await NextHttp()
    const supabase = SupabaseRouteHandlerClient()
    const shopService = SupabaseShopService(supabase)
    const controller = FetchShopItemsController(shopService)
    return await controller.handle(http)
  })
}
