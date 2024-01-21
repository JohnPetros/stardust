'use client'

import {
  ChartLine,
  CheckCircle,
  Circle,
  Target,
  User,
} from '@phosphor-icons/react'
import { motion, Variants } from 'framer-motion'
import Link from 'next/link'

import { Category } from './Category'
import { Info } from './Info'

import type { Challenge } from '@/@types/challenge'
import { ChallengeInfo } from '@/app/components/ChallengeInfo'
import { DifficultyBadge } from '@/app/components/DifficultyBadge'
import { deslugify } from '@/utils/helpers'

const challengeVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5,
  },
  visible: {
    opacity: 1,
    scale: 1,
  },
}

interface ChallengeProps {
  data: Challenge
}

export function Challenge({
  data: {
    id,
    title,
    difficulty,
    upvotes,
    downvotes,
    total_completitions,
    categories,
    user_slug,
    isCompleted,
  },
}: ChallengeProps) {
  return (
    <motion.div
      variants={challengeVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-5 rounded-md bg-gray-800 p-6"
    >
      <div className="flex items-center gap-3">
        <DifficultyBadge difficulty={difficulty} />
        <Link
          href={`/challenges/${id}`}
          className="font-semibold text-green-500 transition-colors duration-200 hover:text-green-700"
        >
          {title}
        </Link>
      </div>
      <ChallengeInfo
        isCompleted={isCompleted}
        totalCompletitions={total_completitions}
        userSlug={user_slug}
        upvotes={upvotes}
        downvotes={downvotes}
        shouldShowVoteButtons={false}
      />
      {categories && (
        <ul className="flex items-start gap-3">
          {categories.map((category) => {
            if (category)
              return <Category key={category?.id} name={category?.name} />
          })}
        </ul>
      )}
    </motion.div>
  )
}
