'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { twMerge } from 'tailwind-merge'
import { Variants, motion } from 'framer-motion'

interface NavButtonProps {
  path: string
  label: string
  icon: string
  isColumn?: boolean
  isExpanded?: boolean
}

const labelVariants: Variants = {
  shrink: {
    width: 0,
  },
  expand: {
    width: 'auto',
    paddingLeft: '8px',
    transition: {
      delay: 0.05,
    },
  },
}

export function NavButton({
  path,
  label,
  icon,
  isColumn = true,
  isExpanded = true,
}: NavButtonProps) {
  const pathname = usePathname()
  const isActive = pathname === path

  return (
    <Link
      href={path}
      className={twMerge(
        'rounded-xl hover:bg-green-700/20 transition-colors duration-200 flex items-center justify-center w-max p-2',
        isColumn ? 'flex-col' : 'flex-row'
      )}
    >
      <span
        className={twMerge(
          'rounded-lg w-10 h-10 grid place-content-center',
          isActive ? 'bg-green-400' : 'bg-green-800'
        )}
      >
        <Image
          src={`/icons/${icon}`}
          width={28}
          height={28}
          className="text-gray-800"
          alt=""
        />
      </span>
      <motion.span
        variants={labelVariants}
        initial="shrink"
        animate={isExpanded ? 'expand' : ''}
        className={twMerge(
          'block overflow-hidden font-semibold text-sm',
          isActive ? 'text-gray-100' : 'text-gray-400'
        )}
      >
        {label}
      </motion.span>
    </Link>
  )
}
