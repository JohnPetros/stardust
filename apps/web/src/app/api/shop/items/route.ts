import { NextHttp } from '@/api/next/NextHttp'
import { runApiRoute } from '@/api/next/utils'
import { FetchShopItemsController } from '@/api/controllers/shop'
import { SupabaseRouteHandlerClient } from '@/api/supabase/clients'
import { SupabaseShopService } from '@/api/supabase/services'

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
