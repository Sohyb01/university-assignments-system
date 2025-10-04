import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";
import { format, parseISO } from "date-fns";

// Generate a short ID
export const shortId = () => {
  const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 8);
  return nanoid();
};

export const convertUTCDateToLocal = (utcDateString: string): string => {
  const utcDate = parseISO(utcDateString); // Parse the UTC date string
  return format(utcDate, "yyyy-MM-dd HH:mm"); // Format it to the desired format in local time
};

export async function convertBlobUrlToFile(blobUrl: string) {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  const fileName = Math.random().toString(36).slice(2, 9);
  const mimeType = blob.type || "application/octet-stream";
  const file = new File([blob], `${fileName}.${mimeType.split("/")[1]}`, {
    type: mimeType,
  });
  return file;
}

const customtwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        "text-h1",
        "text-h2",
        "text-h3",
        "text-h4",
        "text-large",
        "text-lead",
        "text-p",
        "text-p_ui",
        "text-p_ui_medium",
        "text-list",
        "text-body",
        "text-body_medium",
        "text-subtle",
        "text-subtle_medium",
        "text-subtle_semibold",
        "text-small",
        "text-detail",
        "text-badge",
        "text-blockquote",
        "text-table_head",
        "text-table_item",
        "text-kb_shortcut",
        "text-card_title",
      ],
      "text-color": [
        "text-background",
        "text-foreground",
        "text-shade",
        "text-whatsapp",
        "text-card",
        "text-card-foreground",
        "text-popover",
        "text-popover-foreground",
        "text-primary",
        "text-primary-foreground",
        "text-secondary",
        "text-secondary-foreground",
        "text-muted",
        "text-muted-foreground",
        "text-accent",
        "text-accent-foreground",
        "text-destructive",
        "text-destructive-foreground",
        "text-border",
        "text-input",
        "text-ring",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customtwMerge(clsx(inputs));
}

// File Validation
export const MAX_FILE_SIZE_5MB = 5242880;

export function checkCVFileType(filename: string | undefined) {
  if (filename == undefined) return true; // The outside function will always return false if this value is undefined anyway

  const fileType = filename.split(".").pop();
  if (fileType === "docx" || fileType === "pdf") return true;
  return false;
}

export function checkAttachmentFileType(filename: string | undefined) {
  if (filename == undefined) return true; // The outside function will always return false if this value is undefined anyway

  const fileType = filename.split(".").pop();
  if (
    fileType === "pdf" ||
    fileType === "py" ||
    fileType === "js" ||
    fileType === "css" ||
    fileType === "html" ||
    fileType === "ts" ||
    fileType === "ppt" ||
    fileType === "pptx" ||
    fileType === "txt" ||
    fileType === "docx" ||
    fileType === "xlsx" ||
    fileType === "csv" ||
    fileType === "rar" ||
    fileType === "zip" ||
    fileType === "png" ||
    fileType === "jpg" ||
    fileType === "jpeg" ||
    fileType === "zip"
  )
    return true;
  return false;
}

export function checkImageFileType(filename: string, required: boolean) {
  if (!required) return true;
  if (filename == undefined) return false;
  const fileType = filename.split(".").pop(); // Choose what attachment types are allowed
  if (
    fileType === "webp" ||
    fileType === "png" ||
    fileType === "jpg" ||
    fileType === "jpeg"
  )
    return true;
  return false;
}

export function shuffleArray(array: string[] | number[]) {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index between 0 and i (inclusive)
    const randomIndex = Math.floor(Math.random() * (i + 1));

    // Swap the elements at i and randomIndex
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
  return array;
}

export const str2bool = (value: string) => {
  if (value && typeof value === "string") {
    if (value.toLowerCase() === "true") return true;
    if (value.toLowerCase() === "false") return false;
  }
  return value;
};

//ME
// utils/username.ts

/**
 * Generates a username by combining the user's first name, last name,
 * and a random 4-digit number.
 *
 * @param first_name - The user's first name.
 * @param last_name - The user's last name.
 * @returns A suggested unique username.
 */
export const generateUsername = (
  first_name: string,
  last_name: string
): string => {
  // Normalize names: lowercase and remove whitespace
  const normalizedFirst = first_name.trim().toLowerCase().replace(/\s+/g, "");
  const normalizedLast = last_name.trim().toLowerCase().replace(/\s+/g, "");

  // Create a random 4-digit number (from 1000 to 9999)
  const randomNum = Math.floor(1000 + Math.random() * 9000);

  // Combine the parts into a username suggestion
  return `${normalizedFirst}.${normalizedLast}${randomNum}`;
};

// utils/password.ts

import crypto from "crypto";

/**
 * Generates a random password of the specified length.
 *
 * @param length - The length of the password to generate (default is 12).
 * @returns A random password string.
 */
export const generatePassword = (length: number = 12): string => {
  // Define the allowed characters
  const possibleChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
  let password = "";

  // Use crypto.randomInt for a cryptographically secure random index
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, possibleChars.length);
    password += possibleChars[randomIndex];
  }
  return password;
};

// utils/referral.ts
export const generateReferralLink = (referralCode: string) => {
  return `${process.env.BASE_URL}/get-started/?referralCode=${referralCode}`;
};

export function generateReferralCode(last_name: string): string {
  const initials = (last_name.charAt(0) + last_name.charAt(1)).toUpperCase();
  const digits = Date.now().toString().slice(-5);
  return `${initials}${digits}`;
}

export const escapeHtml = (unsafe: string) =>
  unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export function convertUTCToLocalTimeString(utcString: string) {
  // Convert "2025-10-01 20:15" → "2025-10-01T20:15:00Z"
  const isoString = utcString.replace(" ", "T") + ":00Z";

  const date = new Date(isoString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hour}:${minute}`;
}

/**
 * Generates a random password of the specified length.
 *
 * @param length - The length of the password to generate (default is 8).
 * @returns A random password string.
 */
export const generateAdmissionNumber = (length: number = 8): string => {
  // Define the allowed characters
  const possibleChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
  let admissionNumber = "";

  // Use crypto.randomInt for a cryptographically secure random index
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, possibleChars.length);
    admissionNumber += possibleChars[randomIndex];
  }
  return admissionNumber;
};

const capitalizeFirstLetter = (str: string) =>
  str ? str[0].toUpperCase() + str.slice(1) : "";

export function capitalizeWords(str: string): string {
  return str
    .split(" ")
    .map((word) => capitalizeFirstLetter(word))
    .join(" ");
}
