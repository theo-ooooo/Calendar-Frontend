import { IUserRepository } from "@/infrastructure/repositories/user/IUserRepository";
import { CurrentUser } from "@/infrastructure/types/User";

export class CurrentUserUsecase {
	constructor(private userRepository: IUserRepository) {}

	async execute(): Promise<CurrentUser> {
		return this.userRepository.currentUser();
	}
}
