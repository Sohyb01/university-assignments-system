CREATE TYPE "public"."assignment_status" AS ENUM('submitted', 'passed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."roles" AS ENUM('superadmin', 'manager', 'professor', 'student');--> statement-breakpoint
CREATE TABLE "assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" varchar(255),
	"name" varchar(255) NOT NULL,
	"due_date" timestamp with time zone NOT NULL,
	"attachment" varchar(255),
	"description" varchar(255),
	"id_course" uuid NOT NULL,
	"id_professor" uuid NOT NULL,
	"notes" varchar(255),
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assignments_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"status" "assignment_status" DEFAULT 'submitted' NOT NULL,
	"submission" varchar(255) NOT NULL,
	"id_assignment" uuid NOT NULL,
	"id_student" uuid NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"desc" varchar(255) NOT NULL,
	"id_assignment_submission" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "courses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "map_courses_students" (
	"id_student" uuid NOT NULL,
	"id_course" uuid NOT NULL,
	CONSTRAINT "map_courses_students_id_student_id_course_pk" PRIMARY KEY("id_student","id_course")
);
--> statement-breakpoint
CREATE TABLE "map_courses_professors" (
	"professor_id" uuid NOT NULL,
	"course_id" uuid NOT NULL,
	CONSTRAINT "map_courses_professors_professor_id_course_id_pk" PRIMARY KEY("professor_id","course_id")
);
--> statement-breakpoint
CREATE TABLE "professors" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "roles" NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "students_email_unique" UNIQUE("email"),
	CONSTRAINT "students_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"username" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "roles" NOT NULL,
	"updated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "students_email_unique" UNIQUE("email"),
	CONSTRAINT "students_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_id_course_courses_id_fk" FOREIGN KEY ("id_course") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_id_professor_professors_id_fk" FOREIGN KEY ("id_professor") REFERENCES "public"."professors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments_submissions" ADD CONSTRAINT "assignments_submissions_id_assignment_assignments_id_fk" FOREIGN KEY ("id_assignment") REFERENCES "public"."assignments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments_submissions" ADD CONSTRAINT "assignments_submissions_id_student_students_id_fk" FOREIGN KEY ("id_student") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_id_assignment_submission_assignments_submissions_id_fk" FOREIGN KEY ("id_assignment_submission") REFERENCES "public"."assignments_submissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "map_courses_students" ADD CONSTRAINT "map_courses_students_id_student_students_id_fk" FOREIGN KEY ("id_student") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "map_courses_students" ADD CONSTRAINT "map_courses_students_id_course_courses_id_fk" FOREIGN KEY ("id_course") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "map_courses_professors" ADD CONSTRAINT "map_courses_professors_professor_id_professors_id_fk" FOREIGN KEY ("professor_id") REFERENCES "public"."professors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "map_courses_professors" ADD CONSTRAINT "map_courses_professors_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;