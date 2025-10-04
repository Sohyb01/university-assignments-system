import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { unionAll } from "drizzle-orm/pg-core";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { revalidatePath } from "next/cache";
import { signInSchema } from "./lib/types-forms";
import { professors, students } from "./db/schema/users";

export const { handlers, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const { username, password } = await signInSchema.parseAsync(
            credentials
          );

          // Query all user tables
          const professorsQuery = db
            .select({
              id: professors.id,
              username: professors.username,
              role: professors.role,
              first_name: professors.first_name,
              last_name: professors.last_name,
              email: professors.email,
            })
            .from(professors)
            .where(
              and(
                eq(professors.username, username),
                eq(professors.password, password)
              )
            );

          const studentQuery = db
            .select({
              id: students.id,
              username: students.username,
              role: students.role,
              first_name: students.first_name,
              last_name: students.last_name,
              email: students.email,
            })
            .from(students)
            .where(
              and(
                eq(students.username, username),
                eq(students.password, password)
              )
            );

          // Combine queries
          const foundUser = await unionAll(professorsQuery, studentQuery);

          const dbUser = foundUser[0];

          if (!dbUser) {
            return null;
          }

          const user = {
            id: dbUser.id, // Ensure ID is included
            role: dbUser.role, // Ensure role is included
            first_name: dbUser.first_name, // Ensure first name
            last_name: dbUser.last_name, // Ensure last name
            email: dbUser.email,
          };

          revalidatePath("/dashboard");
          return user;
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    /**
     * Add custom fields to the session object.
     */
    async session({ session, token }) {
      // Add custom fields from the token to the session object
      session.user = {
        ...session.user,
        id: token.id,
        role: token.role as "student" | "professor" | "manager" | "superadmin",
        first_name: token.first_name,
        last_name: token.last_name,
      };

      return session;
    },

    /**
     * Add custom fields to the token.
     */
    async jwt({ token, user }) {
      // During login, add user fields to the token
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
        token.image = user.image || null;
      }

      return token;
    },
  },
});
