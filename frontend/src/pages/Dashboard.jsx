import React from "react";

const summaryCards = [
	{ label: "Total Assigned Assets", value: "08", detail: "Across 4 categories", tone: "green" },
	{ label: "Active Service Requests", value: "03", detail: "2 currently in progress", tone: "blue" },
	{ label: "Pending Repairs", value: "01", detail: "Awaiting technician review", tone: "amber" },
	{ label: "Notifications", value: "02", detail: "Unread updates", tone: "rose" },
];

const requests = [
	{ id: "REQ-2048", asset: "Dell Latitude 5440", issue: "Battery drains quickly", priority: "High", status: "In Progress", date: "Sep 24, 2026" },
	{ id: "REQ-2039", asset: "HP USB-C Dock G5", issue: "External displays not detected", priority: "Normal", status: "Open", date: "Sep 22, 2026" },
	{ id: "REQ-2017", asset: "Logitech Brio 4K", issue: "Camera image flickers", priority: "Low", status: "Resolved", date: "Sep 18, 2026" },
];

const assets = [
	{ name: "Dell Latitude 5440", id: "AST-IT-1048", category: "Laptop", status: "Assigned" },
	{ name: "Dell UltraSharp U2422H", id: "AST-IT-0872", category: "Monitor", status: "Assigned" },
	{ name: "HP USB-C Dock G5", id: "AST-IT-1126", category: "Accessory", status: "Repair" },
];

const notifications = [
	{ title: "Repair request received", detail: "Your docking station repair is awaiting technician review.", time: "Today · 9:42 AM", unread: true },
	{ title: "Request update: REQ-2048", detail: "A technician has started reviewing your laptop battery issue.", time: "Yesterday · 2:15 PM", unread: true },
	{ title: "Equipment check completed", detail: "Your semester equipment check was recorded successfully.", time: "Sep 19 · 11:08 AM", unread: false },
];

const helpItems = [
	{ question: "How do I report an issue?", answer: "Create a service request and select the affected asset." },
	{ question: "Where can I find my asset ID?", answer: "Your assigned equipment and IDs are listed in My Assets." },
];

function Dashboard({ activePage, currentUser, onNavigate, onLogout, children }) {
	const displayName = currentUser?.name || currentUser?.fullName || "College User";
	const displayRole = currentUser?.role || "Member";
	const displayDepartment = currentUser?.department || "Campus IT";
	const initials = displayName
		.split(/\s+/)
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase();

	return (
		<div className="asset-dashboard">
			<style>{`
				.asset-dashboard {
					--dash-forest: #173c30;
					--dash-green: #2c684e;
					--dash-ink: #25312a;
					--dash-muted: #718078;
					--dash-border: #e1e7e1;
					min-height: 100vh;
					min-height: 100svh;
					background: #f3f5f1;
					color: var(--dash-ink);
					font-family: "Segoe UI", Arial, sans-serif;
					font-size: 14px;
				}
				.asset-dashboard * { box-sizing: border-box; }
				.dashboard-shell { display: grid; grid-template-columns: 236px minmax(0, 1fr); min-height: 100vh; min-height: 100svh; }
				.dashboard-sidebar { display: flex; flex-direction: column; padding: 26px 16px 18px; background: var(--dash-forest); color: #f2f6f2; }
				.dashboard-brand { display: flex; align-items: center; gap: 11px; margin: 0 8px 38px; }
				.dashboard-brand-mark { display: grid; width: 36px; height: 36px; flex: 0 0 36px; place-items: center; border: 1px solid #87a994; color: #e4c676; font-family: Georgia, serif; font-size: 13px; }
				.dashboard-brand-copy { min-width: 0; }
				.dashboard-brand-copy strong, .dashboard-brand-copy span { display: block; }
				.dashboard-brand-copy strong { font-size: 12px; letter-spacing: .5px; }
				.dashboard-brand-copy span { margin-top: 4px; color: #b8cec0; font-size: 9px; font-weight: 700; letter-spacing: 1.2px; }
				.dashboard-nav-label { margin: 0 11px 10px; color: #9cb5a5; font-size: 10px; font-weight: 700; letter-spacing: 1.3px; }
				.dashboard-nav { display: grid; gap: 4px; }
				.dashboard-nav button { display: flex; width: 100%; min-height: 42px; align-items: center; gap: 12px; padding: 0 11px; border: 0; border-left: 2px solid transparent; background: transparent; color: #c5d6ca; font: inherit; font-size: 13px; text-align: left; cursor: pointer; }
				.dashboard-nav button:hover, .dashboard-nav button:focus-visible { background: rgb(255 255 255 / 8%); color: #fff; outline: none; }
				.dashboard-nav button.is-active { border-left-color: #e4c676; background: rgb(255 255 255 / 10%); color: #fff; }
				.dashboard-nav-mark { display: grid; width: 19px; height: 19px; flex: 0 0 19px; place-items: center; border: 1px solid #718f7b; color: #e4c676; font-size: 10px; }
				.dashboard-sidebar-foot { margin-top: auto; padding: 18px 10px 0; border-top: 1px solid rgb(255 255 255 / 15%); color: #b8cec0; font-size: 11px; line-height: 1.6; }
				.dashboard-main { min-width: 0; }
				.dashboard-topbar { display: flex; min-height: 78px; align-items: center; justify-content: space-between; gap: 22px; padding: 14px clamp(22px, 3vw, 46px); border-bottom: 1px solid var(--dash-border); background: #fff; }
				.dashboard-app-title { margin: 0; color: #536057; font-size: 14px; font-weight: 600; }
				.dashboard-user-area { display: flex; align-items: center; gap: 18px; }
				.dashboard-profile { display: flex; align-items: center; gap: 10px; }
				.dashboard-avatar { display: grid; width: 38px; height: 38px; place-items: center; border-radius: 50%; background: #e8efe9; color: #28563d; font-family: Georgia, serif; font-size: 13px; }
				.dashboard-profile-copy strong, .dashboard-profile-copy span { display: block; }
				.dashboard-profile-copy strong { color: var(--dash-ink); font-size: 12px; }
				.dashboard-profile-copy span { margin-top: 3px; color: var(--dash-muted); font-size: 11px; }
				.dashboard-logout { min-height: 36px; padding: 0 13px; border: 1px solid #cfd8d0; border-radius: 3px; background: #fff; color: #315b45; font: inherit; font-size: 12px; font-weight: 600; cursor: pointer; }
				.dashboard-logout:hover { border-color: #315b45; background: #f6f9f6; }
				.dashboard-logout:focus-visible, .dashboard-nav button:focus-visible { outline: 3px solid #dfc36f; outline-offset: 2px; }
				.dashboard-content { width: min(100%, 1480px); margin: 0 auto; padding: 32px clamp(22px, 3vw, 46px) 48px; }
				.dashboard-welcome { display: flex; align-items: end; justify-content: space-between; gap: 20px; margin-bottom: 25px; }
				.dashboard-eyebrow { margin: 0 0 8px; color: #76887c; font-size: 10px; font-weight: 700; letter-spacing: 1.4px; }
				.dashboard-welcome h1 { margin: 0; color: var(--dash-forest); font-family: Georgia, "Times New Roman", serif; font-size: 30px; font-weight: 400; }
				.dashboard-welcome p:last-child { margin: 8px 0 0; color: var(--dash-muted); font-size: 13px; }
				.dashboard-date { padding-bottom: 2px; color: #6c7b71; font-size: 12px; white-space: nowrap; }
				.dashboard-summary { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; margin-bottom: 22px; }
				.dashboard-summary-card { min-width: 0; padding: 18px 18px 16px; border: 1px solid var(--dash-border); border-top: 3px solid #6a9878; background: #fff; }
				.dashboard-summary-card.tone-blue { border-top-color: #688ba0; }
				.dashboard-summary-card.tone-amber { border-top-color: #c49a4b; }
				.dashboard-summary-card.tone-rose { border-top-color: #b8756c; }
				.dashboard-summary-card span { display: block; color: #65746a; font-size: 12px; line-height: 1.4; }
				.dashboard-summary-card strong { display: block; margin-top: 13px; color: var(--dash-forest); font-family: Georgia, "Times New Roman", serif; font-size: 30px; font-weight: 400; }
				.dashboard-summary-card small { display: block; margin-top: 5px; color: #87928a; font-size: 10px; }
				.dashboard-section-grid { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(280px, .85fr); gap: 20px; align-items: start; }
				.dashboard-section { min-width: 0; margin-bottom: 20px; border: 1px solid var(--dash-border); background: #fff; }
				.dashboard-section-heading { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 17px 19px; border-bottom: 1px solid #e9ede9; }
				.dashboard-section-heading h2 { margin: 0; color: #2e4437; font-size: 14px; font-weight: 650; }
				.dashboard-section-heading p { margin: 5px 0 0; color: #87928a; font-size: 11px; }
				.dashboard-section-heading a { color: #356b4f; font-size: 11px; font-weight: 600; text-decoration: none; white-space: nowrap; }
				.dashboard-section-heading a:hover { text-decoration: underline; }
				.dashboard-table-wrap { overflow-x: auto; }
				.dashboard-table { width: 100%; border-collapse: collapse; text-align: left; }
				.dashboard-table th { padding: 11px 13px; background: #f8faf7; color: #78857c; font-size: 9px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; white-space: nowrap; }
				.dashboard-table td { padding: 13px; border-top: 1px solid #edf0ed; color: #536057; font-size: 11px; vertical-align: middle; }
				.dashboard-table td:first-child { color: #315c45; font-weight: 650; white-space: nowrap; }
				.dashboard-table td:nth-child(2) { color: #34443a; font-weight: 600; }
				.dashboard-badge { display: inline-block; padding: 4px 7px; border-radius: 2px; background: #edf3ee; color: #40694f; font-size: 9px; font-weight: 700; white-space: nowrap; }
				.dashboard-badge.priority-high { background: #fbefeb; color: #a04c3e; }
				.dashboard-badge.priority-normal { background: #f5f1e5; color: #8d7135; }
				.dashboard-badge.priority-low { background: #eef2f5; color: #5f7687; }
				.dashboard-badge.status-open { background: #f5f1e5; color: #8d7135; }
				.dashboard-badge.status-resolved { background: #edf3ee; color: #40694f; }
				.dashboard-asset-list { padding: 0 18px; }
				.dashboard-asset-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 10px; padding: 14px 0; border-bottom: 1px solid #edf0ed; }
				.dashboard-asset-row:last-child { border-bottom: 0; }
				.dashboard-asset-row strong { display: block; overflow-wrap: anywhere; color: #34443a; font-size: 12px; }
				.dashboard-asset-row span { display: block; margin-top: 5px; color: #818d84; font-size: 10px; }
				.dashboard-asset-meta { text-align: right; }
				.dashboard-asset-meta .dashboard-badge { margin-top: 3px; }
				.dashboard-notification-list { padding: 2px 18px; }
				.dashboard-notification { display: grid; grid-template-columns: 8px minmax(0, 1fr); gap: 11px; padding: 14px 0; border-bottom: 1px solid #edf0ed; }
				.dashboard-notification:last-child { border-bottom: 0; }
				.dashboard-notification-dot { width: 7px; height: 7px; margin-top: 4px; border-radius: 50%; background: transparent; }
				.dashboard-notification-dot.is-unread { background: #c49a4b; }
				.dashboard-notification strong { display: block; color: #34443a; font-size: 11px; }
				.dashboard-notification p { margin: 5px 0; color: #758178; font-size: 10px; line-height: 1.5; }
				.dashboard-notification time { color: #9aa39d; font-size: 9px; }
				.dashboard-help-list { padding: 2px 18px 6px; }
				.dashboard-help-item { padding: 13px 0; border-bottom: 1px solid #edf0ed; }
				.dashboard-help-item:last-child { border: 0; }
				.dashboard-help-item strong { color: #34443a; font-size: 11px; }
				.dashboard-help-item p { margin: 5px 0 0; color: #758178; font-size: 10px; line-height: 1.5; }
				.dashboard-demo-message { margin: 0 0 18px; padding: 10px 13px; border-left: 3px solid #6a9878; background: #eaf2eb; color: #315b45; font-size: 12px; }
				@media (max-width: 1080px) {
					.dashboard-shell { grid-template-columns: 206px minmax(0, 1fr); }
					.dashboard-summary { grid-template-columns: repeat(2, minmax(0, 1fr)); }
					.dashboard-section-grid { grid-template-columns: minmax(0, 1fr); }
				}
				@media (max-width: 700px) {
					.dashboard-shell { display: block; }
					.dashboard-sidebar { padding: 13px 16px 10px; }
					.dashboard-brand { margin: 0 4px 13px; }
					.dashboard-nav-label, .dashboard-sidebar-foot { display: none; }
					.dashboard-nav { display: flex; overflow-x: auto; gap: 5px; padding-bottom: 2px; }
					.dashboard-nav button { width: auto; min-height: 36px; flex: 0 0 auto; gap: 7px; padding: 0 9px; border: 0; border-bottom: 2px solid transparent; font-size: 11px; }
					.dashboard-nav button.is-active { border-bottom-color: #e4c676; }
					.dashboard-nav-mark { width: 17px; height: 17px; flex-basis: 17px; }
					.dashboard-topbar { min-height: 70px; padding: 12px 18px; }
					.dashboard-app-title { max-width: 210px; font-size: 12px; line-height: 1.35; }
					.dashboard-profile-copy span { display: none; }
					.dashboard-user-area { gap: 10px; }
					.dashboard-content { padding: 25px 18px 36px; }
				}
				@media (max-width: 520px) {
					.dashboard-profile-copy { display: none; }
					.dashboard-avatar { width: 34px; height: 34px; }
					.dashboard-logout { min-height: 34px; padding: 0 9px; }
					.dashboard-welcome { align-items: flex-start; flex-direction: column; gap: 8px; }
					.dashboard-welcome h1 { font-size: 26px; }
					.dashboard-summary { gap: 9px; }
					.dashboard-summary-card { padding: 13px; }
					.dashboard-summary-card span { font-size: 10px; }
					.dashboard-summary-card strong { margin-top: 9px; font-size: 26px; }
					.dashboard-section-heading { padding: 14px; }
					.dashboard-table thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; }
					.dashboard-table, .dashboard-table tbody, .dashboard-table tr, .dashboard-table td { display: block; width: 100%; }
					.dashboard-table tr { display: grid; grid-template-columns: 1fr 1fr; gap: 0 12px; padding: 9px 13px; border-top: 1px solid #edf0ed; }
					.dashboard-table td { display: flex; justify-content: space-between; gap: 10px; padding: 6px 0; border: 0; text-align: right; }
					.dashboard-table td::before { content: attr(data-label); color: #87928a; font-size: 9px; font-weight: 600; text-align: left; }
					.dashboard-table td:first-child { grid-column: 1 / -1; justify-content: flex-start; padding-bottom: 2px; text-align: left; }
					.dashboard-table td:first-child::before { content: attr(data-label); min-width: 58px; }
					.dashboard-table td:nth-child(2) { grid-column: 1 / -1; justify-content: flex-start; text-align: left; }
					.dashboard-table td:nth-child(2)::before { min-width: 58px; }
				}
			`}</style>

			<div className="dashboard-shell" id="dashboard">
				<aside className="dashboard-sidebar">
					<div className="dashboard-brand">
						<span className="dashboard-brand-mark" aria-hidden="true">IT</span>
						<div className="dashboard-brand-copy">
							<strong>COLLEGE IT</strong>
							<span>ASSET SERVICES</span>
						</div>
					</div>
					<p className="dashboard-nav-label">WORKSPACE</p>
					<nav className="dashboard-nav" aria-label="Main navigation">
						<button className={activePage === "dashboard" ? "is-active" : ""} type="button" aria-current={activePage === "dashboard" ? "page" : undefined} onClick={() => onNavigate("dashboard")}><span className="dashboard-nav-mark" aria-hidden="true">D</span>Dashboard</button>
						<button className={activePage === "assets" ? "is-active" : ""} type="button" aria-current={activePage === "assets" ? "page" : undefined} onClick={() => onNavigate("assets")}><span className="dashboard-nav-mark" aria-hidden="true">A</span>My Assets</button>
						<button className={activePage === "requests" ? "is-active" : ""} type="button" aria-current={activePage === "requests" ? "page" : undefined} onClick={() => onNavigate("requests")}><span className="dashboard-nav-mark" aria-hidden="true">R</span>Service Requests</button>
						<button className={activePage === "repairs" ? "is-active" : ""} type="button" aria-current={activePage === "repairs" ? "page" : undefined} onClick={() => onNavigate("repairs")}><span className="dashboard-nav-mark" aria-hidden="true">P</span>Repairs</button>
						<button className={activePage === "profile" ? "is-active" : ""} type="button" aria-current={activePage === "profile" ? "page" : undefined} onClick={() => onNavigate("profile")}><span className="dashboard-nav-mark" aria-hidden="true">U</span>My Profile</button>
					</nav>
					<div className="dashboard-sidebar-foot">Technology for teaching, learning, and campus life.</div>
				</aside>

				<div className="dashboard-main">
					<header className="dashboard-topbar">
						<p className="dashboard-app-title">College IT Asset Management System</p>
						<div className="dashboard-user-area" id="profile">
							<div className="dashboard-profile">
								<span className="dashboard-avatar" aria-hidden="true">{initials}</span>
								<div className="dashboard-profile-copy">
									<strong>{displayName}</strong>
									<span>{displayRole} · {displayDepartment}</span>
								</div>
							</div>
							<button className="dashboard-logout" type="button" onClick={onLogout}>Log out</button>
						</div>
					</header>

					{children ? children : (
					<main className="dashboard-content">
						<div className="dashboard-welcome">
							<div>
								<p className="dashboard-eyebrow">YOUR IT WORKSPACE</p>
								<h1>Good morning, {displayName.split(/\s+/)[0]}</h1>
								<p>Here is a quick look at your equipment and support activity.</p>
							</div>
							<time className="dashboard-date" dateTime="2026-09-28">Monday, September 28, 2026</time>
						</div>

						<section className="dashboard-summary" aria-label="Account summary">
							{summaryCards.map((card) => (
								<article className={`dashboard-summary-card tone-${card.tone}`} key={card.label} id={card.tone === "amber" ? "repairs" : undefined}>
									<span>{card.label}</span>
									<strong>{card.value}</strong>
									<small>{card.detail}</small>
								</article>
							))}
						</section>

						<div className="dashboard-section-grid">
							<div>
								<section className="dashboard-section" id="service-requests" aria-labelledby="requests-heading">
									<div className="dashboard-section-heading">
										<div><h2 id="requests-heading">Recent Service Requests</h2><p>Latest activity on your support requests</p></div>
										<a href="#service-requests">View all</a>
									</div>
									<div className="dashboard-table-wrap">
										<table className="dashboard-table">
											<thead><tr><th>Request ID</th><th>Asset</th><th>Issue</th><th>Priority</th><th>Status</th><th>Date</th></tr></thead>
											<tbody>
												{requests.map((request) => (
													<tr key={request.id}>
														<td data-label="Request ID">{request.id}</td>
														<td data-label="Asset">{request.asset}</td>
														<td data-label="Issue">{request.issue}</td>
														<td data-label="Priority"><span className={`dashboard-badge priority-${request.priority.toLowerCase()}`}>{request.priority}</span></td>
														<td data-label="Status"><span className={`dashboard-badge status-${request.status.toLowerCase().replaceAll(" ", "-")}`}>{request.status}</span></td>
														<td data-label="Date">{request.date}</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</section>

								<section className="dashboard-section" id="my-assets" aria-labelledby="assets-heading">
									<div className="dashboard-section-heading">
										<div><h2 id="assets-heading">My Assets</h2><p>Equipment currently assigned to you</p></div>
										<a href="#my-assets">View all</a>
									</div>
									<div className="dashboard-table-wrap">
										<table className="dashboard-table">
											<thead><tr><th>Asset name</th><th>Asset ID</th><th>Category</th><th>Status</th></tr></thead>
											<tbody>
												{assets.map((asset) => (
													<tr key={asset.id}>
														<td data-label="Asset name">{asset.name}</td>
														<td data-label="Asset ID">{asset.id}</td>
														<td data-label="Category">{asset.category}</td>
														<td data-label="Status"><span className={`dashboard-badge ${asset.status === "Repair" ? "priority-normal" : "status-resolved"}`}>{asset.status}</span></td>
													</tr>
												))}
											</tbody>
										</table>
									</div>
								</section>
							</div>

							<div>
								<section className="dashboard-section" id="notifications" aria-labelledby="notifications-heading">
									<div className="dashboard-section-heading">
										<div><h2 id="notifications-heading">Notifications</h2><p>Recent updates for your account</p></div>
									</div>
									<div className="dashboard-notification-list">
										{notifications.map((notification) => (
											<article className="dashboard-notification" key={notification.title}>
												<span className={`dashboard-notification-dot${notification.unread ? " is-unread" : ""}`} aria-hidden="true" />
												<div><strong>{notification.title}</strong><p>{notification.detail}</p><time>{notification.time}</time></div>
											</article>
										))}
									</div>
								</section>

								<section className="dashboard-section" id="help-faq" aria-labelledby="help-heading">
									<div className="dashboard-section-heading">
										<div><h2 id="help-heading">Help &amp; FAQ</h2><p>Quick answers to common questions</p></div>
									</div>
									<div className="dashboard-help-list">
										{helpItems.map((item) => (
											<article className="dashboard-help-item" key={item.question}>
												<strong>{item.question}</strong>
												<p>{item.answer}</p>
											</article>
										))}
									</div>
								</section>
							</div>
						</div>
					</main>
					)}
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
