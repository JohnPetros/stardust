import type { UserDTO } from '@/@core/dtos'
import { _getCookie } from '@/modules/global/actions'
import { COOKIES, ROUTES } from '@/modules/global/constants'
import { NextApiClient } from '@/server/NextApiClient'
import { redirect } from 'next/navigation'

type RewardingResponse = {
  userDTO: UserDTO
  accuracyPercentage: string
  time: string
  nextRoute: string
}

export default async function RewardingPage() {
  const rewardsPayloadCookie = await _getCookie(COOKIES.keys.rewardingPayload)

  if (!rewardsPayloadCookie) {
    return redirect(ROUTES.private.app.home.space)
  }

  const apiClient = NextApiClient()
  const rewardsPayloadDTO = JSON.parse(rewardsPayloadCookie)

  const response = await apiClient.post<RewardingResponse>(
    ROUTES.server.reward,
    rewardsPayloadDTO,
  )

  console.log(response)
}
