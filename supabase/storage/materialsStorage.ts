import { v4 as uuidv4 } from "uuid";
import { createClient } from "../client";

function getStorage() {
  const { storage } = createClient();
  return storage;
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
      return { attachmentUrl: "", error: "Attachment upload failed" };
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
    return { attachmentUrl: "", error: "Unexpected error during upload" };
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
