import { useUI } from '@/ui/shared/hooks/use-ui'
import { PlaybackControls } from './playback-controls'
import { ScenesContainer } from './scenes-container'
import { SidebarLeft } from './sidebar-left'
import { SidebarRight } from './sidebar-right'

export const StudioLayout = () => {
  const { controlsExpanded } = useUI()

  return (
    <>
      <SidebarLeft />
      <div className='absolute inset-x-0 bottom-4 flex flex-col items-center gap-4 px-4'>
        <PlaybackControls />
        {controlsExpanded && <ScenesContainer />}
      </div>
      <SidebarRight />
    </>
  )
}
