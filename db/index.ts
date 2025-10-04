import { drizzle } from "drizzle-orm/postgres-js";

import postgres from "postgres";
// import {
//   assignments,
//   assignments_submissions,
//   feedback,
// } from "./schema/assignments";
// import { courses, map_courses_students } from "./schema/courses";
// import { rolesEnum } from "./schema/common";
// import { map_courses_professors } from "./schema/map_courses_professors";
// import { students, professors } from "./schema/users";

// export const allSchema = {
//   assignments,
//   assignments_submissions,
//   feedback,
//   rolesEnum,
//   courses,
//   map_courses_students,
//   map_courses_professors,
//   students,
//   professors,
// };

const connectionString = `${process.env.DATABASE_URL}`;

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(connectionString, { prepare: false });

export const db = drizzle({ client });
