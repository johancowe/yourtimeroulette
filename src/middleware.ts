import { withAuth } from "next-auth/middleware"

export default withAuth(
    {
        callbacks: {
            authorized: ({ token }) => !!token
        },
    }
)

export const config = {
    matcher: [
        // Protect all routes except auth pages and static files
        "/((?!api/auth|auth|_next/static|_next/image|favicon.ico).*)",
    ]
}
