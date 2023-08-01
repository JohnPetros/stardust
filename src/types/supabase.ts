export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
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
          position: number | null
          required_amount: number | null
          reward: number
        }
        Insert: {
          description: string
          icon: string
          id?: string
          metric?: string
          name: string
          position?: number | null
          required_amount?: number | null
          reward?: number
        }
        Update: {
          description?: string
          icon?: string
          id?: string
          metric?: string
          name?: string
          position?: number | null
          required_amount?: number | null
          reward?: number
        }
        Relationships: []
      }
      avatars: {
        Row: {
          id: string
          image: string
          name: string
          price: number
        }
        Insert: {
          id?: string
          image: string
          name: string
          price: number
        }
        Update: {
          id?: string
          image?: string
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
          author: string | null
          code: string | null
          created_at: string | null
          difficulty: string | null
          downvotes: number | null
          function_name: string | null
          id: string
          star_id: string | null
          test_cases: Json | null
          texts: Json | null
          title: string | null
          topic_id: string | null
          total_completitions: number | null
          upvotes: number | null
        }
        Insert: {
          author?: string | null
          code?: string | null
          created_at?: string | null
          difficulty?: string | null
          downvotes?: number | null
          function_name?: string | null
          id?: string
          star_id?: string | null
          test_cases?: Json | null
          texts?: Json | null
          title?: string | null
          topic_id?: string | null
          total_completitions?: number | null
          upvotes?: number | null
        }
        Update: {
          author?: string | null
          code?: string | null
          created_at?: string | null
          difficulty?: string | null
          downvotes?: number | null
          function_name?: string | null
          id?: string
          star_id?: string | null
          test_cases?: Json | null
          texts?: Json | null
          title?: string | null
          topic_id?: string | null
          total_completitions?: number | null
          upvotes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "challenges_star_id_fkey"
            columns: ["star_id"]
            referencedRelation: "stars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_topic_id_fkey"
            columns: ["topic_id"]
            referencedRelation: "topics"
            referencedColumns: ["id"]
          }
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
            foreignKeyName: "challenges_categories_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "challenges_categories_challenge_id_fkey"
            columns: ["challenge_id"]
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          }
        ]
      }
      codes: {
        Row: {
          code: string | null
          created_at: string | null
          id: string
          title: string | null
          user_id: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          id?: string
          title?: string | null
          user_id?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          id?: string
          title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "codes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      comments: {
        Row: {
          author_id: string | null
          challenge_id: string | null
          content: Json | null
          created_at: string | null
          id: string
          likes: number | null
          parent_id: string | null
        }
        Insert: {
          author_id?: string | null
          challenge_id?: string | null
          content?: Json | null
          created_at?: string | null
          id?: string
          likes?: number | null
          parent_id?: string | null
        }
        Update: {
          author_id?: string | null
          challenge_id?: string | null
          content?: Json | null
          created_at?: string | null
          id?: string
          likes?: number | null
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_challenge_id_fkey"
            columns: ["challenge_id"]
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            referencedRelation: "comments"
            referencedColumns: ["id"]
          }
        ]
      }
      planets: {
        Row: {
          icon: string
          id: string
          image: string
          name: string
          position: number
        }
        Insert: {
          icon: string
          id?: string
          image: string
          name: string
          position: number
        }
        Update: {
          icon?: string
          id?: string
          image?: string
          name?: string
          position?: number
        }
        Relationships: []
      }
      rankings: {
        Row: {
          id: string
          image: string | null
          name: string | null
          position: number
          reward: number | null
        }
        Insert: {
          id?: string
          image?: string | null
          name?: string | null
          position?: number
          reward?: number | null
        }
        Update: {
          id?: string
          image?: string | null
          name?: string | null
          position?: number
          reward?: number | null
        }
        Relationships: []
      }
      rockets: {
        Row: {
          id: string
          image: string | null
          name: string | null
          price: number | null
        }
        Insert: {
          id?: string
          image?: string | null
          name?: string | null
          price?: number | null
        }
        Update: {
          id?: string
          image?: string | null
          name?: string | null
          price?: number | null
        }
        Relationships: []
      }
      stars: {
        Row: {
          id: string
          isChallenge: boolean | null
          name: string | null
          number: number | null
          planet_id: string | null
          questions: Json | null
          texts: Json | null
        }
        Insert: {
          id?: string
          isChallenge?: boolean | null
          name?: string | null
          number?: number | null
          planet_id?: string | null
          questions?: Json | null
          texts?: Json | null
        }
        Update: {
          id?: string
          isChallenge?: boolean | null
          name?: string | null
          number?: number | null
          planet_id?: string | null
          questions?: Json | null
          texts?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "stars_planet_id_fkey"
            columns: ["planet_id"]
            referencedRelation: "planets"
            referencedColumns: ["id"]
          }
        ]
      }
      topics: {
        Row: {
          id: string
          position: number | null
          texts: Json | null
          title: string | null
        }
        Insert: {
          id?: string
          position?: number | null
          texts?: Json | null
          title?: string | null
        }
        Update: {
          id?: string
          position?: number | null
          texts?: Json | null
          title?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          acquired_rockets: number
          avatar_id: string
          coins: number
          completed_challenges: number
          completed_planets: number
          created_at: string
          did_break_streak: boolean
          did_complete_saturday: boolean
          did_update_ranking: boolean
          email: string
          id: string
          is_admin: boolean
          is_loser: boolean | null
          last_position: number | null
          level: number
          name: string
          ranking_id: string
          rocket_id: string
          streak: number
          study_time: string
          unlocked_achievements: number
          unlocked_stars: number
          week_status: string[]
          weekly_xp: number
          xp: number
        }
        Insert: {
          acquired_rockets?: number
          avatar_id?: string
          coins?: number
          completed_challenges?: number
          completed_planets?: number
          created_at?: string
          did_break_streak?: boolean
          did_complete_saturday?: boolean
          did_update_ranking?: boolean
          email: string
          id: string
          is_admin?: boolean
          is_loser?: boolean | null
          last_position?: number | null
          level?: number
          name: string
          ranking_id?: string
          rocket_id?: string
          streak?: number
          study_time?: string
          unlocked_achievements?: number
          unlocked_stars?: number
          week_status?: string[]
          weekly_xp?: number
          xp?: number
        }
        Update: {
          acquired_rockets?: number
          avatar_id?: string
          coins?: number
          completed_challenges?: number
          completed_planets?: number
          created_at?: string
          did_break_streak?: boolean
          did_complete_saturday?: boolean
          did_update_ranking?: boolean
          email?: string
          id?: string
          is_admin?: boolean
          is_loser?: boolean | null
          last_position?: number | null
          level?: number
          name?: string
          ranking_id?: string
          rocket_id?: string
          streak?: number
          study_time?: string
          unlocked_achievements?: number
          unlocked_stars?: number
          week_status?: string[]
          weekly_xp?: number
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "users_avatar_id_fkey"
            columns: ["avatar_id"]
            referencedRelation: "avatars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_ranking_id_fkey"
            columns: ["ranking_id"]
            referencedRelation: "rankings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_rocket_id_fkey"
            columns: ["rocket_id"]
            referencedRelation: "rockets"
            referencedColumns: ["id"]
          }
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
            foreignKeyName: "users_acquired_avatars_avatar_id_fkey"
            columns: ["avatar_id"]
            referencedRelation: "avatars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_acquired_avatars_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
            foreignKeyName: "users_acquired_rockets_rocket_id_fkey"
            columns: ["rocket_id"]
            referencedRelation: "rockets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_acquired_rockets_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users_completed_challenges: {
        Row: {
          challenge_id: string
          id: string
          user_id: string
        }
        Insert: {
          challenge_id: string
          id?: string
          user_id: string
        }
        Update: {
          challenge_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_completed_challenges_challenge_id_fkey"
            columns: ["challenge_id"]
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_completed_challenges_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users_liked_comments: {
        Row: {
          comment_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          comment_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          comment_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_liked_comments_comment_id_fkey"
            columns: ["comment_id"]
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_liked_comments_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users_rescuable_achievements: {
        Row: {
          achievement_id: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_rescuable_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_rescuable_achievements_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users_unlocked_achievements: {
        Row: {
          achievement_id: string
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_unlocked_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_unlocked_achievements_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
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
            foreignKeyName: "users_unlocked_stars_star_id_fkey"
            columns: ["star_id"]
            referencedRelation: "stars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_unlocked_stars_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      users_unlocked_topics: {
        Row: {
          id: string
          topic_id: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          topic_id?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          topic_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_unlocked_topics_topic_id_fkey"
            columns: ["topic_id"]
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_unlocked_topics_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      winners: {
        Row: {
          avatar_id: string | null
          id: string
          name: string
          position: number | null
          ranking_id: string | null
          user_id: string | null
          xp: number | null
        }
        Insert: {
          avatar_id?: string | null
          id?: string
          name: string
          position?: number | null
          ranking_id?: string | null
          user_id?: string | null
          xp?: number | null
        }
        Update: {
          avatar_id?: string | null
          id?: string
          name?: string
          position?: number | null
          ranking_id?: string | null
          user_id?: string | null
          xp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "winners_avatar_id_fkey"
            columns: ["avatar_id"]
            referencedRelation: "avatars"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winners_ranking_id_fkey"
            columns: ["ranking_id"]
            referencedRelation: "rankings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winners_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_public_user: {
        Args: {
          userid: string
        }
        Returns: undefined
      }
      delete_user: {
        Args: {
          userid: string
        }
        Returns: undefined
      }
      deleteuser: {
        Args: {
          userid: string
        }
        Returns: undefined
      }
      filter_challenges:
        | {
            Args: {
              userid: string
              status: string
              difficulty: string
            }
            Returns: undefined
          }
        | {
            Args: {
              userid: string
              status: string
              difficulty: string
            }
            Returns: Record<string, unknown>
          }
      get_filtered_challenges: {
        Args: {
          userid: string
          status: string
          _difficulty: string
          categories_ids: string[]
          search: string
        }
        Returns: {
          author: string | null
          code: string | null
          created_at: string | null
          difficulty: string | null
          downvotes: number | null
          function_name: string | null
          id: string
          star_id: string | null
          test_cases: Json | null
          texts: Json | null
          title: string | null
          topic_id: string | null
          total_completitions: number | null
          upvotes: number | null
        }[]
      }
      install_available_extensions_and_test: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      olamundo: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      resetstreak: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      teste: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      update_user_email: {
        Args: {
          new_email: string
          user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
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
          public: boolean | null
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
          public?: boolean | null
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
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "buckets_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "objects_owner_fkey"
            columns: ["owner"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: unknown
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
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
}
