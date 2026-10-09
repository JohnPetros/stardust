-- Apply under the migration runner transaction and dedicated advisory-lock session.
-- Only captured application objects are changed; infrastructure grants remain intact.
-- Global function defaults must be revoked globally, before schema-specific defaults.

REVOKE ALL PRIVILEGES ON TABLE "public"."achievements" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."api_keys" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."avatars" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."categories" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."challenge_code_executions" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."challenge_sources" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."challenges" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."challenges_categories" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."challenges_comments" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."chat_messages" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."chats" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."comments" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."feedback_message_attachments" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."feedback_messages" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."feedback_reports" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."guides" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."insignias" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."notes" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."planets" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."questions" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."ranking_users" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."rockets" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."snippets" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."solutions" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."solutions_comments" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."stars" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."tiers" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."users" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."users_acquired_avatars" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."users_acquired_insignias" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."users_acquired_rockets" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."users_challenge_votes" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."users_completed_challenges" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."users_recently_unlocked_stars" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."users_rescuable_achievements" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."users_unlocked_achievements" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."users_unlocked_stars" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."users_upvoted_comments" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."users_upvoted_solutions" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."challenges_view" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."comments_view" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."planets_view" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."snippets_view" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."solutions_view" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."users_completed_planets_view" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON TABLE "public"."users_view" FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."change_feedback_report_status"(p_request jsonb) FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."clear_text_block_audio"(p_star_id uuid, p_block_index integer) FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."count_comments_upvotes"(comments) FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."count_planet_completions"(planet_row planets) FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."count_star_unlocks"(star_row stars) FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."count_unread_user_feedback_reports"(p_author_id character varying) FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."count_user_completed_challenges"(user_row users) FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."count_user_unlocked_achievements"(user_row users) FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."count_user_unlocked_stars"(user_row users) FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."count_users_at_planet"(planet_row planets) FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."count_users_at_star"(star_row stars) FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."delete_inactive_users"() FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."delete_public_user"(userid character varying) FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."deleteuser"(userid uuid) FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."filter_challenges"(userid text, status text, difficulty text) FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."filter_challenges"(userid uuid, status text, difficulty text) FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."get_last_user_unlocked_star_id"(user_row users) FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."insert_initial_data"() FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."insert_user_initial_data"() FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."insertchallengestopics"() FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."install_available_extensions_and_test"() FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."list_challenges"(p_title text, p_difficulty text, p_categories_ids uuid[], p_completion_status text, p_completed_challenges_ids uuid[], p_account_id text, p_user_id text, p_should_include_star_challenges boolean, p_should_include_private_challenges boolean, p_should_include_only_author boolean, p_is_new_status text, p_page integer, p_items_per_page integer, p_upvotes_count_order text, p_downvote_count_order text, p_completion_count_order text, p_posting_order text) FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."list_feedback_reports"(p_search text, p_intent feedback_intent, p_status text, p_created_at_start timestamp with time zone, p_created_at_end timestamp with time zone, p_page integer, p_items_per_page integer) FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."list_user_feedback_reports"(p_author_id character varying, p_status text, p_page integer, p_items_per_page integer) FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."mark_user_feedback_report_read"(p_report_id uuid, p_author_id character varying, p_last_seen_admin_message_at timestamp with time zone) FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."olamundo"() FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."resetstreak"() FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."setwinners"() FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."slugify"(name text) FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."slugify_entities_name"() FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."teste"() FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."testranking"() FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."update_last_week_ranking_positions"() FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."update_text_block_audio"(p_star_id uuid, p_block_index integer, p_audio jsonb) FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."update_user_email"(new_email text, user_id uuid) FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."updateranking"() FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."updateranking_"() FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."updateuserspositions"() FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."updatewinners"() FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
REVOKE ALL PRIVILEGES ON ROUTINE "public"."verify_user_space_completion"(user_row users) FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
DROP POLICY "enable achivements" ON "public"."achievements";
--> statement-breakpoint
DROP POLICY "Only authenticated users can access avatars" ON "public"."avatars";
--> statement-breakpoint
DROP POLICY "Only authenticated users can access categories" ON "public"."categories";
--> statement-breakpoint
DROP POLICY "Users can insert own challenge code executions" ON "public"."challenge_code_executions";
--> statement-breakpoint
DROP POLICY "Users can select own challenge code executions" ON "public"."challenge_code_executions";
--> statement-breakpoint
DROP POLICY "Only authenticated users can access challenges" ON "public"."challenges";
--> statement-breakpoint
DROP POLICY "Only authenticated users can access challenges categories" ON "public"."challenges_categories";
--> statement-breakpoint
DROP POLICY "authenticated" ON "public"."challenges_comments";
--> statement-breakpoint
DROP POLICY "Only authenticated users can access codes" ON "public"."comments";
--> statement-breakpoint
DROP POLICY "feedback_message_attachments_author_insert" ON "public"."feedback_message_attachments";
--> statement-breakpoint
DROP POLICY "feedback_message_attachments_author_select" ON "public"."feedback_message_attachments";
--> statement-breakpoint
DROP POLICY "feedback_message_attachments_author_update" ON "public"."feedback_message_attachments";
--> statement-breakpoint
DROP POLICY "feedback_messages_author_insert" ON "public"."feedback_messages";
--> statement-breakpoint
DROP POLICY "feedback_messages_author_select" ON "public"."feedback_messages";
--> statement-breakpoint
DROP POLICY "feedback_messages_author_update" ON "public"."feedback_messages";
--> statement-breakpoint
DROP POLICY "feedback_reports_author_insert" ON "public"."feedback_reports";
--> statement-breakpoint
DROP POLICY "feedback_reports_author_select" ON "public"."feedback_reports";
--> statement-breakpoint
DROP POLICY "feedback_reports_author_update" ON "public"."feedback_reports";
--> statement-breakpoint
DROP POLICY "Only authenticated users can access dictionary topics" ON "public"."guides";
--> statement-breakpoint
DROP POLICY "Only authenticated users can access planets" ON "public"."planets";
--> statement-breakpoint
DROP POLICY "Only authenticated users can access questions" ON "public"."questions";
--> statement-breakpoint
DROP POLICY "Only authenticated users can access rockets" ON "public"."rockets";
--> statement-breakpoint
DROP POLICY "Only authenticated users can access playgrounds" ON "public"."snippets";
--> statement-breakpoint
DROP POLICY "Authorization" ON "public"."solutions";
--> statement-breakpoint
DROP POLICY "Only authenticated users can access stars" ON "public"."stars";
--> statement-breakpoint
DROP POLICY "Only authenticated users can access rankings" ON "public"."tiers";
--> statement-breakpoint
DROP POLICY "Enable read access for all users" ON "storage"."objects";
--> statement-breakpoint
DROP POLICY "Give users access to own folder 1ffg0oo_1" ON "storage"."objects";
--> statement-breakpoint
DROP POLICY "Give users access to own folder 1ffg0oo_2" ON "storage"."objects";
--> statement-breakpoint
ALTER TABLE "public"."achievements" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."achievements" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."api_keys" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."api_keys" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."avatars" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."avatars" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."categories" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."categories" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."challenge_code_executions" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."challenge_code_executions" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."challenge_sources" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."challenge_sources" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."challenges" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."challenges" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."challenges_categories" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."challenges_categories" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."challenges_comments" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."challenges_comments" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."chat_messages" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."chat_messages" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."chats" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."chats" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."comments" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."comments" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."feedback_message_attachments" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."feedback_message_attachments" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."feedback_messages" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."feedback_messages" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."feedback_reports" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."feedback_reports" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."guides" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."guides" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."insignias" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."insignias" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."notes" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."notes" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."planets" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."planets" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."questions" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."questions" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."ranking_users" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."ranking_users" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."rockets" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."rockets" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."snippets" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."snippets" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."solutions" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."solutions" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."solutions_comments" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."solutions_comments" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."stars" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."stars" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."tiers" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."tiers" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."users" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."users" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."users_acquired_avatars" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."users_acquired_avatars" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."users_acquired_insignias" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."users_acquired_insignias" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."users_acquired_rockets" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."users_acquired_rockets" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."users_challenge_votes" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."users_challenge_votes" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."users_completed_challenges" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."users_completed_challenges" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."users_recently_unlocked_stars" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."users_recently_unlocked_stars" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."users_rescuable_achievements" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."users_rescuable_achievements" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."users_unlocked_achievements" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."users_unlocked_achievements" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."users_unlocked_stars" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."users_unlocked_stars" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."users_upvoted_comments" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."users_upvoted_comments" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."users_upvoted_solutions" DISABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."users_upvoted_solutions" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" REVOKE ALL PRIVILEGES ON TABLES FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" REVOKE ALL PRIVILEGES ON SEQUENCES FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" REVOKE ALL PRIVILEGES ON FUNCTIONS FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" GRANT EXECUTE ON FUNCTIONS TO "postgres";
--> statement-breakpoint
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL PRIVILEGES ON TABLES FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL PRIVILEGES ON SEQUENCES FROM PUBLIC, "anon", "authenticated";
--> statement-breakpoint
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" REVOKE ALL PRIVILEGES ON FUNCTIONS FROM PUBLIC, "anon", "authenticated";
