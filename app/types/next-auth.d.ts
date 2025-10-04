/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      role: "student" | "professor" | "manager" | "superadmin";
      first_name: string;
      last_name: string;
      email: string;
    };
  }
  interface User {
    id: string;
    role: string;
    first_name: string;
    last_name: string;
    email: string;
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id: string;
    role: string;
    first_name: string;
    last_name: string;
    email: string;
  }
}
