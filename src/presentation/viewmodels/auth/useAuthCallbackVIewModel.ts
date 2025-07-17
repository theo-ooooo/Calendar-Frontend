// presentation/viewmodels/AuthCallbackViewModel.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginUseCase } from "@/core/usecases/auth/LoginUseCase";
import { ApiClient } from "@/infrastructure/api/ApiClient";
import { AuthRepository } from "@/infrastructure/repositories/auth/AuthRepository";
import { AuthDomain } from "@/core/domain/auth/AuthDomain";

export function useAuthCallbackViewModel() {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const [loginUseCase] = useState(() => {
		const apiClient = new ApiClient();
		const authRepository = new AuthRepository(apiClient);
		return new LoginUseCase(authRepository);
	});

	const handleCallback = async (provider: string, code: string) => {
		setIsLoading(true);
		setError(null);

		try {
			const authDomain = new AuthDomain(provider, code);
			const result = await loginUseCase.execute(authDomain);

			// 토큰 저장
			if (typeof window !== "undefined") {
				localStorage.setItem("accessToken", result.accessToken);
				localStorage.setItem("refreshToken", result.refreshToken);
			}

			router.push("/");
		} catch (error) {
			const errorMessage =
				error instanceof Error
					? error.message
					: "로그인 처리 중 오류가 발생했습니다.";
			setError(errorMessage);
			console.error("카카오 콜백 처리 실패:", error);

			setTimeout(() => {
				router.push("/auth/login");
			}, 2000);
		} finally {
			setIsLoading(false);
		}
	};

	return {
		isLoading,
		error,
		handleCallback,
	};
}
