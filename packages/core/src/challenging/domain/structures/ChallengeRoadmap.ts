import { AppError } from '#global/domain/errors/AppError'
import { Id, IdsList, Logical, Slug } from '#global/domain/structures/index'
import { ChallengeCategory } from '../entities'
import type { Challenge } from '../entities'
import type {
  ChallengeRoadmapDto,
  RoadmapNodeChallengesDto,
  RoadmapNodeDto,
} from './dtos'

type Edge = ChallengeRoadmapDto['edges'][number]
type Node = {
  key: Slug
  category: ChallengeCategory
  position: { x: number; y: number }
  recommendationOrder: number
  state: RoadmapNodeDto['state']
  challengeIds: IdsList
  challengeSlugs: string[]
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

function invalid(message: string): never {
  throw new AppError(`Erro de integridade do roadmap: ${message}`)
}

function assertSlug(value: string, name: string) {
  if (typeof value !== 'string' || !SLUG_PATTERN.test(value) || value.length < 2)
    invalid(`${name} deve ser uma chave segura em formato slug`)
}

function assertInteger(value: number, name: string) {
  if (!Number.isInteger(value) || value < 1) invalid(`${name} deve ser positivo`)
}

type NodeValidationSets = {
  nodeKeys: Set<string>
  recommendationOrders: Set<number>
  challengeIds: Set<string>
}

function validateRevisionKey(revision: ChallengeRoadmapDto['revision']) {
  if (!revision || typeof revision.key !== 'string' || !revision.key.trim())
    invalid('A revisão do roadmap é obrigatória')
}

function validateRevisionVersion(revision: ChallengeRoadmapDto['revision']) {
  assertInteger(revision.version, 'A versão da revisão')
}

function validateRevisionDate(revision: ChallengeRoadmapDto['revision']) {
  if (!Number.isFinite(Date.parse(revision.publishedAt)))
    invalid('A data de publicação da revisão é inválida')
}

function validateRevision(revision: ChallengeRoadmapDto['revision']) {
  validateRevisionKey(revision)
  validateRevisionVersion(revision)
  validateRevisionDate(revision)
}

function createNodeValidationSets(): NodeValidationSets {
  return {
    nodeKeys: new Set<string>(),
    recommendationOrders: new Set<number>(),
    challengeIds: new Set<string>(),
  }
}

function validateNodeKey(dto: RoadmapNodeDto, nodeKeys: Set<string>) {
  assertSlug(dto.key, 'A chave do nó')
  if (nodeKeys.has(dto.key)) invalid(`A chave de nó ${dto.key} está duplicada`)
  nodeKeys.add(dto.key)
}

function validateRecommendationOrder(
  dto: RoadmapNodeDto,
  recommendationOrders: Set<number>,
) {
  assertInteger(dto.recommendationOrder, 'A ordem de recomendação')
  if (recommendationOrders.has(dto.recommendationOrder))
    invalid('As ordens de recomendação devem ser únicas')
  recommendationOrders.add(dto.recommendationOrder)
}

function validateNodePosition(dto: RoadmapNodeDto) {
  if (!Number.isFinite(dto.position.x) || !Number.isFinite(dto.position.y))
    invalid(`O nó ${dto.key} possui dados inválidos`)
}

function validateNodeCategory(dto: RoadmapNodeDto) {
  if (!dto.category || typeof dto.category.name !== 'string')
    invalid(`O nó ${dto.key} possui dados inválidos`)
}

function validateNodeState(dto: RoadmapNodeDto) {
  if (dto.state !== 'content' && dto.state !== 'comingSoon')
    invalid(`O estado do nó ${dto.key} é inválido`)
}

function validateNodeData(dto: RoadmapNodeDto) {
  validateNodePosition(dto)
  validateNodeCategory(dto)
  validateNodeState(dto)
}

function validateNodeIdentity(dto: RoadmapNodeDto, sets: NodeValidationSets) {
  validateNodeKey(dto, sets.nodeKeys)
  validateRecommendationOrder(dto, sets.recommendationOrders)
  validateNodeData(dto)
}

function createChallengeId(id: string, challengeIds: Set<string>) {
  if (!UUID_PATTERN.test(id)) invalid(`O desafio ${id} possui um id inválido`)
  if (challengeIds.has(id))
    invalid(`O desafio ${id} não pode aparecer duas vezes na revisão`)
  challengeIds.add(id)
  return Id.create(id)
}

function validateNodeChallengeCount(dto: RoadmapNodeDto, count: number) {
  if (dto.state === 'content' && count === 0)
    invalid(`O nó ${dto.key} precisa possuir desafios ou ser Em breve`)
  if (dto.state === 'comingSoon' && count > 0)
    invalid(`O nó ${dto.key} Em breve não pode possuir desafios`)
}

function createNodeChallengeIds(dto: RoadmapNodeDto, challengeIds: Set<string>): IdsList {
  const ids = dto.challengeIds.map((id) => createChallengeId(id, challengeIds))
  validateNodeChallengeCount(dto, ids.length)
  return IdsList.create(ids.map((id) => id.value))
}

function createNodeIdentity(dto: RoadmapNodeDto) {
  return {
    key: Slug.create(dto.key),
    category: ChallengeCategory.create({ ...dto.category }),
  }
}

function createNodeLayout(dto: RoadmapNodeDto) {
  return {
    position: { x: dto.position.x, y: dto.position.y },
    recommendationOrder: dto.recommendationOrder,
    state: dto.state,
  }
}

function createNodeBase(dto: RoadmapNodeDto) {
  return { ...createNodeIdentity(dto), ...createNodeLayout(dto) }
}

function validateEdgeShape(edge: Edge) {
  assertSlug(edge.prerequisiteNodeKey, 'A origem da aresta')
  assertSlug(edge.dependentNodeKey, 'O destino da aresta')
}

function requiredChallengeSlugs(dto: RoadmapNodeDto) {
  if (!dto.challengeSlugs) invalid(`O nó ${dto.key} precisa possuir slugs de desafio`)
  return [...dto.challengeSlugs]
}

function validateChallengeSlugs(challengeSlugs: string[]) {
  challengeSlugs.forEach((slug) => assertSlug(slug, 'O slug do desafio'))
}

function createNodeChallengeSlugs(dto: RoadmapNodeDto, challengeIds: IdsList) {
  const challengeSlugs = requiredChallengeSlugs(dto)
  validateChallengeSlugs(challengeSlugs)
  if (challengeSlugs.length !== challengeIds.ids.length)
    invalid(`Os slugs de desafio do nó ${dto.key} não correspondem aos ids`)
  return challengeSlugs
}

function createNode(dto: RoadmapNodeDto, sets: NodeValidationSets): Node {
  validateNodeIdentity(dto, sets)
  const challengeIds = createNodeChallengeIds(dto, sets.challengeIds)
  return {
    ...createNodeBase(dto),
    challengeIds,
    challengeSlugs: createNodeChallengeSlugs(dto, challengeIds),
  }
}

function validateEdgeReferences(edge: Edge, nodeKeys: Set<string>) {
  if (edge.prerequisiteNodeKey === edge.dependentNodeKey)
    invalid('O roadmap não pode possuir self-edge')
  if (!nodeKeys.has(edge.prerequisiteNodeKey) || !nodeKeys.has(edge.dependentNodeKey))
    invalid('Toda aresta deve referenciar nós existentes')
}

function validateUniqueEdge(edge: Edge, uniqueEdges: Set<string>) {
  const edgeKey = `${edge.prerequisiteNodeKey}->${edge.dependentNodeKey}`
  if (uniqueEdges.has(edgeKey)) invalid('As arestas do roadmap devem ser únicas')
  uniqueEdges.add(edgeKey)
}

function validateEdge(edge: Edge, nodeKeys: Set<string>, uniqueEdges: Set<string>) {
  validateEdgeShape(edge)
  validateEdgeReferences(edge, nodeKeys)
  validateUniqueEdge(edge, uniqueEdges)
}

function validateEdges(edges: Edge[], nodeKeys: Set<string>) {
  const uniqueEdges = new Set<string>()
  edges.forEach((edge) => validateEdge(edge, nodeKeys, uniqueEdges))
}

function hasUnprocessedPrerequisite(
  dependent: string,
  current: string,
  edges: Edge[],
  processed: Set<string>,
) {
  return edges.some(
    (edge) =>
      edge.dependentNodeKey === dependent &&
      edge.prerequisiteNodeKey !== current &&
      !processed.has(edge.prerequisiteNodeKey),
  )
}

function createOutgoingEdges(edges: Edge[]) {
  const outgoing = new Map<string, string[]>()
  for (const edge of edges) {
    const dependents = outgoing.get(edge.prerequisiteNodeKey) ?? []
    outgoing.set(edge.prerequisiteNodeKey, [...dependents, edge.dependentNodeKey])
  }
  return outgoing
}

function rootNodeKeys(edges: Edge[], nodeKeys: Set<string>) {
  return [...nodeKeys].filter(
    (key) => !edges.some((edge) => edge.dependentNodeKey === key),
  )
}

function processNode(
  key: string,
  outgoing: Map<string, string[]>,
  edges: Edge[],
  pending: string[],
  processed: Set<string>,
) {
  for (const dependent of outgoing.get(key) ?? [])
    processDependent(dependent, key, edges, pending, processed)
}

function processDependent(
  dependent: string,
  current: string,
  edges: Edge[],
  pending: string[],
  processed: Set<string>,
) {
  if (
    processed.has(dependent) ||
    hasUnprocessedPrerequisite(dependent, current, edges, processed)
  )
    return
  pending.push(dependent)
  processed.add(dependent)
}

function processPendingNode(
  pending: string[],
  outgoing: Map<string, string[]>,
  edges: Edge[],
  processed: Set<string>,
) {
  const key = pending.shift()
  if (key) processNode(key, outgoing, edges, pending, processed)
}

function hasCycle(edges: Edge[], nodeKeys: Set<string>) {
  const outgoing = createOutgoingEdges(edges)
  const pending = rootNodeKeys(edges, nodeKeys)
  const processed = new Set(pending)
  while (pending.length) processPendingNode(pending, outgoing, edges, processed)
  return processed.size !== nodeKeys.size
}

function validateAcyclic(edges: Edge[], nodeKeys: Set<string>) {
  if (hasCycle(edges, nodeKeys)) invalid('O roadmap deve ser um DAG sem ciclos')
}

function validateComingSoonTerminal(nodes: Node[], edges: Edge[]) {
  const comingSoon = new Set(
    nodes.filter((node) => node.state === 'comingSoon').map((node) => node.key.value),
  )
  if (edges.some((edge) => comingSoon.has(edge.prerequisiteNodeKey)))
    invalid('Um nó Em breve deve ser terminal e não pode possuir dependentes')
}

function completedRoadmapIds(nodes: Node[], ids?: IdsList): Set<string> {
  return new Set(
    ids?.ids
      .filter((id) => nodes.some((node) => node.challengeIds.includes(id).isTrue))
      .map((id) => id.value) ?? [],
  )
}

function isNodeEligible(
  nodeKey: string,
  nodes: Node[],
  edges: Edge[],
  completed: Set<string>,
): boolean {
  return edges
    .filter((edge) => edge.dependentNodeKey === nodeKey)
    .every((edge) =>
      nodes
        .find((node) => node.key.value === edge.prerequisiteNodeKey)
        ?.challengeIds.ids.every((id) => completed.has(id.value)),
    )
}

function nodeCompletion(node: Node, completed: Set<string>) {
  const total = node.challengeIds.ids.length
  const completedCount = node.challengeIds.ids.filter((id) =>
    completed.has(id.value),
  ).length
  return { total, completedCount }
}

function nodeProgress(node: Node, completed: Set<string>, isVisitor: boolean) {
  const { total, completedCount } = nodeCompletion(node, completed)
  return {
    totalChallenges: total,
    completedChallenges: isVisitor ? null : completedCount,
    isCompleted: isVisitor ? null : total > 0 && completedCount === total,
  }
}

function nodeEligibility(
  node: Node,
  nodes: Node[],
  edges: Edge[],
  completed: Set<string>,
  isVisitor: boolean,
) {
  return isVisitor ? null : isNodeEligible(node.key.value, nodes, edges, completed)
}

function nodeSnapshot(node: Node) {
  return { ...nodeSnapshotIdentity(node), ...nodeSnapshotState(node) }
}

function nodeSnapshotIdentity(node: Node) {
  return {
    key: node.key.value,
    category: node.category.dto,
  }
}

function nodeSnapshotState(node: Node) {
  return {
    position: { ...node.position },
    recommendationOrder: node.recommendationOrder,
    state: node.state,
    challengeIds: node.challengeIds.dto,
  }
}

function createNodeDto(
  node: Node,
  nodes: Node[],
  edges: Edge[],
  completed: Set<string>,
  isVisitor: boolean,
): RoadmapNodeDto {
  return {
    ...nodeSnapshot(node),
    ...nodeProgress(node, completed, isVisitor),
    isEligible: nodeEligibility(node, nodes, edges, completed, isVisitor),
  }
}

function progressFor(
  nodeDtos: RoadmapNodeDto[],
  isVisitor: boolean,
): ChallengeRoadmapDto['progress'] {
  if (isVisitor) return null
  return createProgressDto(totalChallenges(nodeDtos), completedChallenges(nodeDtos))
}

function createProgressDto(total: number, completed: number) {
  return {
    completed,
    total,
    percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
  }
}

function totalChallenges(nodes: RoadmapNodeDto[]) {
  return nodes.reduce((count, node) => count + node.totalChallenges, 0)
}

function completedChallenges(nodes: RoadmapNodeDto[]) {
  return nodes.reduce((count, node) => count + (node.completedChallenges ?? 0), 0)
}

function hasIncompleteChallenge(node: RoadmapNodeDto, completed: Set<string>) {
  return node.challengeIds.some((id) => !completed.has(id))
}

function recommendationNodeFor(nodeDtos: RoadmapNodeDto[], completed: Set<string>) {
  return [...nodeDtos]
    .filter((node) => node.state === 'content' && node.isEligible && !node.isCompleted)
    .sort((left, right) => left.recommendationOrder - right.recommendationOrder)
    .find((node) => hasIncompleteChallenge(node, completed))
}

function createRecommendation(
  node: RoadmapNodeDto,
  sourceNode: Node | undefined,
  completed: Set<string>,
): ChallengeRoadmapDto['recommendation'] {
  const challengeIndex = node.challengeIds.findIndex((id) => !completed.has(id))
  return createRecommendationDto(node, sourceNode, challengeIndex)
}

function createRecommendationDto(
  node: RoadmapNodeDto,
  sourceNode: Node | undefined,
  challengeIndex: number,
) {
  if (!sourceNode) invalid(`O nó ${node.key} não possui metadados de desafio`)
  return {
    nodeKey: node.key,
    challengeId: node.challengeIds[challengeIndex],
    challengeSlug: sourceNode.challengeSlugs[challengeIndex],
  }
}

function recommendationFor(
  nodes: Node[],
  nodeDtos: RoadmapNodeDto[],
  completed: Set<string>,
): ChallengeRoadmapDto['recommendation'] {
  const node = recommendationNodeFor(nodeDtos, completed)
  if (!node) return null
  const sourceNode = nodes.find((item) => item.key.value === node.key)
  return createRecommendation(node, sourceNode, completed)
}

type OrderedChallenge = {
  dto: Challenge['dto']
  order: number
}

function orderedNodeChallenges(
  roadmap: ChallengeRoadmap,
  nodeKey: Slug,
  challenges: Challenge[],
): OrderedChallenge[] {
  return challenges
    .map((challenge) => ({
      dto: challenge.dto,
      order: roadmap.challengeOrder(nodeKey, Id.create(challenge.dto.id ?? '')),
    }))
    .filter((challenge): challenge is OrderedChallenge => challenge.order !== null)
    .sort((left, right) => left.order - right.order)
}

function nodeChallengeDto(
  challenge: OrderedChallenge,
  isVisitor: boolean,
  completedChallengeIds?: IdsList,
) {
  return {
    ...challenge.dto,
    order: challenge.order,
    isCompleted: challengeCompletion(challenge, isVisitor, completedChallengeIds),
  }
}

function challengeCompletion(
  challenge: OrderedChallenge,
  isVisitor: boolean,
  completedChallengeIds?: IdsList,
) {
  if (isVisitor) return null
  return completedChallengeIds?.includes(Id.create(challenge.dto.id ?? '')).value ?? null
}

function nodeChallengesDto(
  nodeKey: Slug,
  challenges: OrderedChallenge[],
  isVisitor: boolean,
  completedChallengeIds?: IdsList,
): RoadmapNodeChallengesDto {
  return {
    nodeKey: nodeKey.value,
    challenges: challenges.map((challenge) =>
      nodeChallengeDto(challenge, isVisitor, completedChallengeIds),
    ),
  }
}

function createRoadmapNodes(roadmap: ChallengeRoadmap, completedChallengeIds?: IdsList) {
  const isVisitor = completedChallengeIds === undefined
  const completed = completedRoadmapIds(roadmap.nodes, completedChallengeIds)
  return roadmap.nodes.map((node) =>
    createNodeDto(node, roadmap.nodes, roadmap.edges, completed, isVisitor),
  )
}

function createRoadmapDto(
  roadmap: ChallengeRoadmap,
  completedChallengeIds?: IdsList,
): ChallengeRoadmapDto {
  const nodes = createRoadmapNodes(roadmap, completedChallengeIds)
  return createRoadmapSnapshot(roadmap, nodes, completedChallengeIds)
}

function createRoadmapSnapshot(
  roadmap: ChallengeRoadmap,
  nodes: RoadmapNodeDto[],
  completedChallengeIds?: IdsList,
): ChallengeRoadmapDto {
  const isVisitor = completedChallengeIds === undefined
  return {
    ...roadmapBase(roadmap, nodes),
    progress: progressFor(nodes, isVisitor),
    recommendation: roadmapRecommendation(roadmap, nodes, completedChallengeIds),
  }
}

function roadmapBase(roadmap: ChallengeRoadmap, nodes: RoadmapNodeDto[]) {
  return {
    revision: { ...roadmap.revision },
    nodes,
    edges: roadmap.edges.map((edge) => ({ ...edge })),
  }
}

function roadmapRecommendation(
  roadmap: ChallengeRoadmap,
  nodes: RoadmapNodeDto[],
  completedChallengeIds?: IdsList,
) {
  if (completedChallengeIds === undefined) return null
  return recommendationFor(
    roadmap.nodes,
    nodes,
    completedRoadmapIds(roadmap.nodes, completedChallengeIds),
  )
}

function createRoadmapNodesAndEdges(dto: ChallengeRoadmapDto) {
  const sets = createNodeValidationSets()
  const nodes = dto.nodes.map((node) => createNode(node, sets))
  const edges = dto.edges.map((edge) => ({ ...edge }))
  return { sets, nodes, edges }
}

function validateRoadmapGraph(nodes: Node[], edges: Edge[], nodeKeys: Set<string>) {
  validateEdges(edges, nodeKeys)
  validateAcyclic(edges, nodeKeys)
  validateComingSoonTerminal(nodes, edges)
}

export class ChallengeRoadmap {
  private constructor(
    readonly revision: ChallengeRoadmapDto['revision'],
    readonly nodes: Node[],
    readonly edges: Edge[],
  ) {}

  static create(dto: ChallengeRoadmapDto): ChallengeRoadmap {
    validateRevision(dto.revision)
    const { sets, nodes, edges } = createRoadmapNodesAndEdges(dto)
    validateRoadmapGraph(nodes, edges, sets.nodeKeys)

    return new ChallengeRoadmap({ ...dto.revision }, nodes, edges)
  }

  hasNode(nodeKey: Slug): Logical {
    return Logical.create(this.nodes.some((node) => node.key.value === nodeKey.value))
  }

  challengeOrder(nodeKey: Slug, challengeId: Id): number | null {
    const node = this.nodes.find((item) => item.key.value === nodeKey.value)
    if (!node) return null
    const index = node.challengeIds.ids.findIndex((id) => id.value === challengeId.value)
    return index === -1 ? null : index + 1
  }

  toNodeChallengesDto(
    nodeKey: Slug,
    challenges: Challenge[],
    completedChallengeIds?: IdsList,
  ): RoadmapNodeChallengesDto {
    const isVisitor = completedChallengeIds === undefined
    const ordered = orderedNodeChallenges(this, nodeKey, challenges)
    return nodeChallengesDto(nodeKey, ordered, isVisitor, completedChallengeIds)
  }

  toDto(completedChallengeIds?: IdsList | string[]): ChallengeRoadmapDto {
    const ids = Array.isArray(completedChallengeIds)
      ? IdsList.create(completedChallengeIds)
      : completedChallengeIds
    return createRoadmapDto(this, ids)
  }

  get dto(): ChallengeRoadmapDto {
    return this.toDto()
  }
}
