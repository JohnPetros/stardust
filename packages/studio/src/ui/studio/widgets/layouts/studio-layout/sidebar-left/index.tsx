import { useNavigate, useParams } from '@tanstack/react-router'
import { Trash } from 'lucide-react'
import { type KeyboardEvent, useCallback, useState } from 'react'
import type { Project } from '@/types/project'
import { Button } from '@/ui/shadcn/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/ui/shadcn/context-menu'
import { cn } from '@/ui/shadcn/utils'
import { useScenes } from '@/ui/shared/hooks/use-scenes'
import { useUI } from '@/ui/shared/hooks/use-ui'
import { Icon } from '@/ui/shared/widgets/components/icon'

export const SidebarLeft = () => {
  const params = useParams({ strict: false }) as { project?: string }
  const navigate = useNavigate()
  const { projects } = useScenes()
  const { controlsExpanded, toggleControls } = useUI()
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('New project')

  function openScene(project: string, scene: string | undefined) {
    if (!scene) {
      void navigate({ to: '/' })
      return
    }
    void navigate({ to: '/$project/$scene', params: { project, scene } })
  }

  function handleBlur() {
    setCreating(false)
    setName('New project')
  }

  async function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      handleBlur()
      return
    }

    if (e.key === 'Enter') {
      const value = name.trim()
      handleBlur()

      if (value) {
        const res = await fetch('/__scenes/project', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: value }),
        })
        const { project, scene } = (await res.json()) as {
          project: string
          scene: string
        }
        openScene(project, scene)
      }
    }
  }

  // Stable ref: focus and select once when the input mounts, not on every keystroke.
  const handleInputMounted = useCallback((el: HTMLInputElement | null) => {
    if (!el) return
    queueMicrotask(() => {
      el.focus()
      el.select()
    })
  }, [])

  async function handleDeleteProject(project: Project) {
    await fetch('/__scenes/project', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project: project.slug }),
    })
    // If the active project was removed, let the default route pick a new one.
    // The tree refreshes over HMR.
    if (project.slug === params.project) void navigate({ to: '/' })
  }

  return (
    <div
      className={cn(
        'absolute left-4 top-4 flex flex-col max-h-full rounded-2xl gap-0 bg-background border border-border text-muted-foreground',
        controlsExpanded ? 'w-[236px]' : 'w-[188px]',
      )}
    >
      <div className='flex items-center justify-between h-12 px-3'>
        <div className='flex items-center justify-center gap-1'>
          <Icon name='diffusion-logo' className='size-6' />
          <span className='text-xxs font-strong'>Diffusion Studio</span>
        </div>
        <Button size='icon' variant='ghost' onClick={toggleControls}>
          <Icon name='sidebar' />
        </Button>
      </div>
      {controlsExpanded && (
        <div className='px-4 py-3 border-t border-border flex flex-col'>
          <div className='flex items-center justify-between h-8'>
            <span className='text-xxs text-muted-foreground px-1'>Projects</span>
            <Button
              size='icon'
              variant='ghost'
              className='text-muted-foreground'
              onClick={() => setCreating(true)}
            >
              <Icon name='plus-add' />
            </Button>
          </div>
          {creating && (
            <div className='flex items-center h-7 rounded-md px-0.5 gap-0.5 my-0.5 text-foreground'>
              <Icon name='folder' />
              <input
                ref={handleInputMounted}
                type='text'
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                className='bg-transparent text-xxs outline-none flex-1 w-0 focus-ring px-1 py-0.5 rounded-sm'
              />
            </div>
          )}
          {projects.map((project) => {
            const isActive = project.slug === params.project
            return (
              <ContextMenu key={project.slug}>
                <ContextMenuTrigger asChild>
                  <button
                    type='button'
                    onClick={() => openScene(project.slug, project.scenes[0]?.slug)}
                    className={cn(
                      'z-context-menu-trigger flex items-center h-7 rounded-md px-0.5 gap-1.5 my-0.5 flex-1',
                      isActive ? 'bg-muted text-foreground' : 'text-muted-foreground',
                    )}
                  >
                    <Icon name='folder' />
                    <span className='text-xxs'>{project.label}</span>
                    {isActive && <Icon name='confirm-check' className='ml-auto' />}
                  </button>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onSelect={() => handleDeleteProject(project)}>
                    <Trash />
                    <span>Delete project</span>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            )
          })}
        </div>
      )}
    </div>
  )
}
