import type { LoginResult } from "@/core/usecases/auth/LoginUseCase";
import type { IAuthRepository, LoginRequest } from "./IAuthRepository";
import type { ApiClient } from "@/infrastructure/api/ApiClient";
import type { GlobalResponse } from "@/shared/types/response";

export class AuthRepository implements IAuthRepository {
	constructor(private apiClient: ApiClient) {}

	async login(request: LoginRequest): Promise<LoginResult> {
		const response = await this.apiClient.post<
			{ code: string },
			GlobalResponse<LoginResult>
		>(`/auth/${request.provider}/callback`, { code: request.code });

		if (response.status !== "success") {
			throw new Error("로그인이 실패하였습니다.");
		}

		console.log("response", response);

		return {
			accessToken: response.data.accessToken,
			refreshToken: response.data.refreshToken,
		};
	}

	async logout(): Promise<void> {
		await this.apiClient.post<void, void>("/auth/logout", undefined);
	}

	async refresh(refreshToken: string): Promise<LoginResult> {
		const response = await this.apiClient.post<
			{ refreshToken: string },
			LoginResult
		>("/auth/refresh", { refreshToken });
		return response;
	}
}
