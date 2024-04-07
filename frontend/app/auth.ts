import NextAuth from "next-auth";

import type { NextAuthConfig } from "next-auth";

import Credentials from "@auth/core/providers/credentials";
import { validateJWT } from "./lib/authHelpers";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  // Add other fields as needed
};

export const config = {
  theme: {
    logo: "https://next-auth.js.org/img/logo/logo-sm.png",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        token: { label: "Token", type: "text" },
      },
      async authorize(
        credentials: Partial<Record<"token", unknown>>,
        request: Request
      ): Promise<User | null> {
        const token = credentials.token as string; // Safely cast to string; ensure to handle undefined case
        if (typeof token !== "string" || !token) {
          throw new Error("Token is required");
        }

        const jwtPayload = await validateJWT(token);

        if (jwtPayload) {
          // Transform the JWT payload into your user object
          const user: User = {
            id: jwtPayload.sub as string, // Assuming 'sub' is the user ID
            firstName: jwtPayload.FirstName || "", // Replace with actual field from JWT payload
            lastName: jwtPayload.LastName || "", // Replace with actual field from JWT payload
            email: jwtPayload.email || "", // Replace with actual field from JWT payload
            // Map other fields as needed
          };
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      if (pathname === "/middleware-example") return !!auth;
      return true;
    },
    jwt(params) {
      console.log({ params });

      return params.token;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
