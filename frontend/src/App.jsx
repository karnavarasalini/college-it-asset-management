import React, { useState } from "react";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Requests from "./pages/Requests.jsx";
import MyAssets from "./pages/MyAssets.jsx";
import Repairs from "./pages/Repairs.jsx";
import Users from "./pages/Users.jsx";
import { useAuth } from "./context/AuthContext.jsx";

function App() {
	const { currentUser, isAuthenticated, logout } = useAuth();
	const [activePage, setActivePage] = useState("dashboard");

	function handleLogout() {
		logout();
		setActivePage("dashboard");
	}

	if (!isAuthenticated) {
		return <Login />;
	}

	let pageContent = null;
	if (activePage === "assets") pageContent = <MyAssets />;
	if (activePage === "requests") pageContent = <Requests />;
	if (activePage === "repairs") pageContent = <Repairs />;
	if (activePage === "profile") pageContent = <Users onLogout={handleLogout} />;

	return (
		<Dashboard
			activePage={activePage}
			currentUser={currentUser}
			onNavigate={setActivePage}
			onLogout={handleLogout}
		>
			{pageContent}
		</Dashboard>
	);
}

export default App;
