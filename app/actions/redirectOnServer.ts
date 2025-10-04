"use server";

import { redirect } from "next/navigation";

// Redirect on server
export const redirectOnServer = async (path: string) => {
  redirect(path);
};
