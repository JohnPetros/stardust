import type { JSX } from 'react'

import { ChallengePageContent } from './ChallengePageContent'
import type { NextParams } from '@/rpc/next/types'

const Page = async ({
  params,
}: NextParams<'challengeSlug'>): Promise<JSX.Element | undefined> => {
  return <ChallengePageContent params={params} />
}

export default Page
