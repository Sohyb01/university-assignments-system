import { pgEnum, timestamp } from "drizzle-orm/pg-core";

export const rolesEnum = pgEnum("roles", [
  "superadmin",
  "manager",
  "professor",
  "student",
]);

export const timestamps = {
  updated_at: timestamp("updated_at", { withTimezone: true, mode: "date" }),
  created_at: timestamp("created_at", { withTimezone: true, mode: "date" })
    .defaultNow()
    .notNull(),
};
