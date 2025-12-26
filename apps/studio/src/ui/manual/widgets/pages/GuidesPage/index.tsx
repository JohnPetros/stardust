import { useRest } from '@/ui/global/hooks/useRest'
import { useToastProvider } from '@/ui/global/hooks/useToastProvider'
import type { GuideCategory } from '@stardust/core/manual/structures'

import { useGuidesPage } from './useGuidesPage'
import { GuidesPageView } from './GuidesPageView'

type Props = {
  category: GuideCategory
}

export const GuidesPage = ({ category }: Props) => {
  const { manualService } = useRest()
  const toast = useToastProvider()
  const props = useGuidesPage({ manualService, toast, category })

  return <GuidesPageView category={category} {...props} />
}
