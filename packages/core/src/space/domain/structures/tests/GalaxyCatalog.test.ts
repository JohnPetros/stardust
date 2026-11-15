import { Id } from '#global/domain/structures/Id'
import { GalaxiesFaker } from '../../entities/fakers/GalaxiesFaker'
import { GalaxyCatalog } from '../GalaxyCatalog'

describe('GalaxyCatalog Structure', () => {
  const published = GalaxiesFaker.fake({ position: 1, status: 'published' })
  const announced = GalaxiesFaker.fake({ position: 2, status: 'announced' })
  const unpublished = GalaxiesFaker.fake({ position: 3, status: 'unpublished' })

  it('should order the galaxies by position', () => {
    const second = GalaxiesFaker.fake({ position: 2 })
    const third = GalaxiesFaker.fake({ position: 3 })
    const first = GalaxiesFaker.fake({ position: 1 })

    const catalog = GalaxyCatalog.create([third, first, second])

    expect(catalog.visibleGalaxies.map((galaxy) => galaxy.id.value)).toEqual([
      first.id.value,
      second.id.value,
      third.id.value,
    ])
  })

  it('should not change the order of the given list', () => {
    const galaxies = [announced, published]

    GalaxyCatalog.create(galaxies)

    expect(galaxies[0]).toBe(announced)
  })

  it('should expose only published and announced galaxies as visible', () => {
    const catalog = GalaxyCatalog.create([unpublished, announced, published])

    expect(catalog.visibleGalaxies.map((galaxy) => galaxy.id.value)).toEqual([
      published.id.value,
      announced.id.value,
    ])
  })

  it('should have galaxy choice when there are two or more visible galaxies', () => {
    expect(GalaxyCatalog.create([published, announced]).hasGalaxyChoice.isTrue).toBe(true)
  })

  it('should not have galaxy choice with a single visible galaxy', () => {
    expect(GalaxyCatalog.create([published]).hasGalaxyChoice.isFalse).toBe(true)
    expect(GalaxyCatalog.create([published, unpublished]).hasGalaxyChoice.isFalse).toBe(
      true,
    )
  })

  it('should get the first galaxy regardless of its status', () => {
    const firstUnpublished = GalaxiesFaker.fake({ position: 1, status: 'unpublished' })
    const secondPublished = GalaxiesFaker.fake({ position: 2, status: 'published' })

    const catalog = GalaxyCatalog.create([secondPublished, firstUnpublished])

    expect(catalog.firstGalaxy?.id.value).toBe(firstUnpublished.id.value)
  })

  it('should get null as the first galaxy when the catalog is empty', () => {
    const catalog = GalaxyCatalog.create([])

    expect(catalog.firstGalaxy).toBeNull()
    expect(catalog.firstPublishedGalaxy).toBeNull()
  })

  it('should get the first published galaxy skipping the ones that are not published', () => {
    const firstAnnounced = GalaxiesFaker.fake({ position: 1, status: 'announced' })
    const secondPublished = GalaxiesFaker.fake({ position: 2, status: 'published' })
    const thirdPublished = GalaxiesFaker.fake({ position: 3, status: 'published' })

    const catalog = GalaxyCatalog.create([
      thirdPublished,
      secondPublished,
      firstAnnounced,
    ])

    expect(catalog.firstPublishedGalaxy?.id.value).toBe(secondPublished.id.value)
  })

  describe('resolveCurrentGalaxy', () => {
    const secondPublished = GalaxiesFaker.fake({ position: 4, status: 'published' })
    const catalog = GalaxyCatalog.create([
      published,
      announced,
      unpublished,
      secondPublished,
    ])

    it('should resolve the stored galaxy when it is published', () => {
      const galaxy = catalog.resolveCurrentGalaxy(secondPublished.id)

      expect(galaxy?.id.value).toBe(secondPublished.id.value)
    })

    it('should resolve the first published galaxy when the stored one is announced', () => {
      const galaxy = catalog.resolveCurrentGalaxy(announced.id)

      expect(galaxy?.id.value).toBe(published.id.value)
    })

    it('should resolve the first published galaxy when the stored one is unpublished', () => {
      const galaxy = catalog.resolveCurrentGalaxy(unpublished.id)

      expect(galaxy?.id.value).toBe(published.id.value)
    })

    it('should resolve the first published galaxy when the stored one does not exist', () => {
      const galaxy = catalog.resolveCurrentGalaxy(Id.create())

      expect(galaxy?.id.value).toBe(published.id.value)
    })

    it('should resolve the first published galaxy when there is no stored galaxy', () => {
      const galaxy = catalog.resolveCurrentGalaxy(null)

      expect(galaxy?.id.value).toBe(published.id.value)
    })

    it('should resolve null when no galaxy is published', () => {
      const unpublishedCatalog = GalaxyCatalog.create([announced, unpublished])

      expect(unpublishedCatalog.resolveCurrentGalaxy(null)).toBeNull()
      expect(unpublishedCatalog.resolveCurrentGalaxy(announced.id)).toBeNull()
    })
  })
})
