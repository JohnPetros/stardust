'use client'

import type { ReactNode } from 'react'
import { List, Root } from '@radix-ui/react-tabs'
import { Trigger as TabButton } from '@radix-ui/react-tabs'

import type { ChallengeCraftsVisibility } from '@stardust/core/challenging/structures'

import type { ChallengeContent } from '@/ui/challenging/stores/ChallengeStore/types'
import { ChallengeTabContent } from './ChallengeTabContent'
import { BlockedCommentsAlertDialog } from '../../../components/BlockedCommentsAlertDialog'
import { BlockedSolutionsAlertDialog } from '../../../components/BlockedSolutionsAlertDialog'
import { ChallengeContentLink } from '../../../components/ChallengeContentLink'
import { AccountRequirementAlertDialog } from '@/ui/global/widgets/components/AccountRequirementAlertDialog'
import { Icon } from '@/ui/global/widgets/components/Icon'

type TabsProps = {
  activeContent: ChallengeContent
  craftsVislibility: ChallengeCraftsVisibility | null
  isAccountAuthenticated: boolean
  children: ReactNode
  onShowSolutions: () => void
}

export const ChallengeTabsView = ({
  children,
  activeContent,
  craftsVislibility,
  isAccountAuthenticated,
  onShowSolutions,
}: TabsProps) => {
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
          {craftsVislibility?.canShowComments.isFalse ? (
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
          {!isAccountAuthenticated && (
            <AccountRequirementAlertDialog description='Acesse a sua conta para as soluções de outros usuários para este desafio'>
              <button
                type='button'
                className='flex items-center gap-2 rounded-md bg-gray-700 p-2 text-gray-500 text-sm'
              >
                Soluções
                <Icon name='lock' size={16} className='text-gray-500' />
              </button>
            </AccountRequirementAlertDialog>
          )}
          {isAccountAuthenticated && craftsVislibility?.canShowSolutions.isFalse && (
            <BlockedSolutionsAlertDialog onShowSolutions={onShowSolutions}>
              <TabButton value='solutions' asChild>
                <ChallengeContentLink
                  title='Soluções'
                  contentType='solutions'
                  isActive={activeContent === 'solutions'}
                  isBlocked={true}
                />
              </TabButton>
            </BlockedSolutionsAlertDialog>
          )}
          {isAccountAuthenticated && craftsVislibility?.canShowSolutions.isTrue && (
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
