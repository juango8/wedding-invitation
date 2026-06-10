CREATE TYPE "public"."guest_status" AS ENUM('pending', 'accepted', 'declined');--> statement-breakpoint
CREATE TABLE "admins" (
	"email" text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token" text NOT NULL,
	"full_name" text NOT NULL,
	"phone" text,
	"group_label" text,
	"status" "guest_status" DEFAULT 'pending' NOT NULL,
	"message" text,
	"responded_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "guests_token_unique" UNIQUE("token")
);
