'use client'

import { motion, Variants } from 'framer-motion'
import Link from 'next/link'

import { Category } from './Category'

import type { Challenge } from '@/@types/Challenge'
import { ChallengeInfo } from '@/global/components/ChallengeInfo'
import { DifficultyBadge } from '@/global/components/DifficultyBadge'

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

type ChallengeProps = {
  data: Challenge
}

export function ChallengeCard({
  data: {
    id,
    title,
    difficulty,
    upvotesCount,
    downvotesCount,
    totalCompletitions,
    categories,
    userSlug,
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
        isCompleted={isCompleted ?? false}
        totalCompletitions={totalCompletitions}
        userSlug={userSlug}
        upvotes={upvotesCount}
        downvotes={downvotesCount}
      />
      {categories && (
        <ul className="flex items-start gap-3">
          {categories.map((category) => {
            return <Category key={category.name} name={category.name} />
          })}
        </ul>
      )}
    </motion.div>
  )
}
