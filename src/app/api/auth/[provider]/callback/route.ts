import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ provider: string }> },
) {
	try {
		const { searchParams } = new URL(request.url);
		const code = searchParams.get("code");
		const { provider } = await params;

		// 코드 검증
		if (!code) {
			console.error("인증 코드가 없습니다");
			return Redirect(request, "/auth/login", "인증 코드가 없습니다");
		}

		//TODO: 서버용 client가 필요할까?
		const backendUrl = process.env.NEXT_PUBLIC_API_URL;

		const response = await fetch(`${backendUrl}/auth/${provider}/callback`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ code }),
		});

		if (!response.ok) {
			return Redirect(request, "백엔드 호출 실패");
		}

		const { data, status, message } = await response.json();

		if (status !== "success") {
			console.log(message);
			return Redirect(request, "/auth/login", "로그인 실패");
		}

		const cookieStore = await cookies();

		cookieStore.set("accessToken", data.accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 60 * 60 * 24, // 1일
			path: "/",
		});

		// Refresh Token 저장 (긴 유효기간)
		cookieStore.set("refreshToken", data.refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 60 * 60 * 24 * 7, // 7일
			path: "/",
		});

		return Redirect(request, "/");
	} catch (error) {
		Redirect(request, "/auth/login", error?.toString());
	}
}

function Redirect(request: NextRequest, movePath: string, error?: string) {
	if (error) {
		console.error("콜백 처리 중 에러:", error);
	}
	return NextResponse.redirect(new URL(movePath, request.url));
}
