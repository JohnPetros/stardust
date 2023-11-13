import { ReactNode } from 'react'
import * as Tabs from '@radix-ui/react-tabs'
import { motion, Variants } from 'framer-motion'

const tabAnimations: Variants = {
  exit: {
    opacity: 0,
    x: -40,
  },
  left: {
    opacity: 1,
    x: 0,
  },
  right: {
    opacity: 0,
    x: 40,
  },
}

interface TabContent {
  children: ReactNode
  value: string
  tabRef: (ref: HTMLDivElement | null) => void
}

export default function TabContent({ children, value, tabRef }: TabContent) {
  return (
    <Tabs.Content
      ref={tabRef}
      value={value}
      className="h-[calc(100vh-8rem)] overflow-hidden overflow-y-scroll"
      forceMount
    >
      <motion.div
        key={value}
        variants={tabAnimations}
        initial="right"
        animate="left"
        exit="exit"
        className="h-full"
      >
        {children}
      </motion.div>
    </Tabs.Content>
  )
}
