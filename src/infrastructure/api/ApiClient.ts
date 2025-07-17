export class ApiClient {
	private baseURL = process.env.NEXT_PUBLIC_API_URL;

	async get(endpoint: string) {
		const response = await fetch(`${this.baseURL}${endpoint}`, {
			method: "GET",
			headers: this.getHeaders(),
		});

		if (!response.ok) {
			throw new Error(`API Error: ${response.status}`);
		}

		return response.json();
	}

	async post<T, K>(endpoint: string, data?: T): Promise<K> {
		const response = await fetch(`${this.baseURL}${endpoint}`, {
			method: "POST",
			headers: this.getHeaders(),
			body: data ? JSON.stringify(data) : undefined,
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.message || `API Error: ${response.status}`);
		}

		return response.json() as Promise<K>;
	}

	async put<T, K>(endpoint: string, data?: T): Promise<K> {
		const response = await fetch(`${this.baseURL}${endpoint}`, {
			method: "PUT",
			headers: this.getHeaders(),
			body: data ? JSON.stringify(data) : undefined,
		});

		if (!response.ok) {
			throw new Error(`API Error: ${response.status}`);
		}

		return response.json() as Promise<K>;
	}

	async delete<K>(endpoint: string): Promise<K> {
		const response = await fetch(`${this.baseURL}${endpoint}`, {
			method: "DELETE",
			headers: this.getHeaders(),
		});

		if (!response.ok) {
			throw new Error(`API Error: ${response.status}`);
		}

		return response.json();
	}

	private getHeaders(): HeadersInit {
		const headers: HeadersInit = {
			"Content-Type": "application/json",
		};

		const token = this.getToken();
		if (token) {
			headers["Authorization"] = `Bearer ${token}`;
		}

		return headers;
	}

	private getToken(): string | null {
		if (typeof window !== "undefined") {
			return localStorage.getItem("accessToken");
		}
		return null;
	}
}
