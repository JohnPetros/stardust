'use client'
import { useState } from 'react'
import {
  Barcode,
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

import { Button } from '@/app/components/Button'
import { ROUTES } from '@/utils/constants'

type TabValue = 'playground-tab' | 'challenges-tab' | 'solutions-tab'

type Sorter = 'created_at' | 'votes'

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
    link: ROUTES.private.challenge,
    icon: Terminal,
    value: 'challenges-tab',
    hasSorters: true,
  },
  {
    title: 'Soluções',
    icon: Barcode,
    link: ROUTES.private.challenges,
    value: 'solutions-tab',
    hasSorters: true,
  },
]

export function Crafts() {
  const [activeTab, setActiveTab] = useState<TabValue>('playground-tab')
  const [hasSorters, setHasSorters] = useState(false)
  const [activeSorter] = useState<Sorter>('created_at')

  const buttonTitle: Record<TabValue, string | null> = {
    'playground-tab': 'Criar código',
    'challenges-tab': 'Criar desagio',
    'solutions-tab': null,
  }

  function handleTabClick(tabValue: TabValue, hasSorters: boolean) {
    setActiveTab(tabValue)
    setHasSorters(hasSorters)
  }

  return (
    <div className="flex flex-col gap-6">
      <Link href={tabs.find((tab) => tab.value === activeTab)?.title ?? ''}>
        <Button icon={PlusCircle} className="w-64">
          {buttonTitle[activeTab]}
        </Button>
      </Link>
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
