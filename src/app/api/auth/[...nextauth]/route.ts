// Sanitize invalid environment URLs to avoid NextAuth ERR_INVALID_URL crash
if (process.env.NEXTAUTH_URL && !process.env.NEXTAUTH_URL.startsWith("http")) {
  delete process.env.NEXTAUTH_URL;
}
if (process.env.AUTH_URL && !process.env.AUTH_URL.startsWith("http")) {
  delete process.env.AUTH_URL;
}
process.env.AUTH_TRUST_HOST = "true";

import { handlers } from "@/auth";

export const { GET, POST } = handlers;
