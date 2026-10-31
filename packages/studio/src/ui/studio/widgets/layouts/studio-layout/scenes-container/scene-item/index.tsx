import { useNavigate, useParams } from '@tanstack/react-router'
import { Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { Scene } from '@/types/scene'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/ui/shadcn/context-menu'
import { cn } from '@/ui/shadcn/utils'
import { useCanvas } from '@/ui/shared/hooks/use-canvas'
import { useScenes } from '@/ui/shared/hooks/use-scenes'
import { getThumbnail } from '../thumbnails'

export type SceneItemProps = {
  scene: Scene
  isActive: boolean
  onDelete(): void
}

export const SceneItem = ({ scene, isActive, onDelete }: SceneItemProps) => {
  const params = useParams({ strict: false }) as { project?: string }
  const navigate = useNavigate()
  const { getCanvasKit } = useCanvas()
  const { loadScene } = useScenes()
  const [thumbnail, setThumbnail] = useState<string | null>(null)

  useEffect(() => {
    let isCurrent = true
    getThumbnail(scene, { getCanvasKit, loadScene })
      .then((url) => {
        if (isCurrent) setThumbnail(url)
      })
      .catch((error) => console.error(error))
    return () => {
      isCurrent = false
    }
  }, [scene, getCanvasKit, loadScene])

  function handleOpen() {
    if (!params.project) return
    void navigate({
      to: '/$project/$scene',
      params: { project: params.project, scene: scene.slug },
    })
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          type='button'
          onClick={handleOpen}
          className={cn(
            'z-context-menu-trigger flex flex-col gap-2 w-[114px] shrink-0 aspect-video overflow-hidden rounded-md bg-background',
            isActive ? 'border-2 border-primary' : 'border border-border',
          )}
        >
          {thumbnail && (
            <img
              src={thumbnail}
              alt={scene.label}
              className='h-full w-full object-cover'
            />
          )}
        </button>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onSelect={onDelete}>
          <Trash />
          <span>Delete scene</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
