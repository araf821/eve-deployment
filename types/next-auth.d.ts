import type {
  Session as NextAuthSession,
  User as NextAuthUser,
} from "next-auth";

declare module "next-auth" {
  interface Session extends NextAuthSession {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User extends NextAuthUser {
    id: string;
  }
}
