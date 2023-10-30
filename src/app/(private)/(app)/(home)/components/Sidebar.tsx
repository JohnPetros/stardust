'use client'
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
  const { isOpen } = useSiderbar()

  console.log(isOpen)

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
            className="fixed left-0 z-20 h-screen w-80 bg-gray-900 pt-24"
          >
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
