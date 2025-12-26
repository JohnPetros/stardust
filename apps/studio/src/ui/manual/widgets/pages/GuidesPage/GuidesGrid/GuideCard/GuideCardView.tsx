import { Link } from 'react-router'

import type { GuideDto } from '@stardust/core/manual/entities/dtos'

import { Button } from '@/ui/shadcn/components/button'
import { Icon } from '@/ui/global/widgets/components/Icon'
import { ExpandableInput } from '@/ui/global/widgets/components/ExpandableInput'
import { ROUTES } from '@/constants'
import { Guide } from '@stardust/core/manual/entities'

type Props = {
  guide: GuideDto
  onRename?: (title: string) => void
  onDelete?: () => void
}

export const GuideCardView = ({ guide, onRename, onDelete }: Props) => {
  return (
    <div className='relative flex flex-col gap-4 py-6 rounded-xl border border-zinc-700 bg-zinc-900 p-4 shadow-sm transition-shadow hover:shadow-md h-full'>
      <div className='absolute top-3 right-3 flex items-center gap-1'>
        <Button asChild variant='ghost' size='icon' className='size-8 hover:bg-zinc-800'>
          <Link to={ROUTES.manual.guide(Guide.create(guide))}>
            <Icon
              name='edition'
              className='text-zinc-400 size-4 cursor-pointer hover:text-primary transition-colors'
            />
          </Link>
        </Button>
        <Button
          variant='ghost'
          size='icon'
          className='size-8 hover:bg-zinc-800'
          onClick={onDelete}
        >
          <Icon
            name='trash'
            className='text-zinc-400 size-4 cursor-pointer hover:text-destructive transition-colors'
          />
        </Button>
      </div>
      <div className='flex flex-col gap-2 pl-10 group min-h-[24px]'>
        <ExpandableInput
          defaultValue={guide.title}
          onBlur={(value) => onRename?.(value)}
          className='text-base font-semibold text-zinc-100 bg-transparent border-none outline-none p-0 focus:ring-0 w-full'
        />
      </div>
    </div>
  )
}
