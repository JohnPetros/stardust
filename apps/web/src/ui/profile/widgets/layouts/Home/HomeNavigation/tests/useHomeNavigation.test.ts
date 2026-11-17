import { renderHook } from '@testing-library/react'
import type { User } from '@stardust/core/global/entities'

import { ROUTES } from '@/constants'
import { type Params, useHomeNavigation } from '../useHomeNavigation'

describe('useHomeNavigation', () => {
  let goTo: jest.Mock
  let setIsAchievementsListVisible: jest.Mock

  const user = {
    slug: { value: 'petros' },
    name: { value: 'Petros' },
    email: { value: 'petros@example.com' },
    avatar: { image: { value: 'avatar.png' }, name: { value: 'Explorer' } },
    rescueableAchievementsCount: { value: 2 },
  } as unknown as User

  const Hook = (params?: Partial<Params>) =>
    renderHook(() =>
      useHomeNavigation({
        user,
        currentRoute: ROUTES.space,
        goTo,
        isAchievementsListVisible: false,
        setIsAchievementsListVisible,
        ...params,
      }),
    )

  beforeEach(() => {
    goTo = jest.fn()
    setIsAchievementsListVisible = jest.fn()
  })

  it('should build the links in order with the profile route using the user slug', () => {
    const { result } = Hook()

    expect(result.current.links.map((link) => link.label)).toEqual([
      'Aprender',
      'Desafios',
      'Loja',
      'Perfil',
    ])
    expect(result.current.links[3].route).toBe(ROUTES.profile.user('petros'))
  })

  it('should expose the rescueable achievements count and the sidebar user as primitives', () => {
    const { result } = Hook()

    expect(result.current.rescueableAchievementsCount).toBe(2)
    expect(result.current.sidebarUser).toEqual({
      name: 'Petros',
      email: 'petros@example.com',
      avatar: { image: 'avatar.png', name: 'Explorer' },
    })
  })

  it('should mark notes as active only on the notes route', () => {
    expect(Hook({ currentRoute: ROUTES.notes }).result.current.isNotesActive).toBe(true)
    expect(Hook({ currentRoute: ROUTES.shop }).result.current.isNotesActive).toBe(false)
  })

  it('should navigate to the notes route when handleNotesClick is called', () => {
    const { result } = Hook()

    result.current.handleNotesClick()

    expect(goTo).toHaveBeenCalledWith(ROUTES.notes)
  })

  it('should invert the achievements list visibility when handleAchievementsClick is called', () => {
    Hook({ isAchievementsListVisible: false }).result.current.handleAchievementsClick()
    expect(setIsAchievementsListVisible).toHaveBeenLastCalledWith(true)

    Hook({ isAchievementsListVisible: true }).result.current.handleAchievementsClick()
    expect(setIsAchievementsListVisible).toHaveBeenLastCalledWith(false)
  })

  it('should return empty values when there is no user', () => {
    const { result } = Hook({ user: null })

    expect(result.current.links).toEqual([])
    expect(result.current.rescueableAchievementsCount).toBe(0)
    expect(result.current.sidebarUser).toBeNull()
  })
})
