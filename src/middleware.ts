import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	const accessToken = request.cookies.get("accessToken")?.value;
	const isAuthenticated = !!accessToken;

	const loginRoutes = pathname.startsWith("/auth");

	const protectedRoutes = !loginRoutes;

	if (protectedRoutes && !isAuthenticated) {
		return NextResponse.redirect(new URL("/auth/login", request.url));
	}

	if (loginRoutes && isAuthenticated) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		/*
		 * 다음 경로들을 제외한 모든 경로에서 미들웨어 실행:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
