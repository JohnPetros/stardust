-- Restore captured legacy access under the same transaction and advisory lock as ledger removal.
-- Restoring implicit global PUBLIC EXECUTE removes the owner-only default ACL row.

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" GRANT EXECUTE ON FUNCTIONS TO PUBLIC;
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
ALTER TABLE "public"."challenge_code_executions" ENABLE ROW LEVEL SECURITY;
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
ALTER TABLE "public"."feedback_message_attachments" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."feedback_message_attachments" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."feedback_messages" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."feedback_messages" NO FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "public"."feedback_reports" ENABLE ROW LEVEL SECURITY;
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
ALTER TABLE "public"."questions" ENABLE ROW LEVEL SECURITY;
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
CREATE POLICY "enable achivements" ON "public"."achievements" AS PERMISSIVE FOR ALL TO PUBLIC USING (true);
--> statement-breakpoint
CREATE POLICY "Only authenticated users can access avatars" ON "public"."avatars" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);
--> statement-breakpoint
CREATE POLICY "Only authenticated users can access categories" ON "public"."categories" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);
--> statement-breakpoint
CREATE POLICY "Users can insert own challenge code executions" ON "public"."challenge_code_executions" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (((auth.uid())::text = user_id));
--> statement-breakpoint
CREATE POLICY "Users can select own challenge code executions" ON "public"."challenge_code_executions" AS PERMISSIVE FOR SELECT TO "authenticated" USING (((auth.uid())::text = user_id));
--> statement-breakpoint
CREATE POLICY "Only authenticated users can access challenges" ON "public"."challenges" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);
--> statement-breakpoint
CREATE POLICY "Only authenticated users can access challenges categories" ON "public"."challenges_categories" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);
--> statement-breakpoint
CREATE POLICY "authenticated" ON "public"."challenges_comments" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);
--> statement-breakpoint
CREATE POLICY "Only authenticated users can access codes" ON "public"."comments" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);
--> statement-breakpoint
CREATE POLICY "feedback_message_attachments_author_insert" ON "public"."feedback_message_attachments" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK ((EXISTS ( SELECT 1
   FROM (feedback_messages m
     JOIN feedback_reports r ON ((r.id = m.report_id)))
  WHERE ((m.id = feedback_message_attachments.message_id) AND (m.author_role = 'user'::text) AND ((m.author_id)::text = (auth.uid())::text) AND ((auth.uid())::text = (r.user_id)::text)))));
--> statement-breakpoint
CREATE POLICY "feedback_message_attachments_author_select" ON "public"."feedback_message_attachments" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM (feedback_messages m
     JOIN feedback_reports r ON ((r.id = m.report_id)))
  WHERE ((m.id = feedback_message_attachments.message_id) AND ((auth.uid())::text = (r.user_id)::text)))));
--> statement-breakpoint
CREATE POLICY "feedback_message_attachments_author_update" ON "public"."feedback_message_attachments" AS PERMISSIVE FOR UPDATE TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM (feedback_messages m
     JOIN feedback_reports r ON ((r.id = m.report_id)))
  WHERE ((m.id = feedback_message_attachments.message_id) AND (m.author_role = 'user'::text) AND ((m.author_id)::text = (auth.uid())::text) AND ((auth.uid())::text = (r.user_id)::text))))) WITH CHECK ((EXISTS ( SELECT 1
   FROM (feedback_messages m
     JOIN feedback_reports r ON ((r.id = m.report_id)))
  WHERE ((m.id = feedback_message_attachments.message_id) AND (m.author_role = 'user'::text) AND ((m.author_id)::text = (auth.uid())::text) AND ((auth.uid())::text = (r.user_id)::text)))));
--> statement-breakpoint
CREATE POLICY "feedback_messages_author_insert" ON "public"."feedback_messages" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (((author_role = 'user'::text) AND ((author_id)::text = (auth.uid())::text) AND (EXISTS ( SELECT 1
   FROM feedback_reports r
  WHERE ((r.id = feedback_messages.report_id) AND ((auth.uid())::text = (r.user_id)::text))))));
--> statement-breakpoint
CREATE POLICY "feedback_messages_author_select" ON "public"."feedback_messages" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((EXISTS ( SELECT 1
   FROM feedback_reports r
  WHERE ((r.id = feedback_messages.report_id) AND ((auth.uid())::text = (r.user_id)::text)))));
--> statement-breakpoint
CREATE POLICY "feedback_messages_author_update" ON "public"."feedback_messages" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (((author_role = 'user'::text) AND ((author_id)::text = (auth.uid())::text) AND (EXISTS ( SELECT 1
   FROM feedback_reports r
  WHERE ((r.id = feedback_messages.report_id) AND ((auth.uid())::text = (r.user_id)::text)))))) WITH CHECK (((author_role = 'user'::text) AND ((author_id)::text = (auth.uid())::text) AND (EXISTS ( SELECT 1
   FROM feedback_reports r
  WHERE ((r.id = feedback_messages.report_id) AND ((auth.uid())::text = (r.user_id)::text))))));
--> statement-breakpoint
CREATE POLICY "feedback_reports_author_insert" ON "public"."feedback_reports" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (((auth.uid())::text = (user_id)::text));
--> statement-breakpoint
CREATE POLICY "feedback_reports_author_select" ON "public"."feedback_reports" AS PERMISSIVE FOR SELECT TO "authenticated" USING (((auth.uid())::text = (user_id)::text));
--> statement-breakpoint
CREATE POLICY "feedback_reports_author_update" ON "public"."feedback_reports" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (((auth.uid())::text = (user_id)::text)) WITH CHECK (((auth.uid())::text = (user_id)::text));
--> statement-breakpoint
CREATE POLICY "Only authenticated users can access dictionary topics" ON "public"."guides" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);
--> statement-breakpoint
CREATE POLICY "Only authenticated users can access planets" ON "public"."planets" AS PERMISSIVE FOR ALL TO PUBLIC USING (true) WITH CHECK (true);
--> statement-breakpoint
CREATE POLICY "Only authenticated users can access questions" ON "public"."questions" AS PERMISSIVE FOR SELECT TO "authenticated" USING (true);
--> statement-breakpoint
CREATE POLICY "Only authenticated users can access rockets" ON "public"."rockets" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);
--> statement-breakpoint
CREATE POLICY "Only authenticated users can access playgrounds" ON "public"."snippets" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);
--> statement-breakpoint
CREATE POLICY "Authorization" ON "public"."solutions" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);
--> statement-breakpoint
CREATE POLICY "Only authenticated users can access stars" ON "public"."stars" AS PERMISSIVE FOR SELECT TO PUBLIC USING (true);
--> statement-breakpoint
CREATE POLICY "Only authenticated users can access rankings" ON "public"."tiers" AS PERMISSIVE FOR ALL TO "authenticated" USING (true) WITH CHECK (true);
--> statement-breakpoint
CREATE POLICY "Enable read access for all users" ON "storage"."objects" AS PERMISSIVE FOR SELECT TO PUBLIC USING (true);
--> statement-breakpoint
CREATE POLICY "Give users access to own folder 1ffg0oo_1" ON "storage"."objects" AS PERMISSIVE FOR INSERT TO PUBLIC WITH CHECK (true);
--> statement-breakpoint
CREATE POLICY "Give users access to own folder 1ffg0oo_2" ON "storage"."objects" AS PERMISSIVE FOR DELETE TO PUBLIC USING (true);
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."achievements" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."achievements" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."achievements" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."achievements" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."achievements" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."achievements" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."achievements" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."achievements" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."achievements" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."achievements" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."achievements" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."achievements" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."achievements" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."achievements" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."api_keys" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."api_keys" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."api_keys" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."api_keys" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."api_keys" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."api_keys" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."api_keys" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."api_keys" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."api_keys" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."api_keys" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."api_keys" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."api_keys" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."api_keys" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."api_keys" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."avatars" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."avatars" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."avatars" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."avatars" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."avatars" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."avatars" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."avatars" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."avatars" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."avatars" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."avatars" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."avatars" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."avatars" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."avatars" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."avatars" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."categories" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."categories" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."categories" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."categories" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."categories" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."categories" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."categories" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."categories" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."categories" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."categories" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."categories" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."categories" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."categories" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."categories" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."challenge_code_executions" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."challenge_code_executions" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."challenge_code_executions" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."challenge_code_executions" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."challenge_code_executions" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."challenge_code_executions" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."challenge_code_executions" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."challenge_sources" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."challenge_sources" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."challenge_sources" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."challenge_sources" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."challenge_sources" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."challenge_sources" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."challenge_sources" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."challenge_sources" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."challenge_sources" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."challenge_sources" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."challenge_sources" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."challenge_sources" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."challenge_sources" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."challenge_sources" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."challenges" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."challenges" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."challenges" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."challenges" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."challenges" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."challenges" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."challenges" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."challenges" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."challenges" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."challenges" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."challenges" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."challenges" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."challenges" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."challenges" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."challenges_categories" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."challenges_categories" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."challenges_categories" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."challenges_categories" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."challenges_categories" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."challenges_categories" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."challenges_categories" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."challenges_categories" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."challenges_categories" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."challenges_categories" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."challenges_categories" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."challenges_categories" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."challenges_categories" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."challenges_categories" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."challenges_comments" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."challenges_comments" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."challenges_comments" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."challenges_comments" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."challenges_comments" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."challenges_comments" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."challenges_comments" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."challenges_comments" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."challenges_comments" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."challenges_comments" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."challenges_comments" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."challenges_comments" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."challenges_comments" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."challenges_comments" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."challenges_view" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."challenges_view" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."chat_messages" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."chat_messages" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."chat_messages" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."chat_messages" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."chat_messages" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."chat_messages" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."chat_messages" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."chat_messages" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."chat_messages" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."chat_messages" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."chat_messages" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."chat_messages" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."chat_messages" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."chat_messages" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."chats" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."chats" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."chats" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."chats" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."chats" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."chats" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."chats" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."chats" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."chats" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."chats" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."chats" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."chats" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."chats" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."chats" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."comments" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."comments" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."comments" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."comments" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."comments" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."comments" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."comments" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."comments" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."comments" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."comments" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."comments" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."comments" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."comments" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."comments" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."comments_view" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."comments_view" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."feedback_message_attachments" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."feedback_message_attachments" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."feedback_message_attachments" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."feedback_message_attachments" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."feedback_message_attachments" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."feedback_message_attachments" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."feedback_messages" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."feedback_messages" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."feedback_messages" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."feedback_messages" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."feedback_messages" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."feedback_messages" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."feedback_reports" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."feedback_reports" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."feedback_reports" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."feedback_reports" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."feedback_reports" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."feedback_reports" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."feedback_reports" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."feedback_reports" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."feedback_reports" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."feedback_reports" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."feedback_reports" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."feedback_reports" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."feedback_reports" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."feedback_reports" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."guides" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."guides" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."guides" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."guides" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."guides" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."guides" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."guides" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."guides" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."guides" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."guides" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."guides" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."guides" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."guides" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."guides" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."insignias" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."insignias" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."insignias" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."insignias" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."insignias" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."insignias" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."insignias" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."insignias" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."insignias" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."insignias" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."insignias" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."insignias" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."insignias" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."insignias" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."notes" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."notes" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."notes" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."notes" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."planets" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."planets" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."planets" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."planets" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."planets" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."planets" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."planets" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."planets" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."planets" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."planets" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."planets" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."planets" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."planets" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."planets" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."questions" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."questions" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."questions" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."questions" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."questions" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."questions" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."questions" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."questions" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."questions" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."questions" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."questions" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."questions" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."questions" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."questions" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."ranking_users" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."ranking_users" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."ranking_users" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."ranking_users" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."ranking_users" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."ranking_users" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."ranking_users" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."ranking_users" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."ranking_users" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."ranking_users" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."ranking_users" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."ranking_users" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."ranking_users" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."ranking_users" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."rockets" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."rockets" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."rockets" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."rockets" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."rockets" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."rockets" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."rockets" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."rockets" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."rockets" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."rockets" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."rockets" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."rockets" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."rockets" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."rockets" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."snippets" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."snippets" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."snippets" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."snippets" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."snippets" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."snippets" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."snippets" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."snippets" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."snippets" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."snippets" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."snippets" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."snippets" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."snippets" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."snippets" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."solutions" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."solutions" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."solutions" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."solutions" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."solutions" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."solutions" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."solutions" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."solutions" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."solutions" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."solutions" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."solutions" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."solutions" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."solutions" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."solutions" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."solutions_comments" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."solutions_comments" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."solutions_comments" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."solutions_comments" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."solutions_comments" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."solutions_comments" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."solutions_comments" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."solutions_comments" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."solutions_comments" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."solutions_comments" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."solutions_comments" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."solutions_comments" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."solutions_comments" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."solutions_comments" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."stars" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."stars" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."stars" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."stars" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."stars" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."stars" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."stars" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."stars" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."stars" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."stars" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."stars" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."stars" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."stars" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."stars" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."tiers" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."tiers" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."tiers" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."tiers" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."tiers" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."tiers" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."tiers" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."tiers" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."tiers" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."tiers" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."tiers" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."tiers" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."tiers" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."tiers" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."users" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."users" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."users" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."users" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."users" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."users" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."users" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."users" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."users" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."users" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."users" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."users" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."users" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."users" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."users_acquired_avatars" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."users_acquired_avatars" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."users_acquired_avatars" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."users_acquired_avatars" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."users_acquired_avatars" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."users_acquired_avatars" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."users_acquired_avatars" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."users_acquired_avatars" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."users_acquired_avatars" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."users_acquired_avatars" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."users_acquired_avatars" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."users_acquired_avatars" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."users_acquired_avatars" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."users_acquired_avatars" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."users_acquired_insignias" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."users_acquired_insignias" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."users_acquired_insignias" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."users_acquired_insignias" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."users_acquired_insignias" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."users_acquired_insignias" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."users_acquired_insignias" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."users_acquired_insignias" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."users_acquired_insignias" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."users_acquired_insignias" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."users_acquired_insignias" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."users_acquired_insignias" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."users_acquired_insignias" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."users_acquired_insignias" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."users_acquired_rockets" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."users_acquired_rockets" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."users_acquired_rockets" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."users_acquired_rockets" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."users_acquired_rockets" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."users_acquired_rockets" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."users_acquired_rockets" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."users_acquired_rockets" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."users_acquired_rockets" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."users_acquired_rockets" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."users_acquired_rockets" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."users_acquired_rockets" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."users_acquired_rockets" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."users_acquired_rockets" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."users_challenge_votes" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."users_challenge_votes" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."users_challenge_votes" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."users_challenge_votes" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."users_challenge_votes" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."users_challenge_votes" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."users_challenge_votes" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."users_challenge_votes" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."users_challenge_votes" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."users_challenge_votes" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."users_challenge_votes" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."users_challenge_votes" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."users_challenge_votes" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."users_challenge_votes" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."users_completed_challenges" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."users_completed_challenges" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."users_completed_challenges" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."users_completed_challenges" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."users_completed_challenges" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."users_completed_challenges" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."users_completed_challenges" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."users_completed_challenges" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."users_completed_challenges" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."users_completed_challenges" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."users_completed_challenges" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."users_completed_challenges" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."users_completed_challenges" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."users_completed_challenges" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."users_completed_planets_view" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."users_completed_planets_view" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."users_recently_unlocked_stars" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."users_recently_unlocked_stars" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."users_recently_unlocked_stars" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."users_recently_unlocked_stars" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."users_recently_unlocked_stars" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."users_recently_unlocked_stars" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."users_recently_unlocked_stars" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."users_recently_unlocked_stars" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."users_recently_unlocked_stars" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."users_recently_unlocked_stars" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."users_recently_unlocked_stars" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."users_recently_unlocked_stars" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."users_recently_unlocked_stars" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."users_recently_unlocked_stars" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."users_rescuable_achievements" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."users_rescuable_achievements" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."users_rescuable_achievements" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."users_rescuable_achievements" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."users_rescuable_achievements" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."users_rescuable_achievements" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."users_rescuable_achievements" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."users_rescuable_achievements" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."users_rescuable_achievements" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."users_rescuable_achievements" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."users_rescuable_achievements" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."users_rescuable_achievements" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."users_rescuable_achievements" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."users_rescuable_achievements" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."users_unlocked_achievements" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."users_unlocked_achievements" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."users_unlocked_achievements" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."users_unlocked_achievements" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."users_unlocked_achievements" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."users_unlocked_achievements" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."users_unlocked_achievements" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."users_unlocked_achievements" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."users_unlocked_achievements" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."users_unlocked_achievements" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."users_unlocked_achievements" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."users_unlocked_achievements" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."users_unlocked_achievements" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."users_unlocked_achievements" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."users_unlocked_stars" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."users_unlocked_stars" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."users_unlocked_stars" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."users_unlocked_stars" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."users_unlocked_stars" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."users_unlocked_stars" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."users_unlocked_stars" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."users_unlocked_stars" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."users_unlocked_stars" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."users_unlocked_stars" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."users_unlocked_stars" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."users_unlocked_stars" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."users_unlocked_stars" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."users_unlocked_stars" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."users_upvoted_comments" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."users_upvoted_comments" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."users_upvoted_comments" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."users_upvoted_comments" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."users_upvoted_comments" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."users_upvoted_comments" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."users_upvoted_comments" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."users_upvoted_comments" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."users_upvoted_comments" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."users_upvoted_comments" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."users_upvoted_comments" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."users_upvoted_comments" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."users_upvoted_comments" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."users_upvoted_comments" TO "authenticated";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."users_upvoted_solutions" TO "anon";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."users_upvoted_solutions" TO "anon";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."users_upvoted_solutions" TO "anon";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."users_upvoted_solutions" TO "anon";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."users_upvoted_solutions" TO "anon";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."users_upvoted_solutions" TO "anon";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."users_upvoted_solutions" TO "anon";
--> statement-breakpoint
GRANT DELETE ON TABLE "public"."users_upvoted_solutions" TO "authenticated";
--> statement-breakpoint
GRANT INSERT ON TABLE "public"."users_upvoted_solutions" TO "authenticated";
--> statement-breakpoint
GRANT REFERENCES ON TABLE "public"."users_upvoted_solutions" TO "authenticated";
--> statement-breakpoint
GRANT SELECT ON TABLE "public"."users_upvoted_solutions" TO "authenticated";
--> statement-breakpoint
GRANT TRIGGER ON TABLE "public"."users_upvoted_solutions" TO "authenticated";
--> statement-breakpoint
GRANT TRUNCATE ON TABLE "public"."users_upvoted_solutions" TO "authenticated";
--> statement-breakpoint
GRANT UPDATE ON TABLE "public"."users_upvoted_solutions" TO "authenticated";
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."change_feedback_report_status"(p_request jsonb) TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."change_feedback_report_status"(p_request jsonb) TO "anon";
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."change_feedback_report_status"(p_request jsonb) TO "authenticated";
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."clear_text_block_audio"(p_star_id uuid, p_block_index integer) TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."count_comments_upvotes"(comments) TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."count_planet_completions"(planet_row planets) TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."count_star_unlocks"(star_row stars) TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."count_unread_user_feedback_reports"(p_author_id character varying) TO "authenticated";
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."count_user_completed_challenges"(user_row users) TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."count_user_unlocked_achievements"(user_row users) TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."count_user_unlocked_stars"(user_row users) TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."count_users_at_planet"(planet_row planets) TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."count_users_at_star"(star_row stars) TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."delete_inactive_users"() TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."delete_public_user"(userid character varying) TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."deleteuser"(userid uuid) TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."filter_challenges"(userid text, status text, difficulty text) TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."filter_challenges"(userid uuid, status text, difficulty text) TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."get_last_user_unlocked_star_id"(user_row users) TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."insert_initial_data"() TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."insert_user_initial_data"() TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."insertchallengestopics"() TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."install_available_extensions_and_test"() TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."list_challenges"(p_title text, p_difficulty text, p_categories_ids uuid[], p_completion_status text, p_completed_challenges_ids uuid[], p_account_id text, p_user_id text, p_should_include_star_challenges boolean, p_should_include_private_challenges boolean, p_should_include_only_author boolean, p_is_new_status text, p_page integer, p_items_per_page integer, p_upvotes_count_order text, p_downvote_count_order text, p_completion_count_order text, p_posting_order text) TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."list_feedback_reports"(p_search text, p_intent feedback_intent, p_status text, p_created_at_start timestamp with time zone, p_created_at_end timestamp with time zone, p_page integer, p_items_per_page integer) TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."list_feedback_reports"(p_search text, p_intent feedback_intent, p_status text, p_created_at_start timestamp with time zone, p_created_at_end timestamp with time zone, p_page integer, p_items_per_page integer) TO "anon";
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."list_feedback_reports"(p_search text, p_intent feedback_intent, p_status text, p_created_at_start timestamp with time zone, p_created_at_end timestamp with time zone, p_page integer, p_items_per_page integer) TO "authenticated";
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."list_user_feedback_reports"(p_author_id character varying, p_status text, p_page integer, p_items_per_page integer) TO "authenticated";
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."mark_user_feedback_report_read"(p_report_id uuid, p_author_id character varying, p_last_seen_admin_message_at timestamp with time zone) TO "authenticated";
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."olamundo"() TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."resetstreak"() TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."setwinners"() TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."slugify"(name text) TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."slugify_entities_name"() TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."teste"() TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."testranking"() TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."update_last_week_ranking_positions"() TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."update_text_block_audio"(p_star_id uuid, p_block_index integer, p_audio jsonb) TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."update_user_email"(new_email text, user_id uuid) TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."updateranking"() TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."updateranking_"() TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."updateuserspositions"() TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."updatewinners"() TO PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON ROUTINE "public"."verify_user_space_completion"(user_row users) TO PUBLIC;
