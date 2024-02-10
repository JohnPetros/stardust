'use client'

import { motion, Variants } from 'framer-motion'
import Link from 'next/link'

import { Category } from './Category'

import type { Challenge } from '@/@types/Challenge'
import { ChallengeInfo } from '@/app/components/ChallengeInfo'
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

export function Challenge({
  data: {
    id,
    title,
    difficulty,
    upvotes,
    downvotes,
    totalCompletitions,
    categoriesNames,
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
        upvotes={upvotes}
        downvotes={downvotes}
      />
      {categoriesNames && (
        <ul className="flex items-start gap-3">
          {categoriesNames.map((categoryName) => {
            if (categoryName)
              return <Category key={categoryName} name={categoryName} />
          })}
        </ul>
      )}
    </motion.div>
  )
}
