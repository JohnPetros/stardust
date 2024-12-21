import { NextHttp } from '@/api/next/NextHttp'
import { SupabaseRouteHandlerClient } from 'SupabaseServerClient'
import { SupabaseAvatarsService, SupabaseRocketsService } from '@/api/supabase/services'
import { FetchShopItemsController } from '@/infra/api/next/controllers/app'

export async function GET() {
  const nextHttp = NextHttp()

  const supabase = SupabaseRouteHandlerClient()
  const rocketsService = SupabaseRocketsService(supabase)
  const avatarsService = SupabaseAvatarsService(supabase)

  const controller = FetchShopItemsController(rocketsService, avatarsService)
  const httpResponse = await controller.handle(nextHttp)

  return httpResponse.body
}
