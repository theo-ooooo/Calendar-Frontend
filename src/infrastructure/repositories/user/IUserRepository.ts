import type { CurrentUser } from "@/infrastructure/types/User";

export interface IUserRepository {
	currentUser(): Promise<CurrentUser>;
}
