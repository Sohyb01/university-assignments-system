/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Calculates the percentage of time passed between a start and an end date.
 * @param startDate - The start date in the past.
 * @param endDate - The end date in the future.
 * @returns An integer between 0 and 100 representing the percentage of time passed.
 */
export function calculateTimePassedPercentage(
  startDate: Date,
  endDate: Date
): number {
  const now = new Date();

  if (endDate <= now) {
    return 100; // If the end date has passed, return 100
  }

  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsedDuration = now.getTime() - startDate.getTime();

  if (totalDuration <= 0 || elapsedDuration <= 0) {
    return 0; // If invalid dates or start is in the future
  }

  // Calculate percentage and clamp it to 0-100
  const percentage = Math.min(
    100,
    Math.max(0, Math.floor((elapsedDuration / totalDuration) * 100))
  );

  return percentage;
}

// The code below generates defaultValues object for forms dynamically and programatically

type IsEnum<T> = T extends string | number
  ? T extends `${infer _}`
    ? true // String literal union
    : T extends number
    ? true // Number literal union
    : false
  : false;

type DefaultValue<T> = IsEnum<T> extends true
  ? undefined // Detect enums dynamically
  : T extends string
  ? ""
  : T extends string | null
  ? null
  : T extends number | null
  ? undefined
  : undefined;

export function createDefaultValues<T extends Record<string, any>>(
  tableSchema: T
): { [K in keyof T]: DefaultValue<T[K]> } {
  const result = {} as { [K in keyof T]: DefaultValue<T[K]> };

  for (const key in tableSchema) {
    const column = tableSchema[key];
    // ID Should always be undefined when generating default values for a new object
    if (column.name == "id") {
      result[key as keyof T] = undefined as DefaultValue<T[keyof T]>;
    }
    // Check for enum-like fields (use runtime checks for enum properties)
    else if (column.enumValues) {
      result[key as keyof T] = null as DefaultValue<T[keyof T]>;
    }
    // Handle non-nullable string fields
    else if (column.notNull && column.dataType == "string") {
      result[key as keyof T] = "" as DefaultValue<T[keyof T]>;
    }
    // Handle nullable string fields
    else if (column.dataType == "string" && !column.notNull) {
      result[key as keyof T] = null as DefaultValue<T[keyof T]>;
    }
    // Handle number fields
    else if (column.type == "number") {
      result[key as keyof T] = null as DefaultValue<T[keyof T]>;
    }
    // Fallback for other cases
    else {
      result[key as keyof T] = undefined as DefaultValue<T[keyof T]>;
    }
  }

  return result;
}

// export function generateUniqueString(length: number = 12): string {
//   const characters =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   let uniqueString = "";
//   for (let i = 0; i < length; i++) {
//     const randomIndex = Math.floor(Math.random() * characters.length);
//     uniqueString += characters[randomIndex];
//   }
//   return uniqueString;
// }

/**
 * Generates a unique serial number.
 * @returns {Promise<string>} The unique serial number.
 */
// export async function generateUniqueSerialNumber(): Promise<string> {
//   const prefix = "CERT";
//   const maxAttempts = 5; // Prevent infinite loops

//   let isUnique = false;
//   let attempts = 0;
//   let serialNumber = `${prefix}-${Date.now().toString().slice(-8)}`;

//   while (!isUnique && attempts < maxAttempts) {
//     const existingCertificate = await db
//       .select()
//       .from(certificates)
//       .where(eq(certificates.serial, serialNumber))
//       .limit(1);

//     if (existingCertificate.length === 0) {
//       isUnique = true;
//     } else {
//       const newTimestamps = Date.now().toString().slice(-8);
//       serialNumber = `${prefix}-${newTimestamps}`;
//       attempts++;
//     }
//   }

//   if (!isUnique) {
//     throw new Error("Could not generate a unique serial number after multiple attempts");
//   }

//   return serialNumber;
// }
