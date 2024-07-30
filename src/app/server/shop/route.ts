import { NextHttp } from '@/server/protocols/http'
import { SupabaseRouteHandlerClient } from '@/infra/api/supabase/clients'
import {
  SupabaseAvatarsService,
  SupabaseRocketsService,
} from '@/infra/api/supabase/services'

import { FetchShopItemsController } from '@/server/controllers/app'

export async function GET() {
  const nextHttp = NextHttp()

  const supabase = SupabaseRouteHandlerClient()
  const rocketsService = SupabaseRocketsService(supabase)
  const avatarsService = SupabaseAvatarsService(supabase)

  const controller = FetchShopItemsController(rocketsService, avatarsService)
  const httpResponse = await controller.handle(nextHttp)

  return httpResponse.body
}
