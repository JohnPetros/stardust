// import { SupabaseServerClient } from '@/api/supabase/clients'
// import { SupabaseChallengingService } from '@/api/supabase/services'
// import type { NextParams } from '@/server/next/types'
// import { ChallengeCommentsSlot } from '@/ui/challenging/widgets/slots/ChallengeComments'

// export default async function Slot({ params }: NextParams<{ challengeSlug: string }>) {
//   const supabase = SupabaseServerClient()
//   const challengingService = SupabaseChallengingService(supabase)
//   const response = await challengingService.fetchChallengeBySlug(params.challengeSlug)
//   if (response.isFailure) response.throwError()

//   return <ChallengeSoluSlot challengeId={String(response.body.id)} />
// }
