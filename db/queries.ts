"use server"; // or put 'use server' inside each exported function

import { and, eq, inArray, InferSelectModel, sql } from "drizzle-orm";
import { courses, map_courses_students } from "./schema/courses";
import { professors, students } from "./schema/users";
import {
  assignments,
  assignments_submissions,
  feedback,
} from "./schema/assignments";
import { map_courses_professors } from "./schema/map_courses_professors";
import {
  FormSchemaAddAssignment,
  TFormSchemaAddAssignment,
} from "@/lib/types-forms";
import z from "zod";
import { db } from ".";

export type coursesWithRelatedDataType = {
  students: typeof students.$inferSelect;
  courses: typeof courses.$inferSelect;
};

export interface Response<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errorCode?: number; // optional error code for further identification
}

export const getCoursesWithRelatedDataByStudent = async (
  studentId: string
): Promise<Response<coursesWithRelatedDataType[] | null>> => {
  try {
    const res = await db
      .select()
      .from(courses)
      .innerJoin(
        map_courses_students,
        eq(courses.id, map_courses_students.id_course)
      )
      .innerJoin(students, eq(map_courses_students.id_student, students.id))
      .where(eq(students.id, studentId));

    if (res.length === 0) {
      return {
        success: true,
        message: "No courses found for this student.",
        data: [],
      };
    }

    return {
      success: true,
      message: "Coursees with related data retrieved successfully.",
      data: res,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error retrieving courses with related data.",
      data: null,
    };
  }
};

export type DueAssignment = {
  assignmentId: string;
  assignmentName: string;
  description: string | null;
  attachment: string | null;
  dueDate: Date;
  //
  courseId: string;
  courseName: string;
  professorId: string;
  professorName: string;
};

export type PastAssignment = {
  assignmentId: string;
  assignmentName: string;
  description: string | null;
  attachment: string | null;
  dueDate: Date;
  //
  courseId: string;
  courseName: string;
  professorId: string;
  professorName: string;
  // Submission details (if any)
  submissionId: string | null;
  status: "submitted" | "passed" | "failed" | null;
  submission: string | null;
};

export async function checkAssignmentSubmission({
  assignmentId,
  studentId,
}: {
  assignmentId: string;
  studentId: string;
}) {
  const res = await db
    .select()
    .from(assignments_submissions)
    .where(
      and(
        eq(assignments_submissions.id_assignment, assignmentId),
        eq(assignments_submissions.id_student, studentId)
      )
    );

  return res;
}

export async function updateAssignmentSubmission({
  fileUrl,
  assignmentId,
  studentId,
}: {
  fileUrl: string;
  assignmentId: string;
  studentId: string;
}) {
  const res = await db
    .update(assignments_submissions)
    .set({ submission: fileUrl })
    .where(
      and(
        eq(assignments_submissions.id_assignment, assignmentId),
        eq(assignments_submissions.id_student, studentId)
      )
    )
    .returning();

  return res;
}

export async function uploadAssignmentSubmission({
  fileUrl,
  assignmentId,
  studentId,
}: {
  fileUrl: string;
  assignmentId: string;
  studentId: string;
}) {
  const res = await db
    .insert(assignments_submissions)
    .values({
      submission: fileUrl,
      id_assignment: assignmentId,
      id_student: studentId,
    })
    .returning();

  return res;
}

export type StudentAssignmentsResult = {
  pastAssignments: PastAssignment[];
  dueAssignments: DueAssignment[];
};

/**
 * Returns all assignments relevant to a student.
 * An assignment is relevant if the student is enrolled in the course (via map_courses_students).
 * Past assignments are those whose due date has passed OR for which a submission exists.
 * For past assignments the query returns the submission’s id, status, submission link, and feedback (if any).
 *
 * @param studentId The student’s id.
 * @returns An object with pastAssignments and dueAssignments arrays.
 */
export async function getStudentAssignmentsWithRelevantDataByCourse(
  studentId: string,
  courseId: string
): Promise<StudentAssignmentsResult> {
  const now = new Date();

  // Query assignments that are relevant for the student.
  // Join assignments with courses and professors to retrieve course and professor details.
  // Also join map_courses_students to filter assignments to those in courses the student is in.
  // Then left join assignments_submissions (filtered by the student) and left join feedback.
  const rows = await db
    .select({
      assignmentId: assignments.id,
      assignmentName: assignments.name,
      description: assignments.description,
      attachment: assignments.attachment,
      dueDate: assignments.due_date,
      //
      courseId: courses.id,
      courseName: courses.name,
      professorId: professors.id,
      professorFirstName: professors.first_name,
      professorLastName: professors.last_name,
      submissionId: assignments_submissions.id,
      status: assignments_submissions.status,
      submission: assignments_submissions.submission,
    })
    .from(assignments)
    .innerJoin(courses, eq(assignments.id_course, courses.id))
    .innerJoin(professors, eq(assignments.id_professor, professors.id))
    .innerJoin(
      map_courses_students,
      eq(map_courses_students.id_course, courses.id)
    )
    .where(
      and(
        eq(map_courses_students.id_student, studentId),
        eq(assignments.id_course, courseId)
      )
    )
    .leftJoin(
      assignments_submissions,
      and(
        eq(assignments_submissions.id_assignment, assignments.id),
        eq(assignments_submissions.id_student, studentId)
      )
    );

  // Separate rows into past and due assignments.
  const pastAssignments: PastAssignment[] = [];
  const dueAssignments: DueAssignment[] = [];

  for (const row of rows) {
    // Compose the professor's full name.
    const professorName = `${row.professorFirstName} ${row.professorLastName}`;

    // Determine whether this assignment is considered "past":
    // Either the student has submitted (submissionId exists)
    // OR the due date is in the past.
    if (row.submissionId !== null || row.dueDate < now) {
      pastAssignments.push({
        assignmentId: row.assignmentId,
        assignmentName: row.assignmentName,
        description: row.description,
        attachment: row.attachment,
        dueDate: row.dueDate,
        //
        courseId: row.courseId,
        courseName: row.courseName,
        professorId: row.professorId,
        professorName,
        submissionId: row.submissionId ?? null,
        status: row.status ?? null,
        submission: row.submission ?? null,
      });
    } else {
      dueAssignments.push({
        assignmentId: row.assignmentId,
        assignmentName: row.assignmentName,
        description: row.description,
        attachment: row.attachment,
        dueDate: row.dueDate,
        //
        courseId: row.courseId,
        courseName: row.courseName,
        professorId: row.professorId,
        professorName,
      });
    }
  }

  return { pastAssignments, dueAssignments };
}

/**
 * A type representing a student.
 */
export type Student = {
  student_id: string;
  first_name: string;
  last_name: string;
  role: string;
  image?: string | null | undefined;
  email?: string | null;
};

/**
 * A type representing a course with its related data and the list of enrolled students.
 */
export type AvailableCourseWithRelatedData = {
  course_id: string;
  course_name: string;
  professor_id: string | null;
  professor_first_name: string | null;
  professor_last_name: string | null;
  professor_role: string | null;
  students: Student[];
};

/**
 * Returns all courses related to the given professor including:
 * - The course information,
 * - The related program-level data,
 * - And the students enrolled in the course.
 */
export async function getAvailableCoursesWithRelatedDataByProfessor(
  professorId: string
): Promise<AvailableCourseWithRelatedData[]> {
  // Execute a query joining all relevant tables.
  const results = await db
    .select({
      course_id: courses.id,
      course_name: courses.name,
      professor_id: professors.id,
      professor_first_name: professors.first_name,
      professor_last_name: professors.last_name,
      professor_role: professors.role,
      student_id: students.id,
      student_first_name: students.first_name,
      student_last_name: students.last_name,
      student_role: students.role,
    })
    .from(courses)
    .innerJoin(
      map_courses_professors,
      eq(courses.id, map_courses_professors.course_id)
    )
    .innerJoin(
      professors,
      eq(map_courses_professors.professor_id, professors.id)
    )
    .leftJoin(
      map_courses_students,
      eq(courses.id, map_courses_students.id_course)
    )
    .leftJoin(students, eq(map_courses_students.id_student, students.id))
    .where(eq(professors.id, professorId));

  // Group rows by course_id.
  const grouped: Record<string, AvailableCourseWithRelatedData> = {};

  results.forEach((row) => {
    if (!grouped[row.course_id]) {
      grouped[row.course_id] = {
        course_id: row.course_id,
        course_name: row.course_name,
        professor_id: row.professor_id || null,
        professor_first_name: row.professor_first_name || null,
        professor_last_name: row.professor_last_name || null,
        professor_role: row.professor_role || null,
        students: [],
      };
    }
    if (row.student_id) {
      grouped[row.course_id].students.push({
        student_id: row.student_id,
        first_name: row.student_first_name!,
        last_name: row.student_last_name!,
        role: row.student_role!,
      });
    }
  });

  return Object.values(grouped);
}

// -------
export type SubmissionRow = InferSelectModel<typeof assignments_submissions>;

// The submission type (for each student submission).
export type ProfessorSubmission = {
  submissionId: string;
  assignmentId: string;
  studentId: string;
  status: "submitted" | "passed" | "failed" | null;
  submission: string;
};

// The professor assignment type includes assignment data plus an array of submissions.
export type ProfessorAssignment = {
  assignmentId: string;
  assignmentName: string;
  description: string | null;
  url: string | null; // the assignment URL field
  dueDate: Date;
  attachment: string | null;
  notes: string | null;
  courseId: string;
  courseName: string;
  professorId: string;
  // We also include the professor's full name if desired.
  professorName: string;
  submissions: ProfessorSubmission[];
};

/**
 * Returns all assignments relevant to a course
 *
 * An assignment is relevant if:
 *  - The assignment’s id_professor equals the professorId OR
 *  - The assignment belongs to a course that is mapped to the professor via map_courses_professors.
 *
 * For each assignment, all student submission records (if any) are attached as an array under "submissions".
 */
export async function getAssignmentsWithRelevantDataByCourse(
  courseId: string
): Promise<ProfessorAssignment[]> {
  // 1. Query assignments that are relevant using an EXISTS subquery.
  const assignmentRows = await db
    .select({
      assignmentId: assignments.id,
      assignmentName: assignments.name,
      description: assignments.description,
      url: assignments.url,
      dueDate: assignments.due_date,
      //
      attachment: assignments.attachment,
      notes: assignments.notes,
      courseId: assignments.id_course,
      courseName: courses.name,
      professorId: assignments.id_professor,
      professorFirstName: professors.first_name,
      professorLastName: professors.last_name,
    })
    .from(assignments)
    .innerJoin(courses, eq(assignments.id_course, courses.id))
    .innerJoin(professors, eq(assignments.id_professor, professors.id))
    .where(eq(assignments.id_course, courseId));

  // 2. Extract the assignment IDs.
  const assignmentIds = assignmentRows.map((row) => row.assignmentId);
  if (assignmentIds.length === 0) {
    return [];
  }

  // 3. Query submissions for these assignments.
  const submissionRows = await db
    .select({
      submissionId: assignments_submissions.id,
      assignmentId: assignments_submissions.id_assignment,
      studentId: assignments_submissions.id_student,
      status: assignments_submissions.status,
      submission: assignments_submissions.submission,
    })
    .from(assignments_submissions)
    .where(inArray(assignments_submissions.id_assignment, assignmentIds));

  // 4. Group submissions by assignmentId.
  const submissionsMap = new Map<string, ProfessorSubmission[]>();
  for (const sub of submissionRows) {
    if (!submissionsMap.has(sub.assignmentId)) {
      submissionsMap.set(sub.assignmentId, []);
    }
    submissionsMap.get(sub.assignmentId)!.push({
      submissionId: sub.submissionId,
      assignmentId: sub.assignmentId,
      studentId: sub.studentId,
      status: sub.status,
      submission: sub.submission,
    });
  }

  // 5. Merge assignment rows with their submissions.
  const assignmentsWithSubmissions: ProfessorAssignment[] = assignmentRows.map(
    (row) => ({
      assignmentId: row.assignmentId,
      assignmentName: row.assignmentName,
      description: row.description,
      url: row.url,
      dueDate: row.dueDate,
      attachment: row.attachment,
      notes: row.notes,
      courseId: row.courseId,
      courseName: row.courseName,
      professorId: row.professorId,
      professorName: `${row.professorFirstName} ${row.professorLastName}`,
      submissions: submissionsMap.get(row.assignmentId) ?? [],
    })
  );

  return assignmentsWithSubmissions;
}

export async function upsertAssignment(
  raw: TFormSchemaAddAssignment
): Promise<Response<TFormSchemaAddAssignment>> {
  // 1️⃣ Validate with Zod - getting the schema original definition before .refines so that we can access the omit method
  const parsedResult = FormSchemaAddAssignment._def.schema
    .omit({
      attachment: true,
    })
    .extend({
      attachment: z.string().url("Invalid attachment URL").nullish(), // Must turn attachment field into a string not a file for server-side validation
    })
    .safeParse(raw);

  if (!parsedResult.success) {
    return {
      success: false,
      message: "Validation failed.",
      error: JSON.stringify(parsedResult.error.flatten()),
    };
  }
  const parsed = parsedResult.data;

  try {
    let saved: TFormSchemaAddAssignment;

    if (parsed.id) {
      // 2a. UPDATE existing assignment
      await db
        .update(assignments)
        .set({ ...parsed, updated_at: new Date() })
        .where(eq(assignments.id, parsed.id));

      saved = parsed;
      return {
        success: true,
        message: "Assignment updated successfully.",
        data: saved,
      };
    } else {
      // 2b. INSERT new assignment
      const [inserted] = await db
        .insert(assignments)
        .values({
          name: parsed.name,
          url: parsed.url,
          due_date: parsed.due_date,
          attachment: parsed.attachment,
          description: parsed.description,
          id_course: parsed.id_course,
          id_professor: parsed.id_professor,
          notes: parsed.notes,
        })
        .returning();

      saved = inserted as TFormSchemaAddAssignment;
      return {
        success: true,
        message: "Assignment created successfully.",
        data: saved,
      };
    }
  } catch {
    // 3️⃣ Generic DB-error response
    return {
      success: false,
      message: parsed.id
        ? "An error occurred while updating the assignment."
        : "An error occurred while creating the assignment.",
    };
  }
}

export const createAssignmentSubmission = async (
  obj: typeof assignments_submissions.$inferInsert
) => {
  try {
    const submissionId = await db
      .insert(assignments_submissions)
      .values({ ...obj })
      .returning({ id: assignments_submissions.id })
      .then((r) => r[0].id);

    return {
      error: false,
      message: "Successfully submitted.",
      id: submissionId,
    };
  } catch (error) {
    console.error(error);
    return {
      error: true,
      message: "Failed to create assignment. Please try again.",
      id: null,
    };
  }
};

export type GradeSubmissionProps = {
  submissionId: string;
  newStatus: "passed" | "failed";
  feedback: string;
};

export async function gradeSubmission({
  submissionId,
  newStatus,
  feedback: feedbackText,
}: GradeSubmissionProps): Promise<{ success: boolean }> {
  // 1. Update the submission's status.
  await db
    .update(assignments_submissions)
    .set({ status: newStatus })
    .where(eq(assignments_submissions.id, submissionId));

  // 2. Check if feedback already exists.
  const existingFeedback = await db
    .select()
    .from(feedback)
    .where(eq(feedback.id_assignment_submission, submissionId));

  if (existingFeedback.length > 0) {
    if (feedbackText.trim().length < 1) {
      await db
        .delete(feedback)
        .where(eq(feedback.id_assignment_submission, submissionId));
    } else {
      // Update existing feedback.
      await db
        .update(feedback)
        .set({ description: feedbackText })
        .where(eq(feedback.id_assignment_submission, submissionId));
    }
  } else {
    // Insert new feedback if provided.
    if (feedbackText.trim().length > 0) {
      await db.insert(feedback).values({
        id_assignment_submission: submissionId,
        description: feedbackText,
      });
    }
  }

  return { success: true };
}

export type AssignmentSubmissionData = {
  studentId: string;
  firstName: string;
  lastName: string;
  submissionId: string | null;
  submission: string | null;
  status: "submitted" | "passed" | "failed" | null;
  submittedAt: Date | null;
  feedback: string | null;
  assignmentName: string;
  assignmentId: string;
};

//

export async function getAssignmentSubmissions(
  assignmentId: string
): Promise<AssignmentSubmissionData[]> {
  // First, retrieve the assignment row to get its course ID.
  const [assignmentRow] = await db
    .select({ id_course: assignments.id_course })
    .from(assignments)
    .where(eq(assignments.id, assignmentId));

  if (!assignmentRow) {
    throw new Error("Assignment not found");
  }

  // Now get all students in that course via map_courses_students,
  // left join their submission (if any) and feedback.
  const submissions = await db
    .select({
      studentId: students.id,
      firstName: students.first_name,
      lastName: students.last_name,
      submissionId: assignments_submissions.id,
      submission: assignments_submissions.submission,
      status: assignments_submissions.status,
      submittedAt: assignments_submissions.created_at,
      feedback: feedback.description,
      assignmentId: assignments.id,
      assignmentName: assignments.name,
    })
    .from(students)
    .innerJoin(
      map_courses_students,
      eq(map_courses_students.id_student, students.id)
    )
    .innerJoin(assignments, eq(assignments.id, assignmentId))
    .leftJoin(
      assignments_submissions,
      and(
        eq(assignments_submissions.id_assignment, assignmentId),
        eq(assignments_submissions.id_student, students.id)
      )
    )
    .leftJoin(
      feedback,
      eq(feedback.id_assignment_submission, assignments_submissions.id)
    )
    .where(eq(map_courses_students.id_course, assignmentRow.id_course));

  return submissions;
}

// Fetch all professors in a course
export async function getProfessorsInCourse(
  courseId: string
): Promise<Response<(typeof professors.$inferSelect)[]>> {
  try {
    const results = await db
      .select()
      .from(professors)
      .innerJoin(
        map_courses_professors,
        eq(map_courses_professors.professor_id, professors.id)
      )
      .innerJoin(courses, eq(courses.id, map_courses_professors.course_id))
      .where(eq(courses.id, courseId));

    return {
      success: true,
      message: "Professors retrieved successfully.",
      data: results.map((o) => o.professors),
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error retrieving professors.",
    };
  }
}

export type AssignmentWithSubmission = {
  id: string;
  name: string;
  description: string | null;
  notes: string | null;
  attachment: string | null;
  url: string | null;
  due_date: Date;
  course_id: string;
  course_name: string;
  professor_id: string;
  professor_name: string;
  submission: string | null;
  status: "submitted" | "passed" | "failed" | null;
  created_at: Date;
};

export async function getAssignmentWithSubmissionByStudent(
  student_id: string,
  assignment_id: string
): Promise<Response<AssignmentWithSubmission[]>> {
  try {
    const studentAssignments = await db
      .select({
        assignment_id: assignments.id,
        assignment_name: assignments.name,
        assignment_description: assignments.description,
        assignment_notes: assignments.notes,
        assignment_attachment: assignments.attachment,
        assignment_url: assignments.url,
        due_date: assignments.due_date,
        course_id: courses.id,
        course_name: courses.name,
        professor_id: professors.id,
        professor_name: sql<string>`CONCAT(${professors.first_name}, ' ', ${professors.last_name})`,
        submission: assignments_submissions.submission,
        submission_status: assignments_submissions.status,
        feedback: feedback.description,
        created_at: assignments.created_at,
      })
      .from(assignments)
      .innerJoin(courses, eq(assignments.id_course, courses.id))
      .innerJoin(professors, eq(assignments.id_professor, professors.id))
      .leftJoin(
        assignments_submissions,
        and(
          eq(assignments_submissions.id_assignment, assignment_id), // Correct FK reference
          eq(assignments_submissions.id_student, student_id) // Ensuring correct student ID
        )
      )
      .leftJoin(
        feedback,
        eq(assignments_submissions.id, feedback.id_assignment_submission)
      );

    const formattedAssignments = studentAssignments.map((assignment) => ({
      id: assignment.assignment_id,
      name: assignment.assignment_name,
      description: assignment.assignment_description,
      notes: assignment.assignment_notes,
      attachment: assignment.assignment_attachment,
      url: assignment.assignment_url,
      due_date: assignment.due_date,
      course_id: assignment.course_id,
      course_name: assignment.course_name,
      professor_id: assignment.professor_id,
      professor_name: assignment.professor_name,
      submission: assignment.submission ?? null, // Ensuring null if no submission exists
      status: assignment.submission_status ?? null, // Ensuring null if no status exists
      feedback: assignment.feedback ?? null, // Ensuring null if no feedback exists
      created_at: assignment.created_at,
    }));

    return {
      success: true,
      message: "Assignments with submissions fetched successfully",
      data: formattedAssignments,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Error retrieving assignments with submissions.",
      data: [], // return empty array in case of error
    };
  }
}
