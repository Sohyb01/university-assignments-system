import { relations } from "drizzle-orm";
import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";
import { courses } from "./courses";
import { professors } from "./users";

export const professorsCoursesRelations = relations(professors, ({ many }) => ({
  map_courses_professors: many(map_courses_professors),
}));

export const coursesProfessorsRelations = relations(courses, ({ many }) => ({
  map_courses_professors: many(map_courses_professors),
}));

export const map_courses_professors = pgTable(
  "map_courses_professors",
  {
    professor_id: uuid("professor_id")
      .notNull()
      .references(() => professors.id),
    course_id: uuid("course_id")
      .notNull()
      .references(() => courses.id),
  },
  (t) => [primaryKey({ columns: [t.professor_id, t.course_id] })]
);

export const professorsToCoursesRelations = relations(
  map_courses_professors,
  ({ one }) => ({
    course: one(courses, {
      fields: [map_courses_professors.course_id],
      references: [courses.id],
    }),
    professor: one(professors, {
      fields: [map_courses_professors.professor_id],
      references: [professors.id],
    }),
  })
);
