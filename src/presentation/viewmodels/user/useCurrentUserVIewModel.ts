import { CurrentUserUsecase } from "@/core/usecases/user/CurrentUserUsecase";
import { ApiClient } from "@/infrastructure/api/ApiClient";
import { UserRepository } from "@/infrastructure/repositories/user/UserRepository";
import { CurrentUser } from "@/infrastructure/types/User";
import { useState } from "react";

export function useCurrentUserViewModel() {
	const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

	const [currentUserUsecase] = useState(() => {
		const apiClient = new ApiClient();
		const userRepository = new UserRepository(apiClient);
		return new CurrentUserUsecase(userRepository);
	});

	const getCurrentUser = async () => {
		setCurrentUser(await currentUserUsecase.execute());
	};

	return {
		getCurrentUser,
		currentUser,
	};
}
