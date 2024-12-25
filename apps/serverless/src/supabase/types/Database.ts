export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          code: string
          created_at: string
          difficulty: string
          doc_id: string | null
          function_name: string | null
          id: string
          slug: string
          star_id: string | null
          test_cases: Json
          texts: Json | null
          title: string
          user_slug: string
        }
        Insert: {
          code: string
          created_at?: string
          difficulty?: string
          doc_id?: string | null
          function_name?: string | null
          id?: string
          slug: string
          star_id?: string | null
          test_cases: Json
          texts?: Json | null
          title?: string
          user_slug?: string
        }
        Update: {
          code?: string
          created_at?: string
          difficulty?: string
          doc_id?: string | null
          function_name?: string | null
          id?: string
          slug?: string
          star_id?: string | null
          test_cases?: Json
          texts?: Json | null
          title?: string
          user_slug?: string
        }
        Relationships: [
          {
            foreignKeyName: 'challenges_doc_id_fkey'
            columns: ['doc_id']
            isOneToOne: false
            referencedRelation: 'docs'
            referencedColumns: ['id']
          },
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
      comments: {
        Row: {
          challenge_id: string | null
          content: string
          created_at: string
          id: string
          parent_comment_id: string | null
          solution_id: string | null
          user_slug: string
          count_comments_upvotes: number | null
        }
        Insert: {
          challenge_id?: string | null
          content: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          solution_id?: string | null
          user_slug?: string
        }
        Update: {
          challenge_id?: string | null
          content?: string
          created_at?: string
          id?: string
          parent_comment_id?: string | null
          solution_id?: string | null
          user_slug?: string
        }
        Relationships: [
          {
            foreignKeyName: 'comments_challenge_id_fkey'
            columns: ['challenge_id']
            isOneToOne: false
            referencedRelation: 'challenges'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'comments_challenge_id_fkey'
            columns: ['challenge_id']
            isOneToOne: false
            referencedRelation: 'challenges_view'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'comments_parent_comment_id_fkey'
            columns: ['parent_comment_id']
            isOneToOne: false
            referencedRelation: 'comments'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_comments_solution_id_fkey'
            columns: ['solution_id']
            isOneToOne: false
            referencedRelation: 'solutions'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_comments_user_slug_fkey'
            columns: ['user_slug']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['slug']
          },
          {
            foreignKeyName: 'public_comments_user_slug_fkey'
            columns: ['user_slug']
            isOneToOne: false
            referencedRelation: 'users_view'
            referencedColumns: ['slug']
          },
        ]
      }
      docs: {
        Row: {
          content: string | null
          id: string
          position: number
          texts: Json | null
          title: string
        }
        Insert: {
          content?: string | null
          id?: string
          position: number
          texts?: Json | null
          title: string
        }
        Update: {
          content?: string | null
          id?: string
          position?: number
          texts?: Json | null
          title?: string
        }
        Relationships: []
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
      playgrounds: {
        Row: {
          code: string | null
          created_at: string | null
          id: string
          is_public: boolean
          title: string
          user_slug: string
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          id?: string
          is_public?: boolean
          title?: string
          user_slug: string
        }
        Update: {
          code?: string | null
          created_at?: string | null
          id?: string
          is_public?: boolean
          title?: string
          user_slug?: string
        }
        Relationships: [
          {
            foreignKeyName: 'playgrounds_user_slug_fkey'
            columns: ['user_slug']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['slug']
          },
          {
            foreignKeyName: 'playgrounds_user_slug_fkey'
            columns: ['user_slug']
            isOneToOne: false
            referencedRelation: 'users_view'
            referencedColumns: ['slug']
          },
        ]
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
            referencedRelation: 'users'
            referencedColumns: ['id']
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
          image: string | null
          name: string | null
          price: number | null
          slug: string | null
        }
        Insert: {
          id?: string
          image?: string | null
          name?: string | null
          price?: number | null
          slug?: string | null
        }
        Update: {
          id?: string
          image?: string | null
          name?: string | null
          price?: number | null
          slug?: string | null
        }
        Relationships: []
      }
      solutions: {
        Row: {
          challenge_id: string
          content: string
          created_at: string
          id: string
          slug: string
          title: string
          user_slug: string | null
        }
        Insert: {
          challenge_id?: string
          content: string
          created_at?: string
          id?: string
          slug: string
          title: string
          user_slug?: string | null
        }
        Update: {
          challenge_id?: string
          content?: string
          created_at?: string
          id?: string
          slug?: string
          title?: string
          user_slug?: string | null
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
            foreignKeyName: 'public_solutions_user_slug_fkey'
            columns: ['user_slug']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['slug']
          },
          {
            foreignKeyName: 'public_solutions_user_slug_fkey'
            columns: ['user_slug']
            isOneToOne: false
            referencedRelation: 'users_view'
            referencedColumns: ['slug']
          },
        ]
      }
      stars: {
        Row: {
          id: string
          is_challenge: boolean
          name: string
          number: number
          planet_id: string
          questions: Json | null
          slug: string
          texts: Json | null
        }
        Insert: {
          id?: string
          is_challenge?: boolean
          name: string
          number: number
          planet_id: string
          questions?: Json | null
          slug: string
          texts?: Json | null
        }
        Update: {
          id?: string
          is_challenge?: boolean
          name?: string
          number?: number
          planet_id?: string
          questions?: Json | null
          slug?: string
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
            referencedRelation: 'users'
            referencedColumns: ['id']
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
            referencedRelation: 'users'
            referencedColumns: ['id']
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
            referencedRelation: 'users'
            referencedColumns: ['id']
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
            referencedRelation: 'users'
            referencedColumns: ['id']
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
            referencedRelation: 'users'
            referencedColumns: ['id']
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
      users_unlocked_docs: {
        Row: {
          doc_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          doc_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          doc_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'users_unlocked_docs_doc_id_fkey'
            columns: ['doc_id']
            isOneToOne: false
            referencedRelation: 'docs'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'users_unlocked_docs_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'users_unlocked_docs_user_id_fkey'
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
            referencedRelation: 'users'
            referencedColumns: ['id']
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
            foreignKeyName: 'users_upvoted_comments_comment_id_fkey'
            columns: ['comment_id']
            isOneToOne: false
            referencedRelation: 'comments'
            referencedColumns: ['id']
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
            foreignKeyName: 'public_users_upvoted_solutions_solution_id_fkey'
            columns: ['solution_id']
            isOneToOne: false
            referencedRelation: 'solutions'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_users_upvoted_solutions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'public_users_upvoted_solutions_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users_view'
            referencedColumns: ['id']
          },
        ]
      }
      users_voted_challenges: {
        Row: {
          challenge_id: string
          id: string
          user_id: string | null
          vote: string
        }
        Insert: {
          challenge_id: string
          id?: string
          user_id?: string | null
          vote: string
        }
        Update: {
          challenge_id?: string
          id?: string
          user_id?: string | null
          vote?: string
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
            referencedRelation: 'users'
            referencedColumns: ['id']
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
    }
    Views: {
      challenges_view: {
        Row: {
          code: string | null
          created_at: string | null
          difficulty: string | null
          doc_id: string | null
          downvotes: number | null
          function_name: string | null
          id: string | null
          slug: string | null
          star_id: string | null
          test_cases: Json | null
          texts: Json | null
          title: string | null
          total_completitions: number | null
          upvotes: number | null
          user_slug: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'challenges_doc_id_fkey'
            columns: ['doc_id']
            isOneToOne: false
            referencedRelation: 'docs'
            referencedColumns: ['id']
          },
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
        ]
      }
      next_star_from_next_planet: {
        Row: {
          id: string | null
          is_unlocked: boolean | null
        }
        Relationships: []
      }
      users_view: {
        Row: {
          acquired_rockets_count: number | null
          avatar_id: string | null
          coins: number | null
          completed_challenges_count: number | null
          completed_planets_count: number | null
          created_at: string | null
          did_break_streak: boolean | null
          did_complete_saturday: boolean | null
          did_update_ranking: boolean | null
          email: string | null
          id: string | null
          is_loser: boolean | null
          last_position: number | null
          level: number | null
          name: string | null
          ranking_id: string | null
          rocket_id: string | null
          slug: string | null
          streak: number | null
          study_time: string | null
          unlocked_achievements_count: number | null
          unlocked_stars_count: number | null
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
            columns: ['ranking_id']
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
        Args: {
          '': unknown
        }
        Returns: number
      }
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
            Returns: Record<string, unknown>
          }
        | {
            Args: {
              userid: string
              status: string
              difficulty: string
            }
            Returns: undefined
          }
      get_filtered_challenges: {
        Args: {
          _userid: string
          _status: string
          _difficulty: string
          _categories_ids: string[]
          _search: string
        }
        Returns: {
          code: string | null
          created_at: string | null
          difficulty: string | null
          doc_id: string | null
          downvotes: number | null
          function_name: string | null
          id: string | null
          slug: string | null
          star_id: string | null
          test_cases: Json | null
          texts: Json | null
          title: string | null
          total_completitions: number | null
          upvotes: number | null
          user_slug: string | null
        }[]
      }
      get_next_star_from_next_planet: {
        Args: {
          _current_planet_id: string
          _user_id: string
        }
        Returns: {
          id: string | null
          is_unlocked: boolean | null
        }[]
      }
      get_user_by_id: {
        Args: {
          _user_id: string
        }
        Returns: {
          acquired_rockets_count: number | null
          avatar_id: string | null
          coins: number | null
          completed_challenges_count: number | null
          completed_planets_count: number | null
          created_at: string | null
          did_break_streak: boolean | null
          did_complete_saturday: boolean | null
          did_update_ranking: boolean | null
          email: string | null
          id: string | null
          is_loser: boolean | null
          last_position: number | null
          level: number | null
          name: string | null
          ranking_id: string | null
          rocket_id: string | null
          slug: string | null
          streak: number | null
          study_time: string | null
          unlocked_achievements_count: number | null
          unlocked_stars_count: number | null
          week_status: string[] | null
          weekly_xp: number | null
          xp: number | null
        }[]
      }
      get_user_by_slug: {
        Args: {
          _user_slug: string
        }
        Returns: {
          acquired_rockets_count: number | null
          avatar_id: string | null
          coins: number | null
          completed_challenges_count: number | null
          completed_planets_count: number | null
          created_at: string | null
          did_break_streak: boolean | null
          did_complete_saturday: boolean | null
          did_update_ranking: boolean | null
          email: string | null
          id: string | null
          is_loser: boolean | null
          last_position: number | null
          level: number | null
          name: string | null
          ranking_id: string | null
          rocket_id: string | null
          slug: string | null
          streak: number | null
          study_time: string | null
          unlocked_achievements_count: number | null
          unlocked_stars_count: number | null
          week_status: string[] | null
          weekly_xp: number | null
          xp: number | null
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
      slugify: {
        Args: {
          name: string
        }
        Returns: string
      }
      teste: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      unaccent: {
        Args: {
          '': string
        }
        Returns: string
      }
      unaccent_init: {
        Args: {
          '': unknown
        }
        Returns: unknown
      }
      update_last_week_ranking_positions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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
}

type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema['CompositeTypes']
    ? PublicSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never
