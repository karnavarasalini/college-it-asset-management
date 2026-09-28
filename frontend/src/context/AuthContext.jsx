import React, { createContext, useContext, useState } from "react";

const STORAGE_KEY = "college_it_user";

export const AuthContext = createContext(null);

function getStoredUser() {
	try {
		const storedValue = localStorage.getItem(STORAGE_KEY);
		if (!storedValue) return null;

		const userData = JSON.parse(storedValue);
		if (userData && typeof userData === "object" && !Array.isArray(userData)) {
			return userData;
		}
	} catch {
		return null;
	}

	return null;
}

export function AuthProvider({ children }) {
	const [authState, setAuthState] = useState(() => {
		const currentUser = getStoredUser();
		return {
			currentUser,
			isAuthenticated: currentUser !== null,
		};
	});

	function login(userData) {
		if (!userData || typeof userData !== "object" || Array.isArray(userData)) return;

		setAuthState({
			currentUser: userData,
			isAuthenticated: true,
		});

		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
		} catch {
			// Keep the user signed in for this session if browser storage is unavailable.
		}
	}

	function logout() {
		setAuthState({
			currentUser: null,
			isAuthenticated: false,
		});

		try {
			localStorage.removeItem(STORAGE_KEY);
		} catch {
			// The in-memory session is cleared even if browser storage is unavailable.
		}
	}

	const authValue = {
		currentUser: authState.currentUser,
		isAuthenticated: authState.isAuthenticated,
		login,
		logout,
	};

	return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === null) {
		throw new Error("useAuth must be used within an AuthProvider.");
	}
	return context;
}
