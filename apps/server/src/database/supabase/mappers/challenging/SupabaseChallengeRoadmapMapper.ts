import { ChallengeRoadmap } from '@stardust/core/challenging/structures'
import type { ChallengeRoadmapDto } from '@stardust/core/challenging/structures/dtos'
import type { Challenge } from '@stardust/core/challenging/entities'

import type { SupabaseChallenge } from '../../types'
import type { Database } from '../../types/Database'
import { SupabaseChallengeMapper } from './SupabaseChallengeMapper'

type RoadmapRevisionTableRow =
  Database['public']['Tables']['challenge_roadmap_revisions']['Row']
export type SupabaseChallengeRoadmapRevisionRow = Omit<
  RoadmapRevisionTableRow,
  'published_at' | 'status'
> & { published_at: string }

export type SupabaseChallengeRoadmapCategoryRow = {
  id: string
  name: string
}

type RoadmapNodeTableRow = Database['public']['Tables']['challenge_roadmap_nodes']['Row']
export type SupabaseChallengeRoadmapNodeRow = Omit<
  RoadmapNodeTableRow,
  'revision_id' | 'state'
> & {
  state: 'content' | 'comingSoon'
  categories: SupabaseChallengeRoadmapCategoryRow | SupabaseChallengeRoadmapCategoryRow[]
}

type RoadmapEdgeTableRow = Database['public']['Tables']['challenge_roadmap_edges']['Row']
export type SupabaseChallengeRoadmapEdgeRow = Pick<
  RoadmapEdgeTableRow,
  'prerequisite_node_id' | 'dependent_node_id'
>

type RoadmapNodeChallengeTableRow =
  Database['public']['Tables']['challenge_roadmap_node_challenges']['Row']
export type SupabaseChallengeRoadmapNodeChallengeRow = Pick<
  RoadmapNodeChallengeTableRow,
  'node_id' | 'challenge_id' | 'position'
>

export type SupabaseChallengeRoadmapSnapshot = {
  revision: SupabaseChallengeRoadmapRevisionRow
  nodes: SupabaseChallengeRoadmapNodeRow[]
  edges: SupabaseChallengeRoadmapEdgeRow[]
  nodeChallenges: SupabaseChallengeRoadmapNodeChallengeRow[]
  challenges: SupabaseChallenge[]
}

function categoryRow(
  category: SupabaseChallengeRoadmapCategoryRow | SupabaseChallengeRoadmapCategoryRow[],
) {
  if (!category) throw new Error('Challenge roadmap node has no category')
  if (!Array.isArray(category)) return category
  if (category.length !== 1)
    throw new Error('Challenge roadmap node has an invalid category')
  return category[0]
}

export class SupabaseChallengeRoadmapMapper {
  static toEntity(snapshot: SupabaseChallengeRoadmapSnapshot): ChallengeRoadmap {
    const challengesById = new Map(
      snapshot.challenges.map((challenge) => [challenge.id, challenge]),
    )
    const associationsByNode = new Map<
      string,
      SupabaseChallengeRoadmapNodeChallengeRow[]
    >()

    for (const association of snapshot.nodeChallenges) {
      const associations = associationsByNode.get(association.node_id) ?? []
      associations.push(association)
      associationsByNode.set(association.node_id, associations)
    }

    const nodes = snapshot.nodes.map((node) => {
      const associations = [...(associationsByNode.get(node.id) ?? [])].sort(
        (left, right) => left.position - right.position,
      )

      return {
        key: node.key,
        category: categoryRow(node.categories),
        position: { x: node.position_x, y: node.position_y },
        recommendationOrder: node.recommendation_order,
        state: node.state,
        challengeIds: associations.map((association) => association.challenge_id),
        challengeSlugs: associations.map(
          (association) => challengesById.get(association.challenge_id)?.slug ?? '',
        ),
      }
    })

    const nodeKeys = new Map(snapshot.nodes.map((node) => [node.id, node.key]))
    const dto: ChallengeRoadmapDto = {
      revision: {
        key: snapshot.revision.key,
        version: snapshot.revision.version,
        publishedAt: snapshot.revision.published_at,
      },
      nodes: nodes.map((node) => ({
        ...node,
        totalChallenges: node.challengeIds.length,
        completedChallenges: null,
        isCompleted: null,
        isEligible: null,
      })),
      edges: snapshot.edges.map((edge) => ({
        prerequisiteNodeKey: nodeKeys.get(edge.prerequisite_node_id) ?? '',
        dependentNodeKey: nodeKeys.get(edge.dependent_node_id) ?? '',
      })),
      progress: null,
      recommendation: null,
    }

    return ChallengeRoadmap.create(dto)
  }

  static toEntities(challenges: SupabaseChallenge[]): Challenge[] {
    return challenges.map(SupabaseChallengeMapper.toEntity)
  }
}
