'use client'

import type { ReactNode } from 'react'
import { List, Root } from '@radix-ui/react-tabs'
import { Trigger as TabButton } from '@radix-ui/react-tabs'

import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useChallengeTabs } from './useChallengeTabs'
import { ChallengeTabContent } from './ChallengeTabContent'
import { BlockedCommentsAlertDialog } from '../../../components/BlockedCommentsAlertDialog'
import { BlockedSolutionsAlertDialog } from '../../../components/BlockedSolutionsAlertDialog'
import { ChallengeContentLink } from '../../../components/ChallengeContentLink'

type TabsProps = {
  children: ReactNode
}

export function ChallengeTabs({ children }: TabsProps) {
  const { activeContent, handleShowSolutions } = useChallengeTabs()
  const { getCraftsVisibilitySlice } = useChallengeStore()
  const { craftsVislibility } = getCraftsVisibilitySlice()

  return (
    <div className='max-h-screen w-full rounded-md border-4 border-gray-700'>
      <Root defaultValue='description' orientation='horizontal'>
        <List className='flex items-center bg-gray-700 px-2'>
          <TabButton value='description'>
            <ChallengeContentLink
              title='Descrição'
              contentType='description'
              isActive={activeContent === 'description'}
            />
          </TabButton>

          <span className='text-gray-600'>|</span>
          <TabButton value='result'>
            <ChallengeContentLink
              title='Resultado'
              contentType='result'
              isActive={activeContent === 'result'}
            />
          </TabButton>
          <span className='text-gray-600'>|</span>
          {craftsVislibility.canShowComments.isFalse ? (
            <BlockedCommentsAlertDialog>
              <TabButton value='comments' asChild>
                <ChallengeContentLink
                  title='Comentários'
                  contentType='comments'
                  isActive={activeContent === 'comments'}
                  isBlocked={true}
                />
              </TabButton>
            </BlockedCommentsAlertDialog>
          ) : (
            <TabButton value='comments' asChild>
              <ChallengeContentLink
                title='Comentários'
                contentType='comments'
                isActive={activeContent === 'comments'}
                isBlocked={false}
              />
            </TabButton>
          )}
          <span className='text-gray-600'>|</span>
          {craftsVislibility.canShowSolutions.isFalse ? (
            <BlockedSolutionsAlertDialog onShowSolutions={handleShowSolutions}>
              <TabButton value='solutions' asChild>
                <ChallengeContentLink
                  title='Soluções'
                  contentType='solutions'
                  isActive={activeContent === 'solutions'}
                  isBlocked={true}
                />
              </TabButton>
            </BlockedSolutionsAlertDialog>
          ) : (
            <TabButton value='solutions' asChild>
              <ChallengeContentLink
                title='Soluções'
                contentType='solutions'
                isActive={activeContent === 'solutions'}
              />
            </TabButton>
          )}
        </List>
        <ChallengeTabContent value='description'>{children}</ChallengeTabContent>
      </Root>
    </div>
  )
}
