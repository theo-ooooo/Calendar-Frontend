import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
	let accessToken = request.cookies.get("accessToken")?.value;
	let refreshToken = request.cookies.get("refreshToken")?.value;

	const isLoginPage = !!request.nextUrl.pathname.startsWith("/auth");

	// 이미 로그인 페이지에 있고 토큰이 없다면 그대로 진행
	if (isLoginPage && !refreshToken) {
		return NextResponse.next();
	}

	// 로그인 페이지가 아닌데 리프레쉬 토큰이 없다면, 로그인 페이지로
	if (!refreshToken && !isLoginPage) {
		return NextResponse.redirect(new URL("/auth/login", request.url));
	}

	// 액세스 토큰이 없다면 재 발급
	if (!accessToken) {
		const refreshResponse = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/auth/token/refresh`,
			{
				method: "POST",
				headers: new Headers({
					"X-Refresh-Token": refreshToken ?? "",
				}),
			},
		);

		console.log(refreshResponse.ok, refreshToken);

		if (refreshResponse.ok) {
			const { data, status } = await refreshResponse.json();

			const response = NextResponse.next();
			if (status === "success") {
				accessToken = data.accessToken;
				refreshToken = data.refreshToken;

				response.cookies.set("accessToken", data.accessToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					maxAge: 60 * 60 * 24, // 1일
					path: "/",
				});

				// Refresh Token 저장 (긴 유효기간)
				response.cookies.set("refreshToken", data.refreshToken, {
					httpOnly: true,
					secure: process.env.NODE_ENV === "production",
					maxAge: 60 * 60 * 24 * 7, // 7일
					path: "/",
				});

				response.headers.set("Authorization", `Bearer ${accessToken}`);
			} else {
				response.cookies.delete("refreshToken");
			}
			if (isLoginPage) {
				return NextResponse.redirect(new URL("/", request.url));
			}
			return response;
		}
	}

	if (isLoginPage) {
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
