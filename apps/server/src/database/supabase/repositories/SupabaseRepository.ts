import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '../types/Database'

export abstract class SupabaseRepository {
  constructor(protected readonly supabase: SupabaseClient<Database>) {}

  protected readonly POSTGRES_ERROR_CODES = {
    PGRST100: 'PGRST100', // Parsing error in the query string parameter
    PGRST101: 'PGRST101', // Only GET and POST verbs are allowed
    PGRST102: 'PGRST102', // Invalid request body
    PGRST103: 'PGRST103', // Invalid range specified
    PGRST105: 'PGRST105', // Invalid PUT request
    PGRST106: 'PGRST106', // Schema not present in db-schemas config
    PGRST107: 'PGRST107', // Invalid content-type in request
    PGRST108: 'PGRST108', // Filter applied to non-specified embedded resource
    PGRST109: 'PGRST109', // Deletion/Update with limits must include unique column ordering
    PGRST110: 'PGRST110', // Deletion/Update with limits exceeds maximum rows
    PGRST111: 'PGRST111', // Invalid response headers
    PGRST112: 'PGRST112', // Status code must be positive integer
    PGRST114: 'PGRST114', // UPSERT using PUT with limits and offsets
    PGRST115: 'PGRST115', // UPSERT using PUT with mismatched key and body
    PGRST116: 'PGRST116', // More than 1 or no items where returned when requesting a singular response
    PGRST117: 'PGRST117', // HTTP verb not supported
    PGRST118: 'PGRST118', // Cannot order by related table - no relationship
    PGRST119: 'PGRST119', // Cannot use spread operator on related table - no relationship
    PGRST120: 'PGRST120', // Embedded resource can only be filtered using is.null/not.is.null
    PGRST121: 'PGRST121', // Cannot parse JSON objects in RAISE
    PGRST122: 'PGRST122', // Invalid preferences in Prefer header
  }

  protected calculateQueryRange(page: number, itemsPerPage: number) {
    const offset = (page - 1) * itemsPerPage

    return {
      from: offset,
      to: offset + itemsPerPage - 1,
    }
  }
}
