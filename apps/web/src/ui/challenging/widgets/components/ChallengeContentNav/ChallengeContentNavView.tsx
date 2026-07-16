import type { ChallengeContent } from '@/ui/challenging/stores/ChallengeStore/types'
import type { ChallengeCraftsVisibility } from '@stardust/core/challenging/structures'
import { twMerge } from 'tailwind-merge'
import type { DockablePanelDragHandle } from '../../layouts/Challenge/DockablePanel/DockablePanelDragHandleContext'

import { BlockedCommentsAlertDialog } from '../BlockedCommentsAlertDialog'
import { BlockedSolutionsAlertDialog } from '../BlockedSolutionsAlertDialog'
import { ChallengeContentLink } from '../ChallengeContentLink'

type Props = {
  contents: ChallengeContent[]
  craftsVislibility: ChallengeCraftsVisibility | null
  onShowSolutions: () => void
  dragHandle?: DockablePanelDragHandle | null
}

export const ChallengeContentNavView = ({
  contents,
  craftsVislibility,
  onShowSolutions,
  dragHandle,
}: Props) => {
  return (
    <nav
      aria-label={dragHandle ? 'Arrastar painel Conteúdo' : undefined}
      className={twMerge(
        'flex items-center gap-2 md:hidden',
        dragHandle && 'cursor-grab active:cursor-grabbing',
      )}
      {...dragHandle?.listeners}
      {...dragHandle?.attributes}
    >
      {contents.includes('description') && (
        <ChallengeContentLink
          title='Descrição'
          contentType='description'
          isActive={false}
          isBlocked={false}
        />
      )}
      {contents.includes('comments') && (
        <div>
          {craftsVislibility?.canShowSolutions.isFalse ? (
            <BlockedCommentsAlertDialog>
              <ChallengeContentLink
                title='Comentários'
                contentType='comments'
                isActive={false}
                isBlocked={true}
              />
            </BlockedCommentsAlertDialog>
          ) : (
            <ChallengeContentLink
              title='Comentários'
              contentType='comments'
              isActive={false}
              isBlocked={false}
            />
          )}
        </div>
      )}
      {contents.includes('solutions') && (
        <div>
          {craftsVislibility?.canShowSolutions.isTrue ? (
            <BlockedSolutionsAlertDialog onShowSolutions={onShowSolutions}>
              <ChallengeContentLink
                title='Soluções'
                contentType='solutions'
                isActive={false}
                isBlocked={true}
              />
            </BlockedSolutionsAlertDialog>
          ) : (
            <ChallengeContentLink
              title='Soluções'
              contentType='solutions'
              isActive={false}
            />
          )}
        </div>
      )}
    </nav>
  )
}
