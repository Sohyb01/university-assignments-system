ALTER TABLE "professors" DROP CONSTRAINT "students_email_unique";--> statement-breakpoint
ALTER TABLE "professors" DROP CONSTRAINT "students_username_unique";--> statement-breakpoint
ALTER TABLE "professors" ADD CONSTRAINT "professors_username_unique" UNIQUE("username");--> statement-breakpoint
ALTER TABLE "professors" ADD CONSTRAINT "professors_email_unique" UNIQUE("email");