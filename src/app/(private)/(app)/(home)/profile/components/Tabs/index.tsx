'use client'
import { useState } from 'react'
import {
  Barcode,
  CaretUp,
  Clock,
  FileCode,
  Icon,
  Terminal,
} from '@phosphor-icons/react'
import * as Tab from '@radix-ui/react-tabs'

import { SorterButton } from './SorterButton'
import { TabButton } from './TabButton'

type TabValue = 'tab-1' | 'tab-2' | 'tab-3'

type Sorter = 'created_at' | 'votes'

type Tab = {
  title: string
  icon: Icon
  value: TabValue
  hasSorters: boolean
}

const tabs: Tab[] = [
  {
    title: 'Códigos',
    icon: FileCode,
    value: 'tab-1',
    hasSorters: false,
  },
  {
    title: 'Desafios',
    icon: Terminal,
    value: 'tab-2',
    hasSorters: true,
  },
  {
    title: 'Soluções',
    icon: Barcode,
    value: 'tab-3',
    hasSorters: true,
  },
]

export function Tabs() {
  const [activeTab, setActiveTab] = useState<TabValue>('tab-1')
  const [hasSorters, setHasSorters] = useState(false)
  const [activeSorter] = useState<Sorter>('created_at')

  function handleTabClick(tabValue: TabValue, hasSorters: boolean) {
    setActiveTab(tabValue)
    setHasSorters(hasSorters)
  }

  return (
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
  )
}
