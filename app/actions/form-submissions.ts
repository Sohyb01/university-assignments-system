import { db } from "@/db";
import { Response } from "@/db/queries";
import { courses, map_courses_students } from "@/db/schema/courses";
import { map_courses_professors } from "@/db/schema/map_courses_professors";
import { FormSchemaAddCourse, TFormSchemaAddCourse } from "@/lib/types-forms";
import { eq } from "drizzle-orm";

export async function upsertCourse(
  raw: TFormSchemaAddCourse & Partial<{ id: string }>
): Promise<Response<TFormSchemaAddCourse & { id: string }>> {
  // 1️⃣ Validate input
  const parsedResult = FormSchemaAddCourse.safeParse(raw);
  if (!parsedResult.success) {
    return {
      success: false,
      message: "Validation failed.",
    };
  }
  const parsed = parsedResult.data;

  try {
    let classId: string;

    if (parsed.id) {
      // 2a. UPDATE existing class
      await db
        .update(courses)
        .set({
          name: parsed.name,
          updated_at: new Date(),
        })
        .where(eq(courses.id, parsed.id));

      classId = parsed.id;

      // reset professor mappings
      await db
        .delete(map_courses_professors)
        .where(eq(map_courses_professors.course_id, classId));
      if (parsed.professors.length) {
        await db.insert(map_courses_professors).values(
          parsed.professors.map((instrId) => ({
            professor_id: instrId,
            course_id: classId,
          }))
        );
      }

      // reset student mappings
      await db
        .delete(map_courses_students)
        .where(eq(map_courses_students.id_course, classId));
      if (parsed.students.length) {
        await db.insert(map_courses_students).values(
          parsed.students.map((studId) => ({
            id_student: studId,
            id_course: classId,
          }))
        );
      }

      return {
        success: true,
        message: "Class updated successfully.",
        data: { ...parsed, id: classId },
      };
    } else {
      // 2b. INSERT new class
      const [inserted] = await db
        .insert(courses)
        .values({
          name: parsed.name,
        })
        .returning();

      classId = inserted.id;

      // create professor mappings
      if (parsed.professors.length) {
        await db.insert(map_courses_professors).values(
          parsed.professors.map((instrId) => ({
            professor_id: instrId,
            course_id: classId,
          }))
        );
      }

      // create student mappings
      if (parsed.students.length) {
        await db.insert(map_courses_students).values(
          parsed.students.map((studId) => ({
            id_student: studId,
            id_course: classId,
          }))
        );
      }

      return {
        success: true,
        message: "Class created successfully.",
        data: { ...parsed, id: classId },
      };
    }
  } catch {
    // 3️⃣ Generic DB-error response
    return {
      success: false,
      message: parsed.id
        ? "An error occurred while updating the class."
        : "An error occurred while creating the class.",
    };
  }
}
