ALTER TABLE "user" ADD COLUMN "avatar_color" text DEFAULT '#6366f1' NOT NULL;--> statement-breakpoint
CREATE INDEX "message_logs_user_idx" ON "message_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "message_logs_message_idx" ON "message_logs" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX "message_logs_timestamp_idx" ON "message_logs" USING btree ("timestamp");--> statement-breakpoint
CREATE INDEX "messages_from_idx" ON "messages" USING btree ("from");--> statement-breakpoint
CREATE INDEX "messages_to_idx" ON "messages" USING btree ("to");--> statement-breakpoint
CREATE INDEX "messages_folder_idx" ON "messages" USING btree ("folder");--> statement-breakpoint
CREATE INDEX "messages_owner_folder_idx" ON "messages" USING btree ("from","to","folder");