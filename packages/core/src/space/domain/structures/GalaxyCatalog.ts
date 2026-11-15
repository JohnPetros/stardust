import { Logical } from '#global/domain/structures/Logical'
import type { Id } from '#global/domain/structures/Id'
import type { Galaxy } from '../entities/Galaxy'

export class GalaxyCatalog {
  private constructor(private readonly galaxies: Galaxy[]) {}

  static create(galaxies: Galaxy[]): GalaxyCatalog {
    const orderedGalaxies = [...galaxies].sort(
      (galaxy, otherGalaxy) => galaxy.position.value - otherGalaxy.position.value,
    )
    return new GalaxyCatalog(orderedGalaxies)
  }

  resolveCurrentGalaxy(storedGalaxyId: Id | null): Galaxy | null {
    const storedGalaxy = storedGalaxyId
      ? this.galaxies.find((galaxy) => galaxy.id.value === storedGalaxyId.value)
      : undefined

    if (storedGalaxy?.canBeEntered.isTrue) return storedGalaxy
    return this.firstPublishedGalaxy
  }

  get visibleGalaxies(): Galaxy[] {
    return this.galaxies.filter((galaxy) => galaxy.isVisible.isTrue)
  }

  get hasGalaxyChoice(): Logical {
    return Logical.create(this.visibleGalaxies.length >= 2)
  }

  get firstGalaxy(): Galaxy | null {
    return this.galaxies[0] ?? null
  }

  get firstPublishedGalaxy(): Galaxy | null {
    return this.galaxies.find((galaxy) => galaxy.canBeEntered.isTrue) ?? null
  }
}
