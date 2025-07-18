export interface LoginRequest {
	code: string;
	provider: string;
}

export interface LoginResult {
	accessToken: string;
	refreshToken: string;
}
