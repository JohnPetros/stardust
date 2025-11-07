export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '12.2.3 (519615d)'
  }
  auth: {
    Tables: {
      audit_log_entries: {
        Row: {
          created_at: string | null
          id: string
          instance_id: string | null
          ip_address: string
          payload: Json | null
        }
        Insert: {
          created_at?: string | null
          id: string
          instance_id?: string | null
          ip_address?: string
          payload?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          instance_id?: string | null
          ip_address?: string
          payload?: Json | null
        }
        Relationships: []
      }
      flow_state: {
        Row: {
          auth_code: string
          auth_code_issued_at: string | null
          authentication_method: string
          code_challenge: string
          code_challenge_method: Database['auth']['Enums']['code_challenge_method']
          created_at: string | null
          id: string
          provider_access_token: string | null
          provider_refresh_token: string | null
          provider_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          auth_code: string
          auth_code_issued_at?: string | null
          authentication_method: string
          code_challenge: string
          code_challenge_method: Database['auth']['Enums']['code_challenge_method']
          created_at?: string | null
          id: string
          provider_access_token?: string | null
          provider_refresh_token?: string | null
          provider_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          auth_code?: string
          auth_code_issued_at?: string | null
          authentication_method?: string
          code_challenge?: string
          code_challenge_method?: Database['auth']['Enums']['code_challenge_method']
          created_at?: string | null
          id?: string
          provider_access_token?: string | null
          provider_refresh_token?: string | null
          provider_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      identities: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          identity_data: Json
          last_sign_in_at: string | null
          provider: string
          provider_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          identity_data: Json
          last_sign_in_at?: string | null
          provider: string
          provider_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          identity_data?: Json
          last_sign_in_at?: string | null
          provider?: string
          provider_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'identities_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      instances: {
        Row: {
          created_at: string | null
          id: string
          raw_base_config: string | null
          updated_at: string | null
          uuid: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          raw_base_config?: string | null
          updated_at?: string | null
          uuid?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          raw_base_config?: string | null
          updated_at?: string | null
          uuid?: string | null
        }
        Relationships: []
      }
      mfa_amr_claims: {
        Row: {
          authentication_method: string
          created_at: string
          id: string
          session_id: string
          updated_at: string
        }
        Insert: {
          authentication_method: string
          created_at: string
          id: string
          session_id: string
          updated_at: string
        }
        Update: {
          authentication_method?: string
          created_at?: string
          id?: string
          session_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'mfa_amr_claims_session_id_fkey'
            columns: ['session_id']
            isOneToOne: false
            referencedRelation: 'sessions'
            referencedColumns: ['id']
          },
        ]
      }
      mfa_challenges: {
        Row: {
          created_at: string
          factor_id: string
          id: string
          ip_address: unknown
          otp_code: string | null
          verified_at: string | null
          web_authn_session_data: Json | null
        }
        Insert: {
          created_at: string
          factor_id: string
          id: string
          ip_address: unknown
          otp_code?: string | null
          verified_at?: string | null
          web_authn_session_data?: Json | null
        }
        Update: {
          created_at?: string
          factor_id?: string
          id?: string
          ip_address?: unknown
          otp_code?: string | null
          verified_at?: string | null
          web_authn_session_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: 'mfa_challenges_auth_factor_id_fkey'
            columns: ['factor_id']
            isOneToOne: false
            referencedRelation: 'mfa_factors'
            referencedColumns: ['id']
          },
        ]
      }
      mfa_factors: {
        Row: {
          created_at: string
          factor_type: Database['auth']['Enums']['factor_type']
          friendly_name: string | null
          id: string
          last_challenged_at: string | null
          phone: string | null
          secret: string | null
          status: Database['auth']['Enums']['factor_status']
          updated_at: string
          user_id: string
          web_authn_aaguid: string | null
          web_authn_credential: Json | null
        }
        Insert: {
          created_at: string
          factor_type: Database['auth']['Enums']['factor_type']
          friendly_name?: string | null
          id: string
          last_challenged_at?: string | null
          phone?: string | null
          secret?: string | null
          status: Database['auth']['Enums']['factor_status']
          updated_at: string
          user_id: string
          web_authn_aaguid?: string | null
          web_authn_credential?: Json | null
        }
        Update: {
          created_at?: string
          factor_type?: Database['auth']['Enums']['factor_type']
          friendly_name?: string | null
          id?: string
          last_challenged_at?: string | null
          phone?: string | null
          secret?: string | null
          status?: Database['auth']['Enums']['factor_status']
          updated_at?: string
          user_id?: string
          web_authn_aaguid?: string | null
          web_authn_credential?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: 'mfa_factors_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      oauth_authorizations: {
        Row: {
          approved_at: string | null
          authorization_code: string | null
          authorization_id: string
          client_id: string
          code_challenge: string | null
          code_challenge_method: Database['auth']['Enums']['code_challenge_method'] | null
          created_at: string
          expires_at: string
          id: string
          redirect_uri: string
          resource: string | null
          response_type: Database['auth']['Enums']['oauth_response_type']
          scope: string
          state: string | null
          status: Database['auth']['Enums']['oauth_authorization_status']
          user_id: string | null
        }
        Insert: {
          approved_at?: string | null
          authorization_code?: string | null
          authorization_id: string
          client_id: string
          code_challenge?: string | null
          code_challenge_method?:
            | Database['auth']['Enums']['code_challenge_method']
            | null
          created_at?: string
          expires_at?: string
          id: string
          redirect_uri: string
          resource?: string | null
          response_type?: Database['auth']['Enums']['oauth_response_type']
          scope: string
          state?: string | null
          status?: Database['auth']['Enums']['oauth_authorization_status']
          user_id?: string | null
        }
        Update: {
          approved_at?: string | null
          authorization_code?: string | null
          authorization_id?: string
          client_id?: string
          code_challenge?: string | null
          code_challenge_method?:
            | Database['auth']['Enums']['code_challenge_method']
            | null
          created_at?: string
          expires_at?: string
          id?: string
          redirect_uri?: string
          resource?: string | null
          response_type?: Database['auth']['Enums']['oauth_response_type']
          scope?: string
          state?: string | null
          status?: Database['auth']['Enums']['oauth_authorization_status']
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'oauth_authorizations_client_id_fkey'
            columns: ['client_id']
            isOneToOne: false
            referencedRelation: 'oauth_clients'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'oauth_authorizations_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      oauth_clients: {
        Row: {
          client_name: string | null
          client_secret_hash: string | null
          client_type: Database['auth']['Enums']['oauth_client_type']
          client_uri: string | null
          created_at: string
          deleted_at: string | null
          grant_types: string
          id: string
          logo_uri: string | null
          redirect_uris: string
          registration_type: Database['auth']['Enums']['oauth_registration_type']
          updated_at: string
        }
        Insert: {
          client_name?: string | null
          client_secret_hash?: string | null
          client_type?: Database['auth']['Enums']['oauth_client_type']
          client_uri?: string | null
          created_at?: string
          deleted_at?: string | null
          grant_types: string
          id: string
          logo_uri?: string | null
          redirect_uris: string
          registration_type: Database['auth']['Enums']['oauth_registration_type']
          updated_at?: string
        }
        Update: {
          client_name?: string | null
          client_secret_hash?: string | null
          client_type?: Database['auth']['Enums']['oauth_client_type']
          client_uri?: string | null
          created_at?: string
          deleted_at?: string | null
          grant_types?: string
          id?: string
          logo_uri?: string | null
          redirect_uris?: string
          registration_type?: Database['auth']['Enums']['oauth_registration_type']
          updated_at?: string
        }
        Relationships: []
      }
      oauth_consents: {
        Row: {
          client_id: string
          granted_at: string
          id: string
          revoked_at: string | null
          scopes: string
          user_id: string
        }
        Insert: {
          client_id: string
          granted_at?: string
          id: string
          revoked_at?: string | null
          scopes: string
          user_id: string
        }
        Update: {
          client_id?: string
          granted_at?: string
          id?: string
          revoked_at?: string | null
          scopes?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'oauth_consents_client_id_fkey'
            columns: ['client_id']
            isOneToOne: false
            referencedRelation: 'oauth_clients'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'oauth_consents_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      one_time_tokens: {
        Row: {
          created_at: string
          id: string
          relates_to: string
          token_hash: string
          token_type: Database['auth']['Enums']['one_time_token_type']
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id: string
          relates_to: string
          token_hash: string
          token_type: Database['auth']['Enums']['one_time_token_type']
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          relates_to?: string
          token_hash?: string
          token_type?: Database['auth']['Enums']['one_time_token_type']
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'one_time_tokens_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      refresh_tokens: {
        Row: {
          created_at: string | null
          id: number
          instance_id: string | null
          parent: string | null
          revoked: boolean | null
          session_id: string | null
          token: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          instance_id?: string | null
          parent?: string | null
          revoked?: boolean | null
          session_id?: string | null
          token?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          instance_id?: string | null
          parent?: string | null
          revoked?: boolean | null
          session_id?: string | null
          token?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'refresh_tokens_session_id_fkey'
            columns: ['session_id']
            isOneToOne: false
            referencedRelation: 'sessions'
            referencedColumns: ['id']
          },
        ]
      }
      saml_providers: {
        Row: {
          attribute_mapping: Json | null
          created_at: string | null
          entity_id: string
          id: string
          metadata_url: string | null
          metadata_xml: string
          name_id_format: string | null
          sso_provider_id: string
          updated_at: string | null
        }
        Insert: {
          attribute_mapping?: Json | null
          created_at?: string | null
          entity_id: string
          id: string
          metadata_url?: string | null
          metadata_xml: string
          name_id_format?: string | null
          sso_provider_id: string
          updated_at?: string | null
        }
        Update: {
          attribute_mapping?: Json | null
          created_at?: string | null
          entity_id?: string
          id?: string
          metadata_url?: string | null
          metadata_xml?: string
          name_id_format?: string | null
          sso_provider_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'saml_providers_sso_provider_id_fkey'
            columns: ['sso_provider_id']
            isOneToOne: false
            referencedRelation: 'sso_providers'
            referencedColumns: ['id']
          },
        ]
      }
      saml_relay_states: {
        Row: {
          created_at: string | null
          flow_state_id: string | null
          for_email: string | null
          id: string
          redirect_to: string | null
          request_id: string
          sso_provider_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          flow_state_id?: string | null
          for_email?: string | null
          id: string
          redirect_to?: string | null
          request_id: string
          sso_provider_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          flow_state_id?: string | null
          for_email?: string | null
          id?: string
          redirect_to?: string | null
          request_id?: string
          sso_provider_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'saml_relay_states_flow_state_id_fkey'
            columns: ['flow_state_id']
            isOneToOne: false
            referencedRelation: 'flow_state'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'saml_relay_states_sso_provider_id_fkey'
            columns: ['sso_provider_id']
            isOneToOne: false
            referencedRelation: 'sso_providers'
            referencedColumns: ['id']
          },
        ]
      }
      schema_migrations: {
        Row: {
          version: string
        }
        Insert: {
          version: string
        }
        Update: {
          version?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          aal: Database['auth']['Enums']['aal_level'] | null
          created_at: string | null
          factor_id: string | null
          id: string
          ip: unknown
          not_after: string | null
          oauth_client_id: string | null
          refreshed_at: string | null
          tag: string | null
          updated_at: string | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          aal?: Database['auth']['Enums']['aal_level'] | null
          created_at?: string | null
          factor_id?: string | null
          id: string
          ip?: unknown
          not_after?: string | null
          oauth_client_id?: string | null
          refreshed_at?: string | null
          tag?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          aal?: Database['auth']['Enums']['aal_level'] | null
          created_at?: string | null
          factor_id?: string | null
          id?: string
          ip?: unknown
          not_after?: string | null
          oauth_client_id?: string | null
          refreshed_at?: string | null
          tag?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'sessions_oauth_client_id_fkey'
            columns: ['oauth_client_id']
            isOneToOne: false
            referencedRelation: 'oauth_clients'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'sessions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      sso_domains: {
        Row: {
          created_at: string | null
          domain: string
          id: string
          sso_provider_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain: string
          id: string
          sso_provider_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string
          id?: string
          sso_provider_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'sso_domains_sso_provider_id_fkey'
            columns: ['sso_provider_id']
            isOneToOne: false
            referencedRelation: 'sso_providers'
            referencedColumns: ['id']
          },
        ]
      }
      sso_providers: {
        Row: {
          created_at: string | null
          disabled: boolean | null
          id: string
          resource_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          disabled?: boolean | null
          id: string
          resource_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          disabled?: boolean | null
          id?: string
          resource_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          aud: string | null
          banned_until: string | null
          confirmation_sent_at: string | null
          confirmation_token: string | null
          confirmed_at: string | null
          created_at: string | null
          deleted_at: string | null
          email: string | null
          email_change: string | null
          email_change_confirm_status: number | null
          email_change_sent_at: string | null
          email_change_token_current: string | null
          email_change_token_new: string | null
          email_confirmed_at: string | null
          encrypted_password: string | null
          id: string
          instance_id: string | null
          invited_at: string | null
          is_anonymous: boolean
          is_sso_user: boolean
          is_super_admin: boolean | null
          last_sign_in_at: string | null
          phone: string | null
          phone_change: string | null
          phone_change_sent_at: string | null
          phone_change_token: string | null
          phone_confirmed_at: string | null
          raw_app_meta_data: Json | null
          raw_user_meta_data: Json | null
          reauthentication_sent_at: string | null
          reauthentication_token: string | null
          recovery_sent_at: string | null
          recovery_token: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          aud?: string | null
          banned_until?: string | null
          confirmation_sent_at?: string | null
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          email_change?: string | null
          email_change_confirm_status?: number | null
          email_change_sent_at?: string | null
          email_change_token_current?: string | null
          email_change_token_new?: string | null
          email_confirmed_at?: string | null
          encrypted_password?: string | null
          id: string
          instance_id?: string | null
          invited_at?: string | null
          is_anonymous?: boolean
          is_sso_user?: boolean
          is_super_admin?: boolean | null
          last_sign_in_at?: string | null
          phone?: string | null
          phone_change?: string | null
          phone_change_sent_at?: string | null
          phone_change_token?: string | null
          phone_confirmed_at?: string | null
          raw_app_meta_data?: Json | null
          raw_user_meta_data?: Json | null
          reauthentication_sent_at?: string | null
          reauthentication_token?: string | null
          recovery_sent_at?: string | null
          recovery_token?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          aud?: string | null
          banned_until?: string | null
          confirmation_sent_at?: string | null
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          email_change?: string | null
          email_change_confirm_status?: number | null
          email_change_sent_at?: string | null
          email_change_token_current?: string | null
          email_change_token_new?: string | null
          email_confirmed_at?: string | null
          encrypted_password?: string | null
          id?: string
          instance_id?: string | null
          invited_at?: string | null
          is_anonymous?: boolean
          is_sso_user?: boolean
          is_super_admin?: boolean | null
          last_sign_in_at?: string | null
          phone?: string | null
          phone_change?: string | null
          phone_change_sent_at?: string | null
          phone_change_token?: string | null
          phone_confirmed_at?: string | null
          raw_app_meta_data?: Json | null
          raw_user_meta_data?: Json | null
          reauthentication_sent_at?: string | null
          reauthentication_token?: string | null
          recovery_sent_at?: string | null
          recovery_token?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      email: { Args: never; Returns: string }
      jwt: { Args: never; Returns: Json }
      role: { Args: never; Returns: string }
      uid: { Args: never; Returns: string }
    }
    Enums: {
      aal_level: 'aal1' | 'aal2' | 'aal3'
      code_challenge_method: 's256' | 'plain'
      factor_status: 'unverified' | 'verified'
      factor_type: 'totp' | 'webauthn' | 'phone'
      oauth_authorization_status: 'pending' | 'approved' | 'denied' | 'expired'
      oauth_client_type: 'public' | 'confidential'
      oauth_registration_type: 'dynamic' | 'manual'
      oauth_response_type: 'code'
      one_time_token_type:
        | 'confirmation_token'
        | 'reauthentication_token'
        | 'recovery_token'
        | 'email_change_token_new'
        | 'email_change_token_current'
        | 'phone_change_token'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  cron: {
    Tables: {
      job: {
        Row: {
          active: boolean
          command: string
          database: string
          jobid: number
          jobname: string | null
          nodename: string
          nodeport: number
          schedule: string
          username: string
        }
        Insert: {
          active?: boolean
          command: string
          database?: string
          jobid?: number
          jobname?: string | null
          nodename?: string
          nodeport?: number
          schedule: string
          username?: string
        }
        Update: {
          active?: boolean
          command?: string
          database?: string
          jobid?: number
          jobname?: string | null
          nodename?: string
          nodeport?: number
          schedule?: string
          username?: string
        }
        Relationships: []
      }
      job_run_details: {
        Row: {
          command: string | null
          database: string | null
          end_time: string | null
          job_pid: number | null
          jobid: number | null
          return_message: string | null
          runid: number
          start_time: string | null
          status: string | null
          username: string | null
        }
        Insert: {
          command?: string | null
          database?: string | null
          end_time?: string | null
          job_pid?: number | null
          jobid?: number | null
          return_message?: string | null
          runid?: number
          start_time?: string | null
          status?: string | null
          username?: string | null
        }
        Update: {
          command?: string | null
          database?: string | null
          end_time?: string | null
          job_pid?: number | null
          jobid?: number | null
          return_message?: string | null
          runid?: number
          start_time?: string | null
          status?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      alter_job: {
        Args: {
          active?: boolean
          command?: string
          database?: string
          job_id: number
          schedule?: string
          username?: string
        }
        Returns: undefined
      }
      schedule:
        | {
            Args: { command: string; job_name: string; schedule: string }
            Returns: number
          }
        | { Args: { command: string; schedule: string }; Returns: number }
      schedule_in_database: {
        Args: {
          active?: boolean
          command: string
          database: string
          job_name: string
          schedule: string
          username?: string
        }
        Returns: number
      }
      unschedule:
        | { Args: { job_name: string }; Returns: boolean }
        | { Args: { job_id: number }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  extensions: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      pg_stat_statements: {
        Row: {
          blk_read_time: number | null
          blk_write_time: number | null
          calls: number | null
          dbid: unknown
          jit_emission_count: number | null
          jit_emission_time: number | null
          jit_functions: number | null
          jit_generation_time: number | null
          jit_inlining_count: number | null
          jit_inlining_time: number | null
          jit_optimization_count: number | null
          jit_optimization_time: number | null
          local_blks_dirtied: number | null
          local_blks_hit: number | null
          local_blks_read: number | null
          local_blks_written: number | null
          max_exec_time: number | null
          max_plan_time: number | null
          mean_exec_time: number | null
          mean_plan_time: number | null
          min_exec_time: number | null
          min_plan_time: number | null
          plans: number | null
          query: string | null
          queryid: number | null
          rows: number | null
          shared_blks_dirtied: number | null
          shared_blks_hit: number | null
          shared_blks_read: number | null
          shared_blks_written: number | null
          stddev_exec_time: number | null
          stddev_plan_time: number | null
          temp_blk_read_time: number | null
          temp_blk_write_time: number | null
          temp_blks_read: number | null
          temp_blks_written: number | null
          toplevel: boolean | null
          total_exec_time: number | null
          total_plan_time: number | null
          userid: unknown
          wal_bytes: number | null
          wal_fpi: number | null
          wal_records: number | null
        }
        Relationships: []
      }
      pg_stat_statements_info: {
        Row: {
          dealloc: number | null
          stats_reset: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      algorithm_sign: {
        Args: { algorithm: string; secret: string; signables: string }
        Returns: string
      }
      dearmor: { Args: { '': string }; Returns: string }
      gen_random_uuid: { Args: never; Returns: string }
      gen_salt: { Args: { '': string }; Returns: string }
      pg_stat_statements: {
        Args: { showtext: boolean }
        Returns: Record<string, unknown>[]
      }
      pg_stat_statements_info: { Args: never; Returns: Record<string, unknown> }
      pg_stat_statements_reset: {
        Args: { dbid?: unknown; queryid?: number; userid?: unknown }
        Returns: undefined
      }
      pgp_armor_headers: {
        Args: { '': string }
        Returns: Record<string, unknown>[]
      }
      sign: {
        Args: { algorithm?: string; payload: Json; secret: string }
        Returns: string
      }
      try_cast_double: { Args: { inp: string }; Returns: number }
      url_decode: { Args: { data: string }; Returns: string }
      url_encode: { Args: { data: string }; Returns: string }
      uuid_generate_v1: { Args: never; Returns: string }
      uuid_generate_v1mc: { Args: never; Returns: string }
      uuid_generate_v3: {
        Args: { name: string; namespace: string }
        Returns: string
      }
      uuid_generate_v4: { Args: never; Returns: string }
      uuid_generate_v5: {
        Args: { name: string; namespace: string }
        Returns: string
      }
      uuid_nil: { Args: never; Returns: string }
      uuid_ns_dns: { Args: never; Returns: string }
      uuid_ns_oid: { Args: never; Returns: string }
      uuid_ns_url: { Args: never; Returns: string }
      uuid_ns_x500: { Args: never; Returns: string }
      verify: {
        Args: { algorithm?: string; secret: string; token: string }
        Returns: {
          header: Json
          payload: Json
          valid: boolean
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          description: string
          icon: string
          id: string
          metric: string
          name: string
          position: number
          required_count: number
          reward: number
        }
        Insert: {
          description: string
          icon: string
          id?: string
          metric?: string
          name: string
          position: number
          required_count: number
          reward?: number
        }
        Update: {
          description?: string
          icon?: string
          id?: string
          metric?: string
          name?: string
          position?: number
          required_count?: number
          reward?: number
        }
        Relationships: []
      }
      avatars: {
        Row: {
          id: string
          image: string
          is_acquired_by_default: boolean
          is_selected_by_default: boolean
          name: string
          price: number
        }
        Insert: {
          id?: string
          image: string
          is_acquired_by_default?: boolean
          is_selected_by_default?: boolean
          name: string
          price: number
        }
        Update: {
          id?: string
          image?: string
          is_acquired_by_default?: boolean
          is_selected_by_default?: boolean
          name?: string
          price?: number
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      challenges: {
        Row: {
          code: string
          created_at: string
          description: string | null
          difficulty_level: string
          function_name: string | null
          id: string
          is_public: boolean
          slug: string
          star_id: string | null
          test_cases: Json
          texts: Json | null
          title: string
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          difficulty_level?: string
          function_name?: string | null
          id?: string
          is_public?: boolean
          slug: string
          star_id?: string | null
          test_cases: Json
          texts?: Json | null
          title?: string
          user_id?: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          difficulty_level?: string
          function_name?: string | null
          id?: string
          is_public?: boolean
          slug?: string
          star_id?: string | null
          test_cases?: Json
          texts?: Json | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'challenges_star_id_fkey'
            columns: ['star_id']
            isOneToOne: false
            referencedRelation: 'next_star_from_next_planet'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'challenges_star_id_fkey'
            columns: ['star_id']
            isOneToOne: false
            referencedRelation: 'stars'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'challenges_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'challenges_view'
            referencedColumns: ['author_id']
          },
          {
            foreignKeyName: 'challenges_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'challenges_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_completed_planets_view'
            referencedColumns: ['user_id']
          },
          {
            foreignKeyName: 'challenges_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_view'
            referencedColumns: ['id']
          },
        ]
      }
      challenges_categories: {
        Row: {
          category_id: string
          challenge_id: string
          id: string
        }
        Insert: {
          category_id: string
          challenge_id: string
          id?: string
        }
        Update: {
          category_id?: string
          challenge_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'challenges_categories_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'challenges_categories_challenge_id_fkey'
            columns: ['challenge_id']
            isOneToOne: false
            referencedRelation: 'challenges'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'challenges_categories_challenge_id_fkey'
            columns: ['challenge_id']
            isOneToOne: false
            referencedRelation: 'challenges_view'
            referencedColumns: ['id']
          },
        ]
      }
      challenges_comments: {
        Row: {
          challenge_id: string | null
          comment_id: string
          id: string
        }
        Insert: {
          challenge_id?: string | null
          comment_id: string
          id?: string
        }
        Update: {
          challenge_id?: string | null
          comment_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'challenge_comments_challenge_id_fkey'
            columns: ['challenge_id']
            isOneToOne: false
            referencedRelation: 'challenges'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'challenge_comments_challenge_id_fkey'
            columns: ['challenge_id']
            isOneToOne: false
            referencedRelation: 'challenges_view'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'challenge_comments_comment_id_fkey'
            columns: ['comment_id']
            isOneToOne: false
            referencedRelation: 'comments'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'challenge_comments_comment_id_fkey'
            columns: ['comment_id']
            isOneToOne: false
            referencedRelation: 'comments_view'
            referencedColumns: ['id']
          },
        ]
      }
      comments: {
        Row: {
          content: string
          created_at: string
          id: string
          parent_comment_id: string | null
          user_id: string
          count_comments_upvotes: number | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          user_id?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'comments_parent_comment_id_fkey'
            columns: ['parent_comment_id']
            isOneToOne: false
            referencedRelation: 'comments'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'comments_parent_comment_id_fkey'
            columns: ['parent_comment_id']
            isOneToOne: false
            referencedRelation: 'comments_view'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'comments_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'challenges_view'
            referencedColumns: ['author_id']
          },
          {
            foreignKeyName: 'comments_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'comments_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_completed_planets_view'
            referencedColumns: ['user_id']
          },
          {
            foreignKeyName: 'comments_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_view'
            referencedColumns: ['id']
          },
        ]
      }
      docs: {
        Row: {
          content: string | null
          id: string
          position: number
          title: string
        }
        Insert: {
          content?: string | null
          id?: string
          position: number
          title: string
        }
        Update: {
          content?: string | null
          id?: string
          position?: number
          title?: string
        }
        Relationships: []
      }
      planets: {
        Row: {
          icon: string
          id: string
          image: string
          is_available: boolean
          name: string
          position: number
        }
        Insert: {
          icon: string
          id?: string
          image: string
          is_available?: boolean
          name: string
          position: number
        }
        Update: {
          icon?: string
          id?: string
          image?: string
          is_available?: boolean
          name?: string
          position?: number
        }
        Relationships: []
      }
      questions: {
        Row: {
          content: Json
          id: string
          position: number
          star_id: string
        }
        Insert: {
          content: Json
          id?: string
          position: number
          star_id: string
        }
        Update: {
          content?: Json
          id?: string
          position?: number
          star_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'questions_star_id_fkey'
            columns: ['star_id']
            isOneToOne: false
            referencedRelation: 'next_star_from_next_planet'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'questions_star_id_fkey'
            columns: ['star_id']
            isOneToOne: false
            referencedRelation: 'stars'
            referencedColumns: ['id']
          },
        ]
      }
      ranking_users: {
        Row: {
          id: string
          position: number
          status: Database['public']['Enums']['ranking_status']
          tier_id: string
          xp: number
        }
        Insert: {
          id: string
          position: number
          status?: Database['public']['Enums']['ranking_status']
          tier_id: string
          xp?: number
        }
        Update: {
          id?: string
          position?: number
          status?: Database['public']['Enums']['ranking_status']
          tier_id?: string
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: 'winners_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'challenges_view'
            referencedColumns: ['author_id']
          },
          {
            foreignKeyName: 'winners_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'winners_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users_completed_planets_view'
            referencedColumns: ['user_id']
          },
          {
            foreignKeyName: 'winners_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users_view'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'winners_tier_id_fkey'
            columns: ['tier_id']
            isOneToOne: false
            referencedRelation: 'tiers'
            referencedColumns: ['id']
          },
        ]
      }
      rockets: {
        Row: {
          id: string
          image: string
          is_acquired_by_default: boolean
          is_selected_by_default: boolean
          name: string
          price: number
          slug: string
        }
        Insert: {
          id?: string
          image: string
          is_acquired_by_default?: boolean
          is_selected_by_default?: boolean
          name: string
          price: number
          slug: string
        }
        Update: {
          id?: string
          image?: string
          is_acquired_by_default?: boolean
          is_selected_by_default?: boolean
          name?: string
          price?: number
          slug?: string
        }
        Relationships: []
      }
      snippets: {
        Row: {
          code: string
          created_at: string
          id: string
          is_public: boolean
          title: string
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_public?: boolean
          title?: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_public?: boolean
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'snippets_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'challenges_view'
            referencedColumns: ['author_id']
          },
          {
            foreignKeyName: 'snippets_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'snippets_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_completed_planets_view'
            referencedColumns: ['user_id']
          },
          {
            foreignKeyName: 'snippets_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_view'
            referencedColumns: ['id']
          },
        ]
      }
      solutions: {
        Row: {
          challenge_id: string
          content: string
          created_at: string
          id: string
          slug: string
          title: string
          user_id: string
          views_count: number
        }
        Insert: {
          challenge_id: string
          content: string
          created_at?: string
          id?: string
          slug: string
          title: string
          user_id: string
          views_count: number
        }
        Update: {
          challenge_id?: string
          content?: string
          created_at?: string
          id?: string
          slug?: string
          title?: string
          user_id?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: 'public_solution_challenge_id_fkey'
            columns: ['challenge_id']
            isOneToOne: false
            referencedRelation: 'challenges'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_solution_challenge_id_fkey'
            columns: ['challenge_id']
            isOneToOne: false
            referencedRelation: 'challenges_view'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'solutions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'challenges_view'
            referencedColumns: ['author_id']
          },
          {
            foreignKeyName: 'solutions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'solutions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_completed_planets_view'
            referencedColumns: ['user_id']
          },
          {
            foreignKeyName: 'solutions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_view'
            referencedColumns: ['id']
          },
        ]
      }
      solutions_comments: {
        Row: {
          comment_id: string
          solution_id: string
        }
        Insert: {
          comment_id: string
          solution_id: string
        }
        Update: {
          comment_id?: string
          solution_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'solutions_comments_comment_id_fkey'
            columns: ['comment_id']
            isOneToOne: false
            referencedRelation: 'comments'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'solutions_comments_comment_id_fkey'
            columns: ['comment_id']
            isOneToOne: false
            referencedRelation: 'comments_view'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'solutions_comments_solution_id_fkey'
            columns: ['solution_id']
            isOneToOne: false
            referencedRelation: 'solutions'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'solutions_comments_solution_id_fkey'
            columns: ['solution_id']
            isOneToOne: false
            referencedRelation: 'solutions_view'
            referencedColumns: ['id']
          },
        ]
      }
      stars: {
        Row: {
          id: string
          is_available: boolean
          is_challenge: boolean
          name: string
          number: number
          planet_id: string
          questions: Json | null
          slug: string
          story: string | null
          texts: Json | null
        }
        Insert: {
          id?: string
          is_available?: boolean
          is_challenge?: boolean
          name: string
          number: number
          planet_id: string
          questions?: Json | null
          slug: string
          story?: string | null
          texts?: Json | null
        }
        Update: {
          id?: string
          is_available?: boolean
          is_challenge?: boolean
          name?: string
          number?: number
          planet_id?: string
          questions?: Json | null
          slug?: string
          story?: string | null
          texts?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: 'stars_planet_id_fkey'
            columns: ['planet_id']
            isOneToOne: false
            referencedRelation: 'planets'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'stars_planet_id_fkey'
            columns: ['planet_id']
            isOneToOne: false
            referencedRelation: 'planets_view'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'stars_planet_id_fkey'
            columns: ['planet_id']
            isOneToOne: false
            referencedRelation: 'users_completed_planets_view'
            referencedColumns: ['planet_id']
          },
        ]
      }
      tiers: {
        Row: {
          id: string
          image: string
          name: string
          position: number
          reward: number
        }
        Insert: {
          id?: string
          image: string
          name: string
          position?: number
          reward: number
        }
        Update: {
          id?: string
          image?: string
          name?: string
          position?: number
          reward?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_id: string | null
          can_see_ranking: boolean
          coins: number
          created_at: string
          did_break_streak: boolean
          did_complete_saturday: boolean
          email: string
          has_completed_space: boolean
          id: string
          is_loser: boolean | null
          last_week_ranking_position: number | null
          level: number
          name: string
          rocket_id: string | null
          slug: string
          streak: number
          study_time: string
          tier_id: string | null
          week_status: string[]
          weekly_xp: number
          xp: number
        }
        Insert: {
          avatar_id?: string | null
          can_see_ranking?: boolean
          coins?: number
          created_at?: string
          did_break_streak?: boolean
          did_complete_saturday?: boolean
          email: string
          has_completed_space?: boolean
          id: string
          is_loser?: boolean | null
          last_week_ranking_position?: number | null
          level?: number
          name: string
          rocket_id?: string | null
          slug: string
          streak?: number
          study_time?: string
          tier_id?: string | null
          week_status?: string[]
          weekly_xp?: number
          xp?: number
        }
        Update: {
          avatar_id?: string | null
          can_see_ranking?: boolean
          coins?: number
          created_at?: string
          did_break_streak?: boolean
          did_complete_saturday?: boolean
          email?: string
          has_completed_space?: boolean
          id?: string
          is_loser?: boolean | null
          last_week_ranking_position?: number | null
          level?: number
          name?: string
          rocket_id?: string | null
          slug?: string
          streak?: number
          study_time?: string
          tier_id?: string | null
          week_status?: string[]
          weekly_xp?: number
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: 'users_avatar_id_fkey'
            columns: ['avatar_id']
            isOneToOne: false
            referencedRelation: 'avatars'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'users_ranking_id_fkey'
            columns: ['tier_id']
            isOneToOne: false
            referencedRelation: 'tiers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'users_rocket_id_fkey'
            columns: ['rocket_id']
            isOneToOne: false
            referencedRelation: 'rockets'
            referencedColumns: ['id']
          },
        ]
      }
      users_acquired_avatars: {
        Row: {
          avatar_id: string
          id: string
          user_id: string
        }
        Insert: {
          avatar_id: string
          id?: string
          user_id: string
        }
        Update: {
          avatar_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'users_acquired_avatars_avatar_id_fkey'
            columns: ['avatar_id']
            isOneToOne: false
            referencedRelation: 'avatars'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'users_acquired_avatars_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'challenges_view'
            referencedColumns: ['author_id']
          },
          {
            foreignKeyName: 'users_acquired_avatars_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'users_acquired_avatars_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_completed_planets_view'
            referencedColumns: ['user_id']
          },
          {
            foreignKeyName: 'users_acquired_avatars_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_view'
            referencedColumns: ['id']
          },
        ]
      }
      users_acquired_rockets: {
        Row: {
          id: string
          rocket_id: string
          user_id: string
        }
        Insert: {
          id?: string
          rocket_id: string
          user_id: string
        }
        Update: {
          id?: string
          rocket_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'users_acquired_rockets_rocket_id_fkey'
            columns: ['rocket_id']
            isOneToOne: false
            referencedRelation: 'rockets'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'users_acquired_rockets_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'challenges_view'
            referencedColumns: ['author_id']
          },
          {
            foreignKeyName: 'users_acquired_rockets_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'users_acquired_rockets_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_completed_planets_view'
            referencedColumns: ['user_id']
          },
          {
            foreignKeyName: 'users_acquired_rockets_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_view'
            referencedColumns: ['id']
          },
        ]
      }
      users_challenge_votes: {
        Row: {
          challenge_id: string
          user_id: string
          vote: Database['public']['Enums']['challenge_vote']
        }
        Insert: {
          challenge_id: string
          user_id: string
          vote: Database['public']['Enums']['challenge_vote']
        }
        Update: {
          challenge_id?: string
          user_id?: string
          vote?: Database['public']['Enums']['challenge_vote']
        }
        Relationships: [
          {
            foreignKeyName: 'users_voted_challenges_challenge_id_fkey'
            columns: ['challenge_id']
            isOneToOne: false
            referencedRelation: 'challenges'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'users_voted_challenges_challenge_id_fkey'
            columns: ['challenge_id']
            isOneToOne: false
            referencedRelation: 'challenges_view'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'users_voted_challenges_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'challenges_view'
            referencedColumns: ['author_id']
          },
          {
            foreignKeyName: 'users_voted_challenges_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'users_voted_challenges_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_completed_planets_view'
            referencedColumns: ['user_id']
          },
          {
            foreignKeyName: 'users_voted_challenges_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_view'
            referencedColumns: ['id']
          },
        ]
      }
      users_completed_challenges: {
        Row: {
          challenge_id: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'users_completed_challenges_challenge_id_fkey'
            columns: ['challenge_id']
            isOneToOne: false
            referencedRelation: 'challenges'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'users_completed_challenges_challenge_id_fkey'
            columns: ['challenge_id']
            isOneToOne: false
            referencedRelation: 'challenges_view'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'users_completed_challenges_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'challenges_view'
            referencedColumns: ['author_id']
          },
          {
            foreignKeyName: 'users_completed_challenges_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'users_completed_challenges_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_completed_planets_view'
            referencedColumns: ['user_id']
          },
          {
            foreignKeyName: 'users_completed_challenges_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_view'
            referencedColumns: ['id']
          },
        ]
      }
      users_recently_unlocked_stars: {
        Row: {
          star_id: string
          user_id: string
        }
        Insert: {
          star_id: string
          user_id: string
        }
        Update: {
          star_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'users_recently_unlocked_stars_star_id_fkey'
            columns: ['star_id']
            isOneToOne: false
            referencedRelation: 'next_star_from_next_planet'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'users_recently_unlocked_stars_star_id_fkey'
            columns: ['star_id']
            isOneToOne: false
            referencedRelation: 'stars'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'users_recently_unlocked_stars_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'challenges_view'
            referencedColumns: ['author_id']
          },
          {
            foreignKeyName: 'users_recently_unlocked_stars_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'users_recently_unlocked_stars_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_completed_planets_view'
            referencedColumns: ['user_id']
          },
          {
            foreignKeyName: 'users_recently_unlocked_stars_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_view'
            referencedColumns: ['id']
          },
        ]
      }
      users_rescuable_achievements: {
        Row: {
          achievement_id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'users_rescuable_achievements_achievement_id_fkey'
            columns: ['achievement_id']
            isOneToOne: false
            referencedRelation: 'achievements'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'users_rescuable_achievements_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'challenges_view'
            referencedColumns: ['author_id']
          },
          {
            foreignKeyName: 'users_rescuable_achievements_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'users_rescuable_achievements_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_completed_planets_view'
            referencedColumns: ['user_id']
          },
          {
            foreignKeyName: 'users_rescuable_achievements_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_view'
            referencedColumns: ['id']
          },
        ]
      }
      users_unlocked_achievements: {
        Row: {
          achievement_id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'users_unlocked_achievements_achievement_id_fkey'
            columns: ['achievement_id']
            isOneToOne: false
            referencedRelation: 'achievements'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'users_unlocked_achievements_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'challenges_view'
            referencedColumns: ['author_id']
          },
          {
            foreignKeyName: 'users_unlocked_achievements_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'users_unlocked_achievements_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_completed_planets_view'
            referencedColumns: ['user_id']
          },
          {
            foreignKeyName: 'users_unlocked_achievements_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_view'
            referencedColumns: ['id']
          },
        ]
      }
      users_unlocked_stars: {
        Row: {
          id: string
          star_id: string
          user_id: string
        }
        Insert: {
          id?: string
          star_id: string
          user_id: string
        }
        Update: {
          id?: string
          star_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'users_unlocked_stars_star_id_fkey'
            columns: ['star_id']
            isOneToOne: false
            referencedRelation: 'next_star_from_next_planet'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'users_unlocked_stars_star_id_fkey'
            columns: ['star_id']
            isOneToOne: false
            referencedRelation: 'stars'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'users_unlocked_stars_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'challenges_view'
            referencedColumns: ['author_id']
          },
          {
            foreignKeyName: 'users_unlocked_stars_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'users_unlocked_stars_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_completed_planets_view'
            referencedColumns: ['user_id']
          },
          {
            foreignKeyName: 'users_unlocked_stars_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_view'
            referencedColumns: ['id']
          },
        ]
      }
      users_upvoted_comments: {
        Row: {
          comment_id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          user_id: string
        }
        Update: {
          comment_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'users_upvoted_comments_comment_id_fkey'
            columns: ['comment_id']
            isOneToOne: false
            referencedRelation: 'comments'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'users_upvoted_comments_comment_id_fkey'
            columns: ['comment_id']
            isOneToOne: false
            referencedRelation: 'comments_view'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'users_upvoted_comments_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'challenges_view'
            referencedColumns: ['author_id']
          },
          {
            foreignKeyName: 'users_upvoted_comments_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'users_upvoted_comments_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_completed_planets_view'
            referencedColumns: ['user_id']
          },
          {
            foreignKeyName: 'users_upvoted_comments_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_view'
            referencedColumns: ['id']
          },
        ]
      }
      users_upvoted_solutions: {
        Row: {
          solution_id: string
          user_id: string
        }
        Insert: {
          solution_id: string
          user_id: string
        }
        Update: {
          solution_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_upvoted_solutions_solution_id_fkey'
            columns: ['solution_id']
            isOneToOne: false
            referencedRelation: 'solutions'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_upvoted_solutions_solution_id_fkey'
            columns: ['solution_id']
            isOneToOne: false
            referencedRelation: 'solutions_view'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_upvoted_solutions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'challenges_view'
            referencedColumns: ['author_id']
          },
          {
            foreignKeyName: 'user_upvoted_solutions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_upvoted_solutions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_completed_planets_view'
            referencedColumns: ['user_id']
          },
          {
            foreignKeyName: 'user_upvoted_solutions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_view'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      challenges_view: {
        Row: {
          author_avatar_image: string | null
          author_avatar_name: string | null
          author_id: string | null
          author_name: string | null
          author_slug: string | null
          categories: Json[] | null
          code: string | null
          created_at: string | null
          description: string | null
          difficulty_level: string | null
          downvotes_count: number | null
          function_name: string | null
          id: string | null
          is_public: boolean | null
          slug: string | null
          star_id: string | null
          test_cases: Json | null
          texts: Json | null
          title: string | null
          total_completitions: number | null
          upvotes_count: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'challenges_star_id_fkey'
            columns: ['star_id']
            isOneToOne: false
            referencedRelation: 'next_star_from_next_planet'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'challenges_star_id_fkey'
            columns: ['star_id']
            isOneToOne: false
            referencedRelation: 'stars'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'challenges_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'challenges_view'
            referencedColumns: ['author_id']
          },
          {
            foreignKeyName: 'challenges_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'challenges_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_completed_planets_view'
            referencedColumns: ['user_id']
          },
          {
            foreignKeyName: 'challenges_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_view'
            referencedColumns: ['id']
          },
        ]
      }
      comments_view: {
        Row: {
          author_avatar_image: string | null
          author_avatar_name: string | null
          author_id: string | null
          author_name: string | null
          author_slug: string | null
          content: string | null
          created_at: string | null
          id: string | null
          parent_comment_id: string | null
          replies_count: number | null
          upvotes_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'comments_parent_comment_id_fkey'
            columns: ['parent_comment_id']
            isOneToOne: false
            referencedRelation: 'comments'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'comments_parent_comment_id_fkey'
            columns: ['parent_comment_id']
            isOneToOne: false
            referencedRelation: 'comments_view'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'comments_user_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'challenges_view'
            referencedColumns: ['author_id']
          },
          {
            foreignKeyName: 'comments_user_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'comments_user_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'users_completed_planets_view'
            referencedColumns: ['user_id']
          },
          {
            foreignKeyName: 'comments_user_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'users_view'
            referencedColumns: ['id']
          },
        ]
      }
      next_star_from_next_planet: {
        Row: {
          id: string | null
          is_unlocked: boolean | null
        }
        Relationships: []
      }
      planets_view: {
        Row: {
          completions_count: number | null
          icon: string | null
          id: string | null
          image: string | null
          name: string | null
          position: number | null
          is_available: boolean | null
        }
        Relationships: []
      }
      snippets_view: {
        Row: {
          author_avatar_image: string | null
          author_avatar_name: string | null
          author_id: string | null
          author_name: string | null
          author_slug: string | null
          code: string | null
          created_at: string | null
          id: string | null
          is_public: boolean | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'snippets_user_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'challenges_view'
            referencedColumns: ['author_id']
          },
          {
            foreignKeyName: 'snippets_user_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'snippets_user_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'users_completed_planets_view'
            referencedColumns: ['user_id']
          },
          {
            foreignKeyName: 'snippets_user_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'users_view'
            referencedColumns: ['id']
          },
        ]
      }
      solutions_view: {
        Row: {
          author_avatar_image: string | null
          author_avatar_name: string | null
          author_id: string | null
          author_name: string | null
          author_slug: string | null
          challenge_id: string | null
          comments_count: number | null
          content: string | null
          created_at: string | null
          id: string | null
          slug: string | null
          title: string | null
          upvotes_count: number | null
          views_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'public_solution_challenge_id_fkey'
            columns: ['challenge_id']
            isOneToOne: false
            referencedRelation: 'challenges'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_solution_challenge_id_fkey'
            columns: ['challenge_id']
            isOneToOne: false
            referencedRelation: 'challenges_view'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'solutions_user_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'challenges_view'
            referencedColumns: ['author_id']
          },
          {
            foreignKeyName: 'solutions_user_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'solutions_user_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'users_completed_planets_view'
            referencedColumns: ['user_id']
          },
          {
            foreignKeyName: 'solutions_user_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'users_view'
            referencedColumns: ['id']
          },
        ]
      }
      users_completed_planets_view: {
        Row: {
          planet_id: string | null
          user_id: string | null
        }
        Relationships: []
      }
      users_view: {
        Row: {
          acquired_avatars_ids: string[] | null
          acquired_rockets_ids: string[] | null
          avatar_id: string | null
          can_see_ranking: boolean | null
          coins: number | null
          completed_challenges_ids: string[] | null
          completed_planets_ids: string[] | null
          created_at: string | null
          did_break_streak: boolean | null
          did_complete_saturday: boolean | null
          email: string | null
          id: string | null
          is_loser: boolean | null
          last_week_ranking_position: number | null
          level: number | null
          name: string | null
          rescuable_achievements_ids: string[] | null
          rocket_id: string | null
          slug: string | null
          streak: number | null
          study_time: string | null
          tier_id: string | null
          unlocked_achievements_ids: string[] | null
          unlocked_stars_ids: string[] | null
          upvoted_comments_ids: string[] | null
          upvoted_solutions_ids: string[] | null
          week_status: string[] | null
          weekly_xp: number | null
          xp: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'users_avatar_id_fkey'
            columns: ['avatar_id']
            isOneToOne: false
            referencedRelation: 'avatars'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'users_ranking_id_fkey'
            columns: ['tier_id']
            isOneToOne: false
            referencedRelation: 'tiers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'users_rocket_id_fkey'
            columns: ['rocket_id']
            isOneToOne: false
            referencedRelation: 'rockets'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Functions: {
      count_comments_upvotes: {
        Args: { '': Database['public']['Tables']['comments']['Row'] }
        Returns: {
          error: true
        } & 'the function public.count_comments_upvotes with parameter or with a single unnamed json/jsonb parameter, but no matches were found in the schema cache'
      }
      delete_public_user: { Args: { userid: string }; Returns: undefined }
      delete_user: { Args: { userid: string }; Returns: undefined }
      deleteuser: { Args: { userid: string }; Returns: undefined }
      filter_challenges:
        | {
            Args: { difficulty: string; status: string; userid: string }
            Returns: Record<string, unknown>
          }
        | {
            Args: { difficulty: string; status: string; userid: string }
            Returns: undefined
          }
      get_next_star_from_next_planet: {
        Args: { _current_planet_id: string; _user_id: string }
        Returns: {
          id: string | null
          is_unlocked: boolean | null
        }[]
        SetofOptions: {
          from: '*'
          to: 'next_star_from_next_planet'
          isOneToOne: false
          isSetofReturn: true
        }
      }
      install_available_extensions_and_test: { Args: never; Returns: boolean }
      olamundo: { Args: never; Returns: string }
      resetstreak: { Args: never; Returns: undefined }
      slugify: { Args: { name: string }; Returns: string }
      teste: { Args: never; Returns: string }
      unaccent: { Args: { '': string }; Returns: string }
      update_last_week_ranking_positions: { Args: never; Returns: undefined }
      update_user_email: {
        Args: { new_email: string; user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      challenge_difficulty_level: 'easy' | 'medium' | 'hard'
      challenge_vote: 'upvote' | 'downvote'
      ranking_status: 'winner' | 'loser'
    }
    CompositeTypes: {
      challenges_record: {
        code: string | null
        created_at: string | null
        difficulty: string | null
        downvotes: number | null
        function_name: string | null
        id: string | null
        star_id: number | null
        test_cases: Json | null
        texts: Json | null
        title: string | null
        topic_id: string | null
        total_completions: number | null
        upvotes: number | null
        created_by: string | null
      }
    }
  }
  realtime: {
    Tables: {
      messages: {
        Row: {
          event: string | null
          extension: string
          id: string
          inserted_at: string
          payload: Json | null
          private: boolean | null
          topic: string
          updated_at: string
        }
        Insert: {
          event?: string | null
          extension: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic: string
          updated_at?: string
        }
        Update: {
          event?: string | null
          extension?: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages_2025_10_31: {
        Row: {
          event: string | null
          extension: string
          id: string
          inserted_at: string
          payload: Json | null
          private: boolean | null
          topic: string
          updated_at: string
        }
        Insert: {
          event?: string | null
          extension: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic: string
          updated_at?: string
        }
        Update: {
          event?: string | null
          extension?: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages_2025_11_01: {
        Row: {
          event: string | null
          extension: string
          id: string
          inserted_at: string
          payload: Json | null
          private: boolean | null
          topic: string
          updated_at: string
        }
        Insert: {
          event?: string | null
          extension: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic: string
          updated_at?: string
        }
        Update: {
          event?: string | null
          extension?: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages_2025_11_02: {
        Row: {
          event: string | null
          extension: string
          id: string
          inserted_at: string
          payload: Json | null
          private: boolean | null
          topic: string
          updated_at: string
        }
        Insert: {
          event?: string | null
          extension: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic: string
          updated_at?: string
        }
        Update: {
          event?: string | null
          extension?: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages_2025_11_03: {
        Row: {
          event: string | null
          extension: string
          id: string
          inserted_at: string
          payload: Json | null
          private: boolean | null
          topic: string
          updated_at: string
        }
        Insert: {
          event?: string | null
          extension: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic: string
          updated_at?: string
        }
        Update: {
          event?: string | null
          extension?: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages_2025_11_04: {
        Row: {
          event: string | null
          extension: string
          id: string
          inserted_at: string
          payload: Json | null
          private: boolean | null
          topic: string
          updated_at: string
        }
        Insert: {
          event?: string | null
          extension: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic: string
          updated_at?: string
        }
        Update: {
          event?: string | null
          extension?: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages_2025_11_05: {
        Row: {
          event: string | null
          extension: string
          id: string
          inserted_at: string
          payload: Json | null
          private: boolean | null
          topic: string
          updated_at: string
        }
        Insert: {
          event?: string | null
          extension: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic: string
          updated_at?: string
        }
        Update: {
          event?: string | null
          extension?: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      messages_2025_11_06: {
        Row: {
          event: string | null
          extension: string
          id: string
          inserted_at: string
          payload: Json | null
          private: boolean | null
          topic: string
          updated_at: string
        }
        Insert: {
          event?: string | null
          extension: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic: string
          updated_at?: string
        }
        Update: {
          event?: string | null
          extension?: string
          id?: string
          inserted_at?: string
          payload?: Json | null
          private?: boolean | null
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      schema_migrations: {
        Row: {
          inserted_at: string | null
          version: number
        }
        Insert: {
          inserted_at?: string | null
          version: number
        }
        Update: {
          inserted_at?: string | null
          version?: number
        }
        Relationships: []
      }
      subscription: {
        Row: {
          claims: Json
          claims_role: unknown
          created_at: string
          entity: unknown
          filters: Database['realtime']['CompositeTypes']['user_defined_filter'][]
          id: number
          subscription_id: string
        }
        Insert: {
          claims: Json
          claims_role?: unknown
          created_at?: string
          entity: unknown
          filters?: Database['realtime']['CompositeTypes']['user_defined_filter'][]
          id?: never
          subscription_id: string
        }
        Update: {
          claims?: Json
          claims_role?: unknown
          created_at?: string
          entity?: unknown
          filters?: Database['realtime']['CompositeTypes']['user_defined_filter'][]
          id?: never
          subscription_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_rls: {
        Args: { max_record_bytes?: number; wal: Json }
        Returns: Database['realtime']['CompositeTypes']['wal_rls'][]
        SetofOptions: {
          from: '*'
          to: 'wal_rls'
          isOneToOne: false
          isSetofReturn: true
        }
      }
      broadcast_changes: {
        Args: {
          event_name: string
          level?: string
          new: Record<string, unknown>
          old: Record<string, unknown>
          operation: string
          table_name: string
          table_schema: string
          topic_name: string
        }
        Returns: undefined
      }
      build_prepared_statement_sql: {
        Args: {
          columns: Database['realtime']['CompositeTypes']['wal_column'][]
          entity: unknown
          prepared_statement_name: string
        }
        Returns: string
      }
      cast: { Args: { type_: unknown; val: string }; Returns: Json }
      check_equality_op: {
        Args: {
          op: Database['realtime']['Enums']['equality_op']
          type_: unknown
          val_1: string
          val_2: string
        }
        Returns: boolean
      }
      is_visible_through_filters: {
        Args: {
          columns: Database['realtime']['CompositeTypes']['wal_column'][]
          filters: Database['realtime']['CompositeTypes']['user_defined_filter'][]
        }
        Returns: boolean
      }
      list_changes: {
        Args: {
          max_changes: number
          max_record_bytes: number
          publication: unknown
          slot_name: unknown
        }
        Returns: Database['realtime']['CompositeTypes']['wal_rls'][]
        SetofOptions: {
          from: '*'
          to: 'wal_rls'
          isOneToOne: false
          isSetofReturn: true
        }
      }
      quote_wal2json: { Args: { entity: unknown }; Returns: string }
      send: {
        Args: { event: string; payload: Json; private?: boolean; topic: string }
        Returns: undefined
      }
      to_regrole: { Args: { role_name: string }; Returns: unknown }
      topic: { Args: never; Returns: string }
    }
    Enums: {
      action: 'INSERT' | 'UPDATE' | 'DELETE' | 'TRUNCATE' | 'ERROR'
      equality_op: 'eq' | 'neq' | 'lt' | 'lte' | 'gt' | 'gte' | 'in'
    }
    CompositeTypes: {
      user_defined_filter: {
        column_name: string | null
        op: Database['realtime']['Enums']['equality_op'] | null
        value: string | null
      }
      wal_column: {
        name: string | null
        type_name: string | null
        type_oid: unknown
        value: Json | null
        is_pkey: boolean | null
        is_selectable: boolean | null
      }
      wal_rls: {
        wal: Json | null
        is_rls_enabled: boolean | null
        subscription_ids: string[] | null
        errors: string[] | null
      }
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          type: Database['storage']['Enums']['buckettype']
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database['storage']['Enums']['buckettype']
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database['storage']['Enums']['buckettype']
          updated_at?: string | null
        }
        Relationships: []
      }
      buckets_analytics: {
        Row: {
          created_at: string
          format: string
          id: string
          type: Database['storage']['Enums']['buckettype']
          updated_at: string
        }
        Insert: {
          created_at?: string
          format?: string
          id: string
          type?: Database['storage']['Enums']['buckettype']
          updated_at?: string
        }
        Update: {
          created_at?: string
          format?: string
          id?: string
          type?: Database['storage']['Enums']['buckettype']
          updated_at?: string
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          level: number | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          level?: number | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          level?: number | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'objects_bucketId_fkey'
            columns: ['bucket_id']
            isOneToOne: false
            referencedRelation: 'buckets'
            referencedColumns: ['id']
          },
        ]
      }
      prefixes: {
        Row: {
          bucket_id: string
          created_at: string | null
          level: number
          name: string
          updated_at: string | null
        }
        Insert: {
          bucket_id: string
          created_at?: string | null
          level?: number
          name: string
          updated_at?: string | null
        }
        Update: {
          bucket_id?: string
          created_at?: string | null
          level?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'prefixes_bucketId_fkey'
            columns: ['bucket_id']
            isOneToOne: false
            referencedRelation: 'buckets'
            referencedColumns: ['id']
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: 's3_multipart_uploads_bucket_id_fkey'
            columns: ['bucket_id']
            isOneToOne: false
            referencedRelation: 'buckets'
            referencedColumns: ['id']
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: 's3_multipart_uploads_parts_bucket_id_fkey'
            columns: ['bucket_id']
            isOneToOne: false
            referencedRelation: 'buckets'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 's3_multipart_uploads_parts_upload_id_fkey'
            columns: ['upload_id']
            isOneToOne: false
            referencedRelation: 's3_multipart_uploads'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_prefixes: {
        Args: { _bucket_id: string; _name: string }
        Returns: undefined
      }
      can_insert_object: {
        Args: { bucketid: string; metadata: Json; name: string; owner: string }
        Returns: undefined
      }
      delete_leaf_prefixes: {
        Args: { bucket_ids: string[]; names: string[] }
        Returns: undefined
      }
      delete_prefix: {
        Args: { _bucket_id: string; _name: string }
        Returns: boolean
      }
      extension: { Args: { name: string }; Returns: string }
      filename: { Args: { name: string }; Returns: string }
      foldername: { Args: { name: string }; Returns: string[] }
      get_level: { Args: { name: string }; Returns: number }
      get_prefix: { Args: { name: string }; Returns: string }
      get_prefixes: { Args: { name: string }; Returns: string[] }
      get_size_by_bucket: {
        Args: never
        Returns: {
          bucket_id: string
          size: number
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
          prefix_param: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_token?: string
          prefix_param: string
          start_after?: string
        }
        Returns: {
          id: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      lock_top_prefixes: {
        Args: { bucket_ids: string[]; names: string[] }
        Returns: undefined
      }
      operation: { Args: never; Returns: string }
      search: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_legacy_v1: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_v1_optimised: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_v2: {
        Args: {
          bucket_name: string
          levels?: number
          limits?: number
          prefix: string
          sort_column?: string
          sort_column_after?: string
          sort_order?: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
    }
    Enums: {
      buckettype: 'STANDARD' | 'ANALYTICS'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  auth: {
    Enums: {
      aal_level: ['aal1', 'aal2', 'aal3'],
      code_challenge_method: ['s256', 'plain'],
      factor_status: ['unverified', 'verified'],
      factor_type: ['totp', 'webauthn', 'phone'],
      oauth_authorization_status: ['pending', 'approved', 'denied', 'expired'],
      oauth_client_type: ['public', 'confidential'],
      oauth_registration_type: ['dynamic', 'manual'],
      oauth_response_type: ['code'],
      one_time_token_type: [
        'confirmation_token',
        'reauthentication_token',
        'recovery_token',
        'email_change_token_new',
        'email_change_token_current',
        'phone_change_token',
      ],
    },
  },
  cron: {
    Enums: {},
  },
  extensions: {
    Enums: {},
  },
  public: {
    Enums: {
      challenge_difficulty_level: ['easy', 'medium', 'hard'],
      challenge_vote: ['upvote', 'downvote'],
      ranking_status: ['winner', 'loser'],
    },
  },
  realtime: {
    Enums: {
      action: ['INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR'],
      equality_op: ['eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in'],
    },
  },
  storage: {
    Enums: {
    buckettype: ['STANDARD', 'ANALYTICS'],
    },
  },
} as const
