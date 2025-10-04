import { pgTable, varchar, uuid, primaryKey } from "drizzle-orm/pg-core";
import { timestamps } from "./common";
import { students } from "./users";

// Courses table
export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  ...timestamps,
});

export const map_courses_students = pgTable(
  "map_courses_students",
  {
    id_student: uuid("id_student")
      .notNull()
      .references(() => students.id),
    id_course: uuid("id_course")
      .notNull()
      .references(() => courses.id),
  },
  (t) => [primaryKey({ columns: [t.id_student, t.id_course] })]
);
