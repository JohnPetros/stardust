import type { PropsWithChildren } from 'react'

import { useRestContext } from '@/ui/global/hooks/useRestContext'
import { ChallengeSourceFormView } from './ChallengeSourceFormView'

type InitialValues = {
  url: string
  challengeId?: string | null
  challengeTitle?: string | null
}

type Props = {
  challengeSourceId?: string
  initialValues?: InitialValues
  onCreate: (url: string, challengeId?: string) => Promise<string | null>
  onUpdate: (
    challengeSourceId: string,
    url: string,
    challengeId: string | undefined,
  ) => Promise<string | null>
}

export const ChallengeSourceForm = ({
  children,
  challengeSourceId,
  initialValues,
  onCreate,
  onUpdate,
}: PropsWithChildren<Props>) => {
  const { challengingService } = useRestContext()

  return (
    <ChallengeSourceFormView
      challengingService={challengingService}
      challengeSourceId={challengeSourceId}
      initialValues={initialValues}
      onCreate={onCreate}
      onUpdate={onUpdate}
      trigger={children}
    />
  )
}
