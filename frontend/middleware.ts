import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";

// This middleware protects routes that require authentication
export default withAuth(
  function middleware(req: NextRequest) {
    const token = req.nextauth.token;

    // If no token exists, user is not authenticated
    // withAuth will automatically redirect to login
    if (!token) {
      return;
    }

    // Token exists, allow request to proceed
    return;
  },
  {
    callbacks: {
      authorized({ token }) {
        // Return true if user is authorized, false to redirect to login
        return !!token;
      },
    },
    pages: {
      signIn: "/login",
    },
  }
);

// Specify which routes this middleware applies to
export const config = {
  matcher: [
    "/upload/:path*",
    "/dashboard/:path*",
    "/history/:path*",
  ],
};
