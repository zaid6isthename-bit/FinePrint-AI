import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
      firstName?: string;
      lastName?: string;
    };
    accessToken?: string;
  }

  interface User {
    firstName?: string;
    lastName?: string;
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    firstName?: string;
    lastName?: string;
    accessToken?: string;
  }
}
