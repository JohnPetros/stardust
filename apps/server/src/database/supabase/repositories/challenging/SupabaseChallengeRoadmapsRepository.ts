import { Logical, type Id, type Slug } from '@stardust/core/global/structures'
import type { Challenge } from '@stardust/core/challenging/entities'
import type { ChallengeRoadmap } from '@stardust/core/challenging/structures'
import type { ChallengeRoadmapsRepository } from '@stardust/core/challenging/interfaces'
import type { SupabaseClient } from '@supabase/supabase-js'

import { SupabasePostgreError } from '../../errors'
import type { SupabaseChallenge } from '../../types'
import type { Database } from '../../types/Database'
import {
  SupabaseChallengeRoadmapMapper,
  type SupabaseChallengeRoadmapEdgeRow,
  type SupabaseChallengeRoadmapNodeChallengeRow,
  type SupabaseChallengeRoadmapNodeRow,
  type SupabaseChallengeRoadmapRevisionRow,
  type SupabaseChallengeRoadmapSnapshot,
} from '../../mappers/challenging/SupabaseChallengeRoadmapMapper'
import { SupabaseRepository } from '../SupabaseRepository'

type RoadmapClient = SupabaseClient<Database>

function hasCategory(challenge: SupabaseChallenge, categoryId: string) {
  return (challenge.categories ?? []).some((category) => {
    if (!category || typeof category !== 'object' || Array.isArray(category)) return false
    return 'id' in category && category.id === categoryId
  })
}

export type InvalidChallengeRoadmapAssociation = {
  challengeId: string
  nodeKey: string
}

export type ChallengeRoadmapTelemetry = {
  trackInvalidAssociation: (details: InvalidChallengeRoadmapAssociation) => void
}

const consoleChallengeRoadmapTelemetry: ChallengeRoadmapTelemetry = {
  trackInvalidAssociation: ({ challengeId, nodeKey }) => {
    console.warn('O roadmap de desafios omitiu uma associação inválida', {
      challengeId,
      nodeKey,
    })
  },
}

export function filterValidChallengeRoadmapAssociations(
  nodes: SupabaseChallengeRoadmapNodeRow[],
  associations: SupabaseChallengeRoadmapNodeChallengeRow[],
  challenges: SupabaseChallenge[],
  telemetry: ChallengeRoadmapTelemetry = consoleChallengeRoadmapTelemetry,
) {
  const nodesById = new Map(nodes.map((node) => [node.id, node]))
  const challengesById = new Map(
    challenges
      .filter(
        (challenge): challenge is SupabaseChallenge & { id: string } => !!challenge.id,
      )
      .map((challenge) => [challenge.id, challenge]),
  )

  return associations.filter((association) => {
    const node = nodesById.get(association.node_id)
    const challenge = challengesById.get(association.challenge_id)
    const isValid =
      !!node &&
      !!challenge &&
      challenge.is_public === true &&
      challenge.star_id === null &&
      hasCategory(challenge, node.category_id)

    if (!isValid) {
      telemetry.trackInvalidAssociation({
        challengeId: association.challenge_id,
        nodeKey: node?.key ?? association.node_id,
      })
    }

    return isValid
  })
}

export class SupabaseChallengeRoadmapsRepository
  extends SupabaseRepository
  implements ChallengeRoadmapsRepository
{
  private readonly roadmapClient: RoadmapClient

  constructor(
    supabase: RoadmapClient,
    private readonly telemetry: ChallengeRoadmapTelemetry = consoleChallengeRoadmapTelemetry,
  ) {
    super(supabase)
    this.roadmapClient = supabase
  }

  async findPublished(): Promise<ChallengeRoadmap | null> {
    const snapshot = await this.fetchPublishedSnapshot()
    if (!snapshot) return null
    return SupabaseChallengeRoadmapMapper.toEntity(snapshot)
  }

  async findNodeChallenges(nodeKey: Slug): Promise<Challenge[]> {
    const snapshot = await this.fetchPublishedSnapshot()
    if (!snapshot) return []

    const node = snapshot.nodes.find((item) => item.key === nodeKey.value)
    if (!node) return []

    const challengeIds = new Set(
      snapshot.nodeChallenges
        .filter((association) => association.node_id === node.id)
        .map((association) => association.challenge_id),
    )
    const challenges = snapshot.challenges.filter((challenge) =>
      challengeIds.has(challenge.id ?? ''),
    )
    const byPosition = new Map(
      snapshot.nodeChallenges
        .filter((association) => association.node_id === node.id)
        .map((association) => [association.challenge_id, association.position]),
    )

    return SupabaseChallengeRoadmapMapper.toEntities(challenges).sort(
      (left, right) =>
        (byPosition.get(left.id.value) ?? Number.MAX_SAFE_INTEGER) -
        (byPosition.get(right.id.value) ?? Number.MAX_SAFE_INTEGER),
    )
  }

  async hasChallengeInPublishedRevision(challengeId: Id): Promise<Logical> {
    const { data: revision, error: revisionError } = await this.roadmapClient
      .from('challenge_roadmap_revisions')
      .select('id')
      .eq('status', 'published')
      .maybeSingle()

    if (revisionError) throw new SupabasePostgreError(revisionError)
    if (!revision) return Logical.create(false)

    const { data, error } = await this.roadmapClient
      .from('challenge_roadmap_node_challenges')
      .select('challenge_id')
      .eq('revision_id', revision.id)
      .eq('challenge_id', challengeId.value)
      .maybeSingle()

    if (error) throw new SupabasePostgreError(error)
    return Logical.create(Boolean(data))
  }

  private async fetchPublishedSnapshot(): Promise<SupabaseChallengeRoadmapSnapshot | null> {
    const { data: revision, error: revisionError } = await this.roadmapClient
      .from('challenge_roadmap_revisions')
      .select('id,key,version,published_at')
      .eq('status', 'published')
      .maybeSingle()

    if (revisionError) throw new SupabasePostgreError(revisionError)
    if (!revision) return null

    const { nodes, edges, nodeChallenges } = await this.fetchRoadmapRows(revision.id)
    const challengeRows = await this.fetchChallengeRows(nodeChallenges)
    const validNodeChallenges = filterValidChallengeRoadmapAssociations(
      nodes,
      nodeChallenges,
      challengeRows,
      this.telemetry,
    )
    const validChallengeIds = new Set(
      validNodeChallenges.map((association) => association.challenge_id),
    )

    return {
      revision: revision as SupabaseChallengeRoadmapRevisionRow,
      nodes,
      edges,
      nodeChallenges: validNodeChallenges,
      challenges: challengeRows.filter((challenge) =>
        validChallengeIds.has(challenge.id ?? ''),
      ),
    }
  }

  private async fetchRoadmapRows(revisionId: string) {
    const [nodesResult, edgesResult, associationsResult] = await Promise.all([
      this.roadmapClient
        .from('challenge_roadmap_nodes')
        .select(
          'id,key,category_id,position_x,position_y,recommendation_order,state,categories(id,name)',
        )
        .eq('revision_id', revisionId)
        .order('recommendation_order', { ascending: true }),
      this.roadmapClient
        .from('challenge_roadmap_edges')
        .select('prerequisite_node_id,dependent_node_id')
        .eq('revision_id', revisionId),
      this.roadmapClient
        .from('challenge_roadmap_node_challenges')
        .select('node_id,challenge_id,position')
        .eq('revision_id', revisionId)
        .order('position', { ascending: true }),
    ])

    if (nodesResult.error) throw new SupabasePostgreError(nodesResult.error)
    if (edgesResult.error) throw new SupabasePostgreError(edgesResult.error)
    if (associationsResult.error) throw new SupabasePostgreError(associationsResult.error)

    return {
      nodes: nodesResult.data as unknown as SupabaseChallengeRoadmapNodeRow[],
      edges: edgesResult.data as SupabaseChallengeRoadmapEdgeRow[],
      nodeChallenges:
        associationsResult.data as SupabaseChallengeRoadmapNodeChallengeRow[],
    }
  }

  private async fetchChallengeRows(
    associations: SupabaseChallengeRoadmapNodeChallengeRow[],
  ): Promise<SupabaseChallenge[]> {
    const challengeIds = [
      ...new Set(associations.map((association) => association.challenge_id)),
    ]
    if (challengeIds.length === 0) return []

    const { data, error } = await this.roadmapClient
      .from('challenges_view')
      .select('*')
      .in('id', challengeIds)

    if (error) throw new SupabasePostgreError(error)
    return data as SupabaseChallenge[]
  }
}
