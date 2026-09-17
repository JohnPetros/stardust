import { faker } from '@faker-js/faker'

import { ChallengeRoadmap } from '../ChallengeRoadmap'
import type { ChallengeRoadmapDto, RoadmapNodeDto } from '../dtos'
import { ChallengeCategoriesFaker } from '../../entities/fakers'

const CATEGORY_NAMES = [
  'Básico',
  'Textos',
  'Números',
  'Operadores',
  'Condicionais',
  'Listas',
  'Lógicos',
  'Laços',
]

function roadmapKey(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function defaultNodeChallenges(key: string, challengeCount: number) {
  return {
    challengeIds: Array.from({ length: challengeCount }, () => faker.string.uuid()),
    challengeSlugs: Array.from(
      { length: challengeCount },
      (_, challengeIndex) => `${key}-challenge-${challengeIndex + 1}`,
    ),
    totalChallenges: challengeCount,
  }
}

function defaultNodeBase(name: string, index: number, key: string) {
  return {
    ...defaultNodeIdentity(name, key),
    ...defaultNodeLayout(index),
  }
}

function defaultNodeIdentity(name: string, key: string) {
  return { key, category: ChallengeCategoriesFaker.fakeDto({ name }) }
}

function defaultNodeLayout(index: number) {
  return {
    position: { x: index * 220, y: index % 2 === 0 ? 0 : 120 },
    recommendationOrder: index + 1,
    state: 'content' as const,
  }
}

function defaultNodeProgress() {
  return {
    completedChallenges: null,
    isCompleted: null,
    isEligible: null,
  }
}

function createDefaultNode(
  name: string,
  index: number,
  key: string,
  challengeCount: number,
): RoadmapNodeDto {
  return {
    ...defaultNodeBase(name, index, key),
    ...defaultNodeChallenges(key, challengeCount),
    ...defaultNodeProgress(),
  }
}

function defaultNode(name: string, index: number): RoadmapNodeDto {
  const key = roadmapKey(name)
  const challengeCount = index === 0 ? 2 : 1
  return createDefaultNode(name, index, key, challengeCount)
}

function defaultNodes(): RoadmapNodeDto[] {
  return CATEGORY_NAMES.map(defaultNode)
}

function fakeRevision(baseDto?: Partial<ChallengeRoadmapDto>) {
  return {
    key: 'desafios',
    version: 1,
    publishedAt: new Date().toISOString(),
    ...baseDto?.revision,
  }
}

function fakeEdges(nodes: RoadmapNodeDto[], baseDto?: Partial<ChallengeRoadmapDto>) {
  return (
    baseDto?.edges ??
    nodes.slice(1).map((node, index) => ({
      prerequisiteNodeKey: nodes[index].key,
      dependentNodeKey: node.key,
    }))
  )
}

function createFakeDto(
  baseDto: Partial<ChallengeRoadmapDto> | undefined,
  nodes: RoadmapNodeDto[],
): ChallengeRoadmapDto {
  return {
    revision: fakeRevision(baseDto),
    nodes,
    edges: fakeEdges(nodes, baseDto),
    progress: null,
    recommendation: null,
    ...baseDto,
  }
}

export class ChallengeRoadmapFaker {
  static fake(baseDto?: Partial<ChallengeRoadmapDto>): ChallengeRoadmap {
    return ChallengeRoadmap.create(ChallengeRoadmapFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<ChallengeRoadmapDto>): ChallengeRoadmapDto {
    const nodes = baseDto?.nodes ?? defaultNodes()
    return createFakeDto(baseDto, nodes)
  }
}
