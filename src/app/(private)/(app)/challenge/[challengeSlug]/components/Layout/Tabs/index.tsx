'use client'

import { ReactNode } from 'react'
import { List, Root } from '@radix-ui/react-tabs'
import { AnimatePresence } from 'framer-motion'

import { TabButton } from './TabButton'
import { TabContent } from './TabContent'
import { useTabs } from './useTabs'

type TabsProps = {
  children: ReactNode
}

export function Tabs({ children }: TabsProps) {
  const { activeTab, addTabRef, handleTabButton, handleTabChange } = useTabs()

  return (
    <div className="max-h-screen w-full rounded-md border-4 border-gray-700">
      <Root
        defaultValue="description"
        onValueChange={handleTabChange}
        orientation="horizontal"
      >
        <List className="flex items-center gap-3 bg-gray-700 px-2">
          <TabButton
            title="Descrição"
            value="description"
            isActive={activeTab === 'description'}
            onClick={handleTabButton}
          />
          <TabButton
            title="Resultado"
            value="result"
            isActive={activeTab === 'result'}
            onClick={handleTabButton}
          />
          <TabButton
            title="Comentários"
            value="comments"
            isActive={activeTab === 'comments'}
            isBlocked
            blockMessage="Comentários estão disponíveis apenas após a conclusão do desafio."
            onClick={handleTabButton}
          />
        </List>
        <AnimatePresence>
          <TabContent value="description">{children}</TabContent>
          {/* {activeTab === 'description' && (
            <TabContent tabRef={addTabRef} value="description">
              <Description />
            </TabContent>
          )} */}
          {/* {activeTab === 'result' && (
            <TabContent tabRef={addTabRef} value="result">
              <Result />
            </TabContent>
          )} */}
        </AnimatePresence>
      </Root>
    </div>
  )
}
