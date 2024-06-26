'use client'
import { X } from '@phosphor-icons/react'
import { AnimatePresence, motion, Variants } from 'framer-motion'

import { AchievementsList } from '../AchievementsList'
import { SignOutAlertDialog } from '../SignOutAlertDialog'

import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { useSiderbarContext } from '@/contexts/SidebarContext/hooks/useSiderbarContext'
import { Button } from '@/global/components/Button'
import { UserAvatar } from '@/global/components/UserAvatar'

const sidebarVariants: Variants = {
  close: {
    x: -320,
  },
  open: {
    x: 0,
    transition: {
      ease: 'linear',
      duration: 0.2,
    },
  },
}

export function Sidebar() {
  const { user } = useAuthContext()
  const { isOpen, toggle } = useSiderbarContext()

  if (user)
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            id="sidebar"
            variants={sidebarVariants}
            initial="close"
            animate="open"
            exit="close"
            className="fixed left-0 z-20 h-screen w-80 bg-gray-900 pb-32 pt-16"
          >
            <div className="relative">
              <button className="absolute right-2 p-2" onClick={toggle}>
                <X className="h-8 w-8 text-gray-500" />
              </button>

              <div className="flex flex-col items-center justify-center gap-3 text-gray-100">
                <UserAvatar avatarId={user.avatarId} size={96} />
                <strong>{user.name}</strong>
                <small className="text-sm">{user.email}</small>
                <SignOutAlertDialog>
                  <Button className="mx-aut mt-3 w-48 bg-green-400 px-3 py-2 text-green-900">
                    Sair
                  </Button>
                </SignOutAlertDialog>
              </div>
            </div>
            <div className="custom-scrollbar mt-3 h-full overflow-y-auto p-6">
              <div>
                <AchievementsList />
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    )
}
