// import CredentialsProvider from "next-auth/providers/credentials";
// import NextAuth, { DefaultSession, Session } from "next-auth";
// import Moralis from "moralis";
// import { JWT } from "next-auth/jwt";
// import { db } from "src/db";
// import { users } from "src/db/schema";
// import { eq } from "drizzle-orm";

// export default NextAuth({
//   providers: [
//     CredentialsProvider({
//       name: "MoralisAuth",
//       credentials: {
//         message: {
//           label: "Message",
//           type: "text",
//           placeholder: "0x0",
//         },
//         signature: {
//           label: "Signature",
//           type: "text",
//           placeholder: "0x0",
//         },
//       },
//       // TODO: Add the appropriate types
//       //@ts-ignore
//       async authorize(credentials) {
//         try {
//           const { message, signature } = credentials as {
//             message: string;
//             signature: string;
//           };
//           if (!Moralis.Core.isStarted)
//             await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

//           const {
//             raw,
//           } = //@ts-ignore
//             await Moralis.Auth.verify({
//               message,
//               signature,
//               // network: "solana",
//             });

//           const { address, profileId, expirationTime } = raw;
//           const existingUser = await db.query.users.findFirst({
//             where: eq(users.address, address),
//           });
//           if (existingUser) {
//             return {
//               id: existingUser.id,
//               authId: existingUser.authId,
//               username: existingUser.username,
//               fullName: existingUser.fullName,
//               email: existingUser.email,
//               address: existingUser.address,
//               role: existingUser.role,
//               emailVerified: existingUser.emailVerified,
//               userType: existingUser.userType,
//               createdAt: existingUser.createdAt,

//               expirationTime,
//             };
//           }
//           const createdUser = await db.transaction(async (tx) => {
//             const [insertRes] = await tx.insert(users).values({
//               address,
//             });
//             return await tx.query.users.findFirst({
//               where: eq(users.id, insertRes.insertId),
//               columns: {
//                 id: true,
//                 authId: true,
//                 username: true,
//                 fullName: true,
//                 email: true,
//                 address: true,
//                 role: true,
//                 userType: true,
//                 createdAt: true,
//                 emailVerified: true,
//               },
//             });
//           });
//           const user = {
//             ...createdUser,
//             expirationTime,
//           };
//           return user;
//         } catch (e) {
//           console.error({ error: e }, "from authorize");
//           return null;
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     //@ts-ignore
//     async jwt({ token, user }) {
//       try {
//         user && (token.user = user);
//         return token;
//       } catch (error) {
//
//       }
//     },
//     //@ts-ignore
//     async session({ session, token }) {
//       try {
//         // TODO: Add the appropriate types
//         //@ts-ignore
//         session.expires = token.user.expirationTime;
//         //@ts-ignore
//         session.user = token.user;
//         return session;
//       } catch (error) {
//
//       }
//     },
//   },
//   session: {
//     strategy: "jwt",
//   },
//   pages: {
//     signIn: "/signin",
//   },
// });
