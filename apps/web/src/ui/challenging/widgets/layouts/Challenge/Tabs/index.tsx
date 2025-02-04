'use client'

import type { ReactNode } from 'react'
import { List, Root } from '@radix-ui/react-tabs'
import { Trigger as TabButton } from '@radix-ui/react-tabs'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useTabs } from './useTabs'
import { TabContent } from './TabContent'
import { BlockedCommentsAlertDialog } from '../../../components/BlockedCommentsAlertDialog'
import { BlockedSolutionsAlertDialog } from '../../../components/BlockedSolutionsAlertDialog'
import { ContentLink } from '../../../components/ContentLink'

type TabsProps = {
  children: ReactNode
}

export function Tabs({ children }: TabsProps) {
  const { activeTab, handleShowSolutions } = useTabs()
  const { getCraftsVisibilitySlice } = useChallengeStore()
  const { craftsVislibility } = getCraftsVisibilitySlice()

  return (
    <div className='max-h-screen w-full rounded-md border-4 border-gray-700'>
      <Root defaultValue='description' orientation='horizontal'>
        <List className='flex items-center bg-gray-700 px-2'>
          <TabButton value='description'>
            <ContentLink
              title='Descrição'
              contentType='description'
              isActive={activeTab === 'description'}
            />
          </TabButton>

          <span className='text-gray-600'>|</span>
          <TabButton value='result'>
            <ContentLink
              title='Resultado'
              contentType='result'
              isActive={activeTab === 'result'}
            />
          </TabButton>
          <span className='text-gray-600'>|</span>
          {craftsVislibility.canShowComments.isTrue ? (
            <BlockedCommentsAlertDialog>
              <TabButton value='comments' asChild>
                <ContentLink
                  title='Comentários'
                  contentType='comments'
                  isActive={activeTab === 'comments'}
                  isBlocked={true}
                />
              </TabButton>
            </BlockedCommentsAlertDialog>
          ) : (
            <TabButton value='comments' asChild>
              <ContentLink
                title='Comentários'
                contentType='comments'
                isActive={activeTab === 'comments'}
                isBlocked={false}
              />
            </TabButton>
          )}
          <span className='text-gray-600'>|</span>
          {craftsVislibility.canShowSolutions.isTrue ? (
            <BlockedSolutionsAlertDialog onShowSolutions={handleShowSolutions}>
              <TabButton value='solutions' asChild>
                <ContentLink
                  title='Soluções'
                  contentType='solutions'
                  isActive={activeTab === 'solutions'}
                  isBlocked={true}
                />
              </TabButton>
            </BlockedSolutionsAlertDialog>
          ) : (
            <TabButton value='solutions' asChild>
              <ContentLink
                title='Soluções'
                contentType='solutions'
                isActive={activeTab === 'solutions'}
              />
            </TabButton>
          )}
        </List>
        <TabContent value='description'>{children}</TabContent>
      </Root>
    </div>
  )
}
