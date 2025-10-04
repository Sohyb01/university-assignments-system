import { pgTable, uuid, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";

import { courses } from "./courses";
import { students, professors } from "./users";
import { timestamps } from "./common";

export const assignmentStatusEnum = pgEnum("assignment_status", [
  "submitted",
  "passed",
  "failed",
  // "due",
  // "missed",
]);

const baseAssignment = {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  url: varchar("url", { length: 255 }),
  name: varchar("name", { length: 255 }).notNull(),
  due_date: timestamp("due_date", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
  attachment: varchar("attachment", { length: 255 }),
  description: varchar("description", { length: 255 }),
  //
  id_course: uuid("id_course")
    .notNull()
    .references(() => courses.id),
  id_professor: uuid("id_professor") // Sender
    .notNull()
    .references(() => professors.id),
  notes: varchar("notes", { length: 255 }),
  //
  ...timestamps,
};

export const assignments = pgTable("assignments", {
  ...baseAssignment,
});

export const assignments_submissions = pgTable("assignments_submissions", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  status: assignmentStatusEnum().default("submitted").notNull(),
  submission: varchar("submission", { length: 255 }).notNull(),
  id_assignment: uuid("id_assignment")
    .notNull()
    .references(() => assignments.id),
  id_student: uuid("id_student")
    .notNull()
    .references(() => students.id),
  ...timestamps,
});

export const feedback = pgTable("feedback", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  description: varchar("desc", { length: 255 }).notNull(),
  id_assignment_submission: uuid("id_assignment_submission")
    .notNull()
    .references(() => assignments_submissions.id),
});
