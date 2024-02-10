'use client'

import {
  CaretUp,
  Clock,
  FileCode,
  Icon,
  PlusCircle,
  Terminal,
} from '@phosphor-icons/react'
import * as Tab from '@radix-ui/react-tabs'
import Link from 'next/link'

import { SorterButton } from './SorterButton'
import { TabButton } from './TabButton'
import { useCrafts } from './useCrafts'

import { Button } from '@/app/components/Button'
import { ROUTES } from '@/global/constants'

type TabValue = 'playground-tab' | 'challenges-tab' | 'solutions-tab'

type Tab = {
  title: string
  link?: string
  icon: Icon
  value: TabValue
  hasSorters: boolean
}

const tabs: Tab[] = [
  {
    title: 'Códigos',
    link: ROUTES.private.playground,
    icon: FileCode,
    value: 'playground-tab',
    hasSorters: false,
  },
  {
    title: 'Desafios',
    link: ROUTES.private.home.challenges,
    icon: Terminal,
    value: 'challenges-tab',
    hasSorters: true,
  },
]

export function Crafts() {
  const {
    activeSorter,
    activeTab,
    buttonTitle,
    handleTabClick,
    hasSorters,
    isAuthUser,
  } = useCrafts()

  return (
    <div className="flex flex-col gap-6">
      {isAuthUser && activeTab !== 'solutions-tab' && (
        <Link href={tabs.find((tab) => tab.value === activeTab)?.link ?? ''}>
          <Button className="w-64 gap-2">
            <PlusCircle className="text-gray-900" weight="bold" />
            {buttonTitle[activeTab]}
          </Button>
        </Link>
      )}

      <Tab.Root className="rounded-md bg-gray-800 p-6">
        <Tab.List className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            {tabs.map(({ title, icon, value, hasSorters }) => (
              <TabButton
                key={value}
                title={title}
                icon={icon}
                value={value}
                isActive={value === activeTab}
                onClick={() => handleTabClick(value, hasSorters)}
              />
            ))}
          </div>

          {hasSorters && (
            <div className="flex items-center justify-end">
              <SorterButton
                title="Mais recentes"
                icon={Clock}
                isActive={activeSorter === 'created_at'}
              />
              <SorterButton
                title="Mais votados"
                icon={CaretUp}
                isActive={activeSorter === 'votes'}
              />
            </div>
          )}
        </Tab.List>
      </Tab.Root>
    </div>
  )
}
