import { type InferSelectModel, sql } from 'drizzle-orm'
import {
  check,
  index,
  jsonb,
  pgSchema,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core'

export const crewSchema = pgSchema('crew')

export const agentRunStatusEnum = crewSchema.enum('agent_run_status', [
  'started',
  'running',
  'stopping',
  'completed',
  'failed',
])

export const AgentRunsModel = crewSchema.table(
  'agent_runs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    agent: text('agent').notNull(),
    idempotencyKey: text('idempotency_key').notNull(),
    inputHash: text('input_hash').notNull(),
    status: agentRunStatusEnum('status').notNull().default('started'),
    heartbeatAt: timestamp('heartbeat_at', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),
    subjectKey: text('subject_key'),
    subjectRevision: text('subject_revision'),
    input: jsonb('input').notNull(),
    output: jsonb('output'),
    errorCode: text('error_code'),
    errorMessage: text('error_message'),
    createdAt: timestamp('created_at', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    })
      .notNull()
      .defaultNow(),
    startedAt: timestamp('started_at', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    }),
    finishedAt: timestamp('finished_at', {
      precision: 3,
      withTimezone: true,
      mode: 'date',
    }),
  },
  (table) => [
    uniqueIndex('agent_runs_agent_idempotency_key_unique').on(
      table.agent,
      table.idempotencyKey,
    ),
    index('agent_runs_last_completed_idx')
      .on(table.agent, table.subjectKey, table.finishedAt.desc())
      .where(sql`${table.status} = 'completed'`),
    index('agent_runs_unfinished_heartbeat_idx')
      .on(table.heartbeatAt)
      .where(sql`${table.status} in ('started', 'running', 'stopping')`),
    index('agent_runs_finished_at_idx').on(table.finishedAt),
    check(
      'agent_runs_finished_state_check',
      sql`(${table.status} in ('completed', 'failed')) = (${table.finishedAt} is not null)`,
    ),
    check(
      'agent_runs_output_state_check',
      sql`${table.output} is null or ${table.status} = 'completed'`,
    ),
  ],
)

export type AgentRun = InferSelectModel<typeof AgentRunsModel>
