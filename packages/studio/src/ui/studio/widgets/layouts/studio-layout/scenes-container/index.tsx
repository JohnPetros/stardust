import { useNavigate, useParams } from '@tanstack/react-router'
import type { Scene } from '@/types/scene'
import { useScenes } from '@/ui/shared/hooks/use-scenes'
import { Icon } from '@/ui/shared/widgets/components/icon'
import { SceneItem } from './scene-item'

export const ScenesContainer = () => {
  const params = useParams({ strict: false }) as { project?: string; scene?: string }
  const navigate = useNavigate()
  const { findProject } = useScenes()

  const scenes = params.project ? (findProject(params.project)?.scenes ?? []) : []

  function openScene(project: string, scene: string) {
    void navigate({ to: '/$project/$scene', params: { project, scene } })
  }

  async function handleDeleteScene(scene: Scene) {
    if (!params.project) return
    await fetch('/__scenes/scene', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project: params.project, scene: scene.slug }),
    })
    // If the active scene was removed, fall back to another scene in the project
    // (or the default route if none remain). The tree refreshes over HMR.
    if (scene.slug === params.scene) {
      const next = scenes.find((s) => s.slug !== scene.slug)
      if (next) openScene(params.project, next.slug)
      else void navigate({ to: '/' })
    }
  }

  async function handleAddScene() {
    if (!params.project) return
    const res = await fetch('/__scenes/scene', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project: params.project }),
    })
    const { project, scene } = (await res.json()) as { project: string; scene: string }
    openScene(project, scene)
  }

  return (
    <div className='flex items-start justify-center gap-4'>
      {scenes.map((scene) => (
        <SceneItem
          key={scene.slug}
          scene={scene}
          isActive={scene.slug === params.scene}
          onDelete={() => handleDeleteScene(scene)}
        />
      ))}

      <button
        type='button'
        onClick={handleAddScene}
        className='flex h-16 w-[114px] shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-background text-muted-foreground'
      >
        <Icon name='plus-add' />
      </button>
    </div>
  )
}
