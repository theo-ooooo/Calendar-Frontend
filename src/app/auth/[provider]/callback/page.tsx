// app/(auth)/callback/page.tsx
"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAuthCallbackViewModel } from "@/presentation/viewmodels/auth/useAuthCallbackVIewModel";

export default function CallbackPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { provider } = useParams();
	const { isLoading, error, handleCallback } = useAuthCallbackViewModel();

	const hasCalledRef = useRef(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (hasCalledRef.current || isLoading) {
			return;
		}
		const code = searchParams.get("code");
		const errorParam = searchParams.get("error");

		if (errorParam) {
			console.error("카카오 로그인 에러:", errorParam);
			return;
		}

		if (provider && code) {
			handleCallback(provider.toString(), code);
		}
	}, [searchParams, provider]);

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-950">
				<div className="text-center text-white">
					<h2 className="text-2xl font-bold mb-4">로그인 실패</h2>
					<p className="text-red-400 mb-4">{error}</p>
					<button
						type="button"
						onClick={() => router.push("/auth/login")}
						className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
					>
						다시 로그인
					</button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-950">
			<div className="text-center text-white">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
				<p className="text-lg">로그인 처리 중...</p>
			</div>
		</div>
	);
}
