'use client'

import { TrailLoadFailure } from '@/ui/space/widgets/pages/Space/TrailLoadFailure'

type Props = {
  reset: () => void
}

const TrailError = ({ reset }: Props) => {
  return <TrailLoadFailure onRetry={reset} />
}

export default TrailError
