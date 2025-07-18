import type { ApiClient } from "@/infrastructure/api/ApiClient";
import type { IUserRepository } from "./IUserRepository";
import type { CurrentUser } from "@/infrastructure/types/User";
import type { GlobalResponse } from "@/shared/types/response";

export class UserRepository implements IUserRepository {
	constructor(private apiClient: ApiClient) {}

	async currentUser(): Promise<CurrentUser> {
		const response =
			await this.apiClient.get<GlobalResponse<CurrentUser>>("/users/me");

		if (response.status !== "success") {
			throw new Error(response.message);
		}

		return response.data;
	}
}
