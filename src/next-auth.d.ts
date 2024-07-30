// next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

// Extending the `DefaultUser` type to include your custom properties
declare module "next-auth" {
  interface User extends DefaultUser {
    role?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
  }

  interface Session {
    user: {
      _id: any;
      username: any;
      role?: any;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
    } & DefaultSession["user"];
  }

  interface JWT {
    _id: any;
    username: any;
    role?: any;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
  }
}
