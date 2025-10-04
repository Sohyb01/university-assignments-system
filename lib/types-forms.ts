import { assignments } from "@/db/schema/assignments";
import z, { object, string } from "zod";
import { checkAttachmentFileType, MAX_FILE_SIZE_5MB } from "./utils";
import { createInsertSchema } from "drizzle-zod";
import { courses } from "@/db/schema/courses";

export const signInSchema = object({
  username: string().trim().min(1, "Username is required"),
  password: string()
    .trim()
    .min(1, "Password is required")
    .max(255, "Password must be less than 255 characters"),
});

export const FormSchemaAddAssignment = createInsertSchema(assignments, {
  attachment: z
    .any()
    .refine(
      (files) => files[0] == undefined || files[0]?.size < MAX_FILE_SIZE_5MB,
      "Please Upload a File Under 5 MB"
    )
    .refine(
      (files) => files && checkAttachmentFileType(files[0]?.name),
      "Unsupported file format."
    )
    .nullish(),
  id_course: (field) => field.trim().min(1, "Required"),
  id_professor: (field) => field.trim().min(1, "Required"),
}).refine((data) => data.due_date.getTime() > new Date().getTime(), {
  message: "Due date must be in the future!",
  path: ["due_date"],
});

export type TFormSchemaAddAssignment = z.infer<typeof FormSchemaAddAssignment>;

export const FormSchemaAddCourse = createInsertSchema(courses, {
  name: (field) => field.trim().min(1, "Required"),
}).extend({
  professors: z.array(z.string()).nonempty("Select at least one professor"),
  students: z.array(z.string()),
});

export type TFormSchemaAddCourse = z.infer<typeof FormSchemaAddCourse>;
