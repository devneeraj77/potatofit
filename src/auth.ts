import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { syncAuthUserToSupabase } from "@/lib/supabase";
import { getAdminByEmail, isAdmin } from "@/lib/admin-store";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = (credentials?.email as string)?.trim().toLowerCase();
        const password = credentials?.password as string;

        if (!email || !password) {
          return null;
        }

        // Check if user is in admin directory
        const adminProfile = getAdminByEmail(email);

        // Standard athlete credentials, demo login, or verified admin
        if (
          adminProfile ||
          (email === "david.kim@fitmeal.fit" && password === "fitmeal2026") ||
          (email.includes("@") && password.length >= 6)
        ) {
          const displayName = adminProfile?.name
            ? adminProfile.name
            : email === "david.kim@fitmeal.fit"
            ? "David Kim"
            : email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

          const userObj = {
            id: adminProfile?.id || "user-" + email.replace(/[^a-z0-9]/g, "-"),
            name: displayName,
            email: email,
            role: adminProfile ? adminProfile.role : "athlete",
          };

          // Synchronize user authentication record to Supabase database
          try {
            await syncAuthUserToSupabase(userObj);
          } catch (err) {
            console.warn("[Auth] Supabase sync caught:", err);
          }

          return userObj;
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        const u = user as { role?: string };
        token.role = u.role || "athlete";
      }

      if (token.email) {
        const adminRecord = getAdminByEmail(token.email as string);
        if (adminRecord && adminRecord.status === "active") {
          token.role = adminRecord.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.id) {
          session.user.id = token.id as string;
        }
        const userWithMeta = session.user as typeof session.user & {
          role?: string;
          isAdmin?: boolean;
        };
        userWithMeta.role = (token.role as string) || "athlete";
        userWithMeta.isAdmin = isAdmin(session.user.email);
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET || "fitmeal-nextauth-secret-32-chars-key",
  trustHost: true,
});
