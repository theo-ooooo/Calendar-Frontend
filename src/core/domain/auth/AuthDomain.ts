export class AuthDomain {
	constructor(
		private provider: string,
		private code?: string | undefined,
	) {}

	validate() {
		if (!this.provider) {
			throw new Error("Provider is required");
		}

		if (this.provider === "kakao" && this.code) {
			return true;
		}

		throw new Error("Invalid provider or code");
	}

	getProvider() {
		return this.provider;
	}

	getCode() {
		return this.code;
	}
}
