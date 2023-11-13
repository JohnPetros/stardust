'use client'
import { X } from '@phosphor-icons/react'
import { AnimatePresence, motion, Variants } from 'framer-motion'

import { AchievementsList } from './AchievementsList'
import { SignOutAlert } from './SignOutAlert'
import { UserAvatar } from './UserAvatar'

import { Button } from '@/app/components/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useSiderbar } from '@/contexts/SidebarContext'

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
  const { user } = useAuth()
  const { isOpen, toggle } = useSiderbar()

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
                <UserAvatar avatarId={user.avatar_id} size={96} />
                <strong>{user.name}</strong>
                <small className="text-sm">{user.email}</small>
                <SignOutAlert>
                  <Button className="mx-aut mt-3 w-48 bg-green-400 px-3 py-2 text-green-900">
                    Sair
                  </Button>
                </SignOutAlert>
              </div>
            </div>
            <div className=" p-6">
              <AchievementsList />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    )
}
