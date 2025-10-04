import { v4 as uuidv4 } from "uuid";
import {
  checkAssignmentSubmission,
  updateAssignmentSubmission,
  uploadAssignmentSubmission,
} from "@/db/queries";
import { createClient } from "../client";

function getStorage() {
  const { storage } = createClient();
  return storage;
}

export type UploadAttachmentProps = {
  file: File;
  bucket?: string;
  oldAttachmentUrl?: string | null;
  folder?: string;
};

export const uploadAssignmentAttachment = async ({
  file,
  bucket = "assignment-submissions",
  oldAttachmentUrl,
  folder,
}: UploadAttachmentProps) => {
  const fileName = file.name;
  const fileExtension = fileName.slice(fileName.lastIndexOf(".") + 1);
  const path = `${folder ? folder + "/" : ""}${uuidv4()}.${fileExtension}`;

  const storage = getStorage();

  // Delete old attachment if it exists
  if (oldAttachmentUrl) {
    try {
      const bucketUrl =
        process.env.NEXT_PUBLIC_SUPABASE_URL +
        `/storage/v1/object/public/${bucket}/`;

      if (!oldAttachmentUrl.startsWith(bucketUrl)) {
        throw new Error("Invalid attachment URL");
      }

      const oldAttachmentPath = oldAttachmentUrl.replace(bucketUrl, "");
      await storage.from(bucket).remove([oldAttachmentPath]);
    } catch (error) {
      console.error(error);
      return {
        attachmentUrl: "",
        error: "Error occurred while deleting old attachment",
      };
    }
  }

  // Upload new attachment
  const { data, error } = await storage.from(bucket).upload(path, file);

  if (error) {
    console.error(error);
    return { attachmentUrl: "", error: "Attachment upload failed" };
  }

  const attachmentUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${data?.path}`;

  return { attachmentUrl, error: "" };
};

export const deleteAttachment = async (attachmentUrl: string) => {
  try {
    const bucketAndPathString = attachmentUrl.split(
      "/storage/v1/object/public/"
    )[1];
    const firstSlashIndex = bucketAndPathString.indexOf("/");

    const bucket = bucketAndPathString.slice(0, firstSlashIndex);
    const path = bucketAndPathString.slice(firstSlashIndex + 1);

    const storage = getStorage();

    const { data, error } = await storage.from(bucket).remove([path]);

    if (error) {
      throw new Error("Failed to delete attachment");
    }

    return { data, error: null };
  } catch (error) {
    console.error(error);
    return { data: null, error: "Error deleting attachment" };
  }
};

/**
 * Helper to delete an existing file from Supabase Storage.
 * @param fileUrl - The public URL of the file.
 * @param bucket - The bucket name.
 * @throws if deletion fails.
 */
async function deleteFileFromSupabase(fileUrl: string, bucket: string) {
  const bucketUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/`;
  if (!fileUrl.startsWith(bucketUrl)) {
    throw new Error("Invalid file URL");
  }
  const filePath = fileUrl.replace(bucketUrl, ""); // extract the relative path
  const storage = getStorage();
  const { error } = await storage.from(bucket).remove([filePath]);
  if (error) {
    throw new Error("Failed to delete old file: " + error.message);
  }
}

export type SubmitAssignmentProps = {
  file: File;
  assignmentId: string;
  studentId: string;
  bucket?: string;
  folder?: string;
};

/**
 * Uploads a file as an assignment submission.
 *
 * If a submission for the assignment by this student already exists, the old file is deleted and
 * the submission record is updated with the new file URL.
 * Otherwise, a new submission record is inserted.
 *
 * @param props - Submission parameters.
 * @returns The inserted or updated submission record.
 * @throws if the upload or update fails.
 */
export async function submitAssignment({
  file,
  assignmentId,
  studentId,
  bucket = "assignment-submissions",
  folder = "submissions",
}: SubmitAssignmentProps) {
  // Check if a submission already exists.
  const existing = await checkAssignmentSubmission({
    assignmentId,
    studentId,
  });

  const isResubmission = existing.length > 0;
  const oldSubmissionUrl = isResubmission ? existing[0].submission : null;

  // Prepare a unique file path.
  const fileName = file.name;
  const fileExtension = fileName.slice(fileName.lastIndexOf(".") + 1);
  const path = `${folder ? folder + "/" : ""}${uuidv4()}.${fileExtension}`;

  const storage = getStorage();

  // Upload the new file.
  const { data: uploadData, error: uploadError } = await storage
    .from(bucket)
    .upload(path, file);

  if (uploadError) {
    throw new Error("File upload failed: " + uploadError.message);
  }

  // Build the public URL for the new file.
  const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${uploadData?.path}`;

  if (isResubmission && oldSubmissionUrl) {
    // Delete the old file.
    await deleteFileFromSupabase(oldSubmissionUrl, bucket);
    // Update the existing submission record.
    const updatedSubmission = await updateAssignmentSubmission({
      fileUrl,
      assignmentId,
      studentId,
    });
    return updatedSubmission;
  } else {
    // Insert a new submission record.
    const [newSubmission] = await uploadAssignmentSubmission({
      fileUrl,
      assignmentId,
      studentId,
    });
    return newSubmission;
  }
}

type UploadMaterialProps = {
  file: File;
  bucket: string;
  folder?: string;
};

export const uploadMaterial = async ({
  file,
  bucket,
  folder,
}: UploadMaterialProps) => {
  const fileName = file.name;
  const fileExtension = fileName.slice(fileName.lastIndexOf(".") + 1);
  const path = `${folder ? folder + "/" : ""}${uuidv4()}.${fileExtension}`;

  try {
    const storage = getStorage();
    const { data, error } = await storage.from(bucket).upload(path, file);

    if (error) {
      console.error("Upload error:", error);
      return { attachmentUrl: "", error: error };
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl) {
      console.error("NEXT_PUBLIC_SUPABASE_URL is undefined");
      return { attachmentUrl: "", error: "Supabase URL is not defined" };
    }

    const attachmentUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${data?.path}`;
    return { attachmentUrl, error: "" };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { attachmentUrl: "", error: error };
  }
};

export const deleteMaterial = async (attachmentUrl: string) => {
  const bucketAndPathString = attachmentUrl.split(
    "/storage/v1/object/public/"
  )[1];
  const firstSlashIndex = bucketAndPathString.indexOf("/");

  const bucket = bucketAndPathString.slice(0, firstSlashIndex);
  const path = bucketAndPathString.slice(firstSlashIndex + 1);

  const storage = getStorage();

  const { data, error } = await storage.from(bucket).remove([path]);

  return { data, error };
};
