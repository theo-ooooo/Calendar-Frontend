export interface CurrentUser {
	id: number;
	uid: string;
	provider: string;
	email: string;
	nickname: string | null;
}
