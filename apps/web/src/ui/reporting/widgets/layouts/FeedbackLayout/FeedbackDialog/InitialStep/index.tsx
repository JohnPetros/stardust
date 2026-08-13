import { InitialStepView } from './InitialStepView'

import type { ComponentProps } from 'react'

type Props = ComponentProps<typeof InitialStepView>

export function InitialStep(props: Props) {
  return <InitialStepView {...props} />
}
