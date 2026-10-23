const DEFAULT_API_BASE_URL = "http://localhost:5000/api";
const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = (configuredBaseUrl?.trim() || DEFAULT_API_BASE_URL).replace(/\/+$/, "");

const ENDPOINTS = {
	login: "/auth/login",
	dashboard: "/dashboard",
	myAssets: "/assets",
	requests: "/requests",
	repairs: "/repairs",
	userProfile: "/users/profile",
};

async function parseResponse(response) {
	if (response.status === 204) return null;

	const responseText = await response.text();
	if (!responseText) return null;

	try {
		return JSON.parse(responseText);
	} catch {
		return responseText;
	}
}

export async function apiRequest(endpoint, options = {}) {
	const normalizedEndpoint = endpoint.replace(/^\/+/, "");
	const url = `${API_BASE_URL}/${normalizedEndpoint}`;
	const headers = new Headers(options.headers);
	const hasBody = options.body !== undefined && options.body !== null;
	const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

	if (hasBody && !isFormData && !headers.has("Content-Type")) {
		headers.set("Content-Type", "application/json");
	}

	const response = await fetch(url, {
		...options,
		headers,
	});
	const responseData = await parseResponse(response);

	if (!response.ok) {
		const responseMessage =
			responseData && typeof responseData === "object"
				? responseData.message || responseData.error
				: responseData;
		const errorMessage =
			typeof responseMessage === "string" && responseMessage.trim()
				? responseMessage
				: `Request failed with status ${response.status}`;

		throw new Error(errorMessage);
	}

	return responseData;
}

export function loginUser(userData) {
	return apiRequest(ENDPOINTS.login, {
		method: "POST",
		body: JSON.stringify(userData),
	});
}

export function getDashboard() {
	return apiRequest(ENDPOINTS.dashboard, { method: "GET" });
}

export function getMyAssets() {
	return apiRequest(ENDPOINTS.myAssets, { method: "GET" });
}

export function getRequests() {
	return apiRequest(ENDPOINTS.requests, { method: "GET" });
}

export function createRequest(requestData) {
	return apiRequest(ENDPOINTS.requests, {
		method: "POST",
		body: JSON.stringify(requestData),
	});
}

export function getRepairs() {
	return apiRequest(ENDPOINTS.repairs, { method: "GET" });
}

export function getUserProfile() {
	return apiRequest(ENDPOINTS.userProfile, { method: "GET" });
}

export function updateUserProfile(profileData) {
	return apiRequest(ENDPOINTS.userProfile, {
		method: "PUT",
		body: JSON.stringify(profileData),
	});
}
