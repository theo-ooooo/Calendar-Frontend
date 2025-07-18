export class ApiClient {
	private baseURL = process.env.NEXT_PUBLIC_API_URL;

	async request<T = any, K = any>(
		endpoint: string,
		method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
		data?: T,
	): Promise<K> {
		const response = await fetch(`${this.baseURL}${endpoint}`, {
			method,
			headers: this.getHeaders(),
			credentials: "include",
			body: data ? JSON.stringify(data) : undefined,
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			throw new Error(errorData.message || `API Error: ${response.status}`);
		}

		return response.json() as Promise<K>;
	}

	// 편의 메서드들
	get<K = any>(endpoint: string): Promise<K> {
		return this.request<void, K>(endpoint, "GET");
	}

	post<T = any, K = any>(endpoint: string, data?: T): Promise<K> {
		return this.request<T, K>(endpoint, "POST", data);
	}

	put<T = any, K = any>(endpoint: string, data?: T): Promise<K> {
		return this.request<T, K>(endpoint, "PUT", data);
	}

	delete<K = any>(endpoint: string): Promise<K> {
		return this.request<void, K>(endpoint, "DELETE");
	}

	private getHeaders(): HeadersInit {
		const headers: HeadersInit = {
			"Content-Type": "application/json",
		};

		return headers;
	}
}
