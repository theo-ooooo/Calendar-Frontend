import type { LoginResult } from "@/core/usecases/auth/LoginUseCase";

export interface LoginRequest {
	code: string;
	provider: string;
}

export interface IAuthRepository {
	login(request: LoginRequest): Promise<LoginResult>;
	logout(): Promise<void>;
	refresh(refreshToken: string): Promise<LoginResult>;
}
