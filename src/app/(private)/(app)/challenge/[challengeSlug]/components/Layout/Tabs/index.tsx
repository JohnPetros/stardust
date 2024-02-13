'use client'

import { ReactNode } from 'react'
import { List, Root } from '@radix-ui/react-tabs'
import { Trigger as TabButton } from '@radix-ui/react-tabs'
import { AnimatePresence } from 'framer-motion'

import { BlockedCommentsAlertDialog } from '../BlockedCommentsAlertDialog'
import { BlockedSolutionsAlertDialog } from '../BlockedSolutionsAlertDialog'
import { ContentLink } from '../ContentLink'

import { TabContent } from './TabContent'
import { useTabs } from './useTabs'

import { useChallengeStore } from '@/stores/challengeStore'

type TabsProps = {
  children: ReactNode
}

export function Tabs({ children }: TabsProps) {
  const { activeTab, handleShowSolutions } = useTabs()

  const canShowComments = useChallengeStore(
    (store) => store.state.canShowComments
  )
  const canShowSolutions = useChallengeStore(
    (store) => store.state.canShowSolutions
  )

  return (
    <div className="max-h-screen w-full rounded-md border-4 border-gray-700">
      <Root defaultValue="description" orientation="horizontal">
        <List className="flex items-center bg-gray-700 px-2">
          <TabButton value="description">
            <ContentLink
              title="Descrição"
              contentType="description"
              isActive={activeTab === 'description'}
            />
          </TabButton>

          <span className="text-gray-600">|</span>
          <TabButton value="result">
            <ContentLink
              title="Resultado"
              contentType="result"
              isActive={activeTab === 'result'}
            />
          </TabButton>
          <span className="text-gray-600">|</span>
          {!canShowComments ? (
            <BlockedCommentsAlertDialog>
              <TabButton value="comments" asChild>
                <ContentLink
                  title="Comentários"
                  contentType="comments"
                  isActive={activeTab === 'comments'}
                  isBlocked={true}
                />
              </TabButton>
            </BlockedCommentsAlertDialog>
          ) : (
            <TabButton value="comments" asChild>
              <ContentLink
                title="Comentários"
                contentType="comments"
                isActive={activeTab === 'comments'}
                isBlocked={false}
              />
            </TabButton>
          )}
          <span className="text-gray-600">|</span>
          {!canShowSolutions ? (
            <BlockedSolutionsAlertDialog onShowSolutions={handleShowSolutions}>
              <TabButton value="solutions" asChild>
                <ContentLink
                  title="Soluções"
                  contentType="solutions"
                  isActive={activeTab === 'solutions'}
                  isBlocked={true}
                />
              </TabButton>
            </BlockedSolutionsAlertDialog>
          ) : (
            <TabButton value="solutions" asChild>
              <ContentLink
                title="Soluções"
                contentType="solutions"
                isActive={activeTab === 'solutions'}
              />
            </TabButton>
          )}
        </List>
        <AnimatePresence>
          <TabContent value="description">{children}</TabContent>
        </AnimatePresence>
      </Root>
    </div>
  )
}
