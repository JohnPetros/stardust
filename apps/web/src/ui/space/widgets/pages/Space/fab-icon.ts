import type { CurrentItemViewportPosition } from '@/ui/space/contexts/SpaceContext/types'
import type { IconName } from '@/ui/global/widgets/components/Icon/types'

export const FAB_ICON: Record<CurrentItemViewportPosition, IconName> = {
  above: 'arrow-up',
  below: 'arrow-down',
  in: 'arrow-down',
}
