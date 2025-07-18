import type { AuthDomain } from "@/core/domain/auth/AuthDomain";
import type { IAuthRepository } from "@/infrastructure/repositories/auth/IAuthRepository";
import type { LoginResult } from "@/infrastructure/types/Auth";

export class LoginUsecase {
	constructor(private authRepository: IAuthRepository) {}

	async execute(authDomain: AuthDomain): Promise<LoginResult> {
		if (!authDomain.validate()) {
			throw new Error("유효하지 않은 인증정보 입니다.");
		}
		const result = await this.authRepository.login({
			code: authDomain.getCode() as string,
			provider: authDomain.getProvider(),
		});

		return result;
	}
}
