import React, { useState } from "react";

const assignedAssets = [
	{ id: "AST-IT-1048", name: "Dell Latitude 5440" },
	{ id: "AST-IT-0872", name: "Dell UltraSharp U2422H" },
	{ id: "AST-IT-1126", name: "HP USB-C Dock G5" },
	{ id: "AST-IT-0681", name: "HP LaserJet Pro M404dn" },
];

const issueCategories = [
	"Hardware Problem",
	"Software Problem",
	"Network Problem",
	"Account/Login Problem",
	"Other",
];

const priorities = ["Low", "Medium", "High", "Critical"];
const statuses = ["All", "Pending", "In Progress", "Resolved", "Rejected"];
const REQUEST_STORAGE_KEY = "college_it_requests";

const initialRequests = [
	{
		id: "SR-023",
		asset: "Dell Latitude 5440",
		category: "Hardware Problem",
		priority: "High",
		description: "Battery charge drops quickly during lectures, even when the laptop is asleep.",
		date: "Sep 24, 2026",
		status: "In Progress",
	},
	{
		id: "SR-022",
		asset: "HP USB-C Dock G5",
		category: "Hardware Problem",
		priority: "Medium",
		description: "The external monitor is not detected after reconnecting the dock.",
		date: "Sep 22, 2026",
		status: "Pending",
	},
	{
		id: "SR-019",
		asset: "Dell UltraSharp U2422H",
		category: "Hardware Problem",
		priority: "Low",
		description: "Display flicker was reported and the cable was replaced.",
		date: "Sep 15, 2026",
		status: "Resolved",
	},
	{
		id: "SR-016",
		asset: "HP LaserJet Pro M404dn",
		category: "Network Problem",
		priority: "Medium",
		description: "Printer could not connect to the department network queue.",
		date: "Sep 08, 2026",
		status: "Rejected",
	},
];

const emptyForm = {
	asset: "",
	category: "",
	priority: "",
	description: "",
};

function getSavedRequests() {
	try {
		const savedRequests = sessionStorage.getItem(REQUEST_STORAGE_KEY);
		if (!savedRequests) return initialRequests;

		const parsedRequests = JSON.parse(savedRequests);
		return Array.isArray(parsedRequests) ? parsedRequests : initialRequests;
	} catch {
		return initialRequests;
	}
}

function Requests() {
	const [requests, setRequests] = useState(getSavedRequests);
	const [form, setForm] = useState(emptyForm);
	const [errors, setErrors] = useState({});
	const [successMessage, setSuccessMessage] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("All");

	function handleFieldChange(event) {
		const { name, value } = event.target;
		setForm((currentForm) => ({ ...currentForm, [name]: value }));
		setErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
		setSuccessMessage("");
	}

	function validateForm() {
		const nextErrors = {};
		if (!form.asset) nextErrors.asset = "Select an assigned asset.";
		if (!form.category) nextErrors.category = "Select an issue category.";
		if (!form.priority) nextErrors.priority = "Select a priority.";
		if (!form.description.trim()) nextErrors.description = "Describe the problem before submitting.";
		return nextErrors;
	}

	function handleSubmit(event) {
		event.preventDefault();
		const nextErrors = validateForm();
		setErrors(nextErrors);
		setSuccessMessage("");

		if (Object.keys(nextErrors).length > 0) return;

		const latestNumber = requests.reduce((highest, request) => {
			const requestNumber = Number(request.id.replace("SR-", ""));
			return Math.max(highest, requestNumber);
		}, 0);
		const selectedAsset = assignedAssets.find((asset) => asset.id === form.asset);
		const newRequest = {
			id: `SR-${String(latestNumber + 1).padStart(3, "0")}`,
			asset: selectedAsset.name,
			category: form.category,
			priority: form.priority,
			description: form.description.trim(),
			date: new Date().toLocaleDateString("en-US", {
				month: "short",
				day: "2-digit",
				year: "numeric",
			}),
			status: "Pending",
		};

		const nextRequests = [newRequest, ...requests];
		setRequests(nextRequests);
		try {
			sessionStorage.setItem(REQUEST_STORAGE_KEY, JSON.stringify(nextRequests));
		} catch {
			// The request remains available in React state if browser storage is unavailable.
		}
		setForm(emptyForm);
		setErrors({});
		setSuccessMessage(`${newRequest.id} was created successfully.`);
	}

	function handleReset() {
		setForm(emptyForm);
		setErrors({});
		setSuccessMessage("");
	}

	const normalizedSearch = searchTerm.trim().toLowerCase();
	const filteredRequests = requests.filter((request) => {
		const matchesSearch =
			request.id.toLowerCase().includes(normalizedSearch) ||
			request.asset.toLowerCase().includes(normalizedSearch);
		const matchesStatus = statusFilter === "All" || request.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	return (
		<div className="service-requests-page">
			<style>{`
				.service-requests-page {
					--requests-forest: #173c30;
					--requests-green: #2c684e;
					--requests-ink: #25312a;
					--requests-muted: #718078;
					--requests-border: #e1e7e1;
					min-height: 100vh;
					min-height: 100svh;
					padding: clamp(24px, 4vw, 52px);
					background: #f3f5f1;
					color: var(--requests-ink);
					font-family: "Segoe UI", Arial, sans-serif;
					font-size: 14px;
				}
				.service-requests-page * { box-sizing: border-box; }
				.requests-inner { width: min(100%, 1320px); margin: 0 auto; }
				.requests-page-header { margin-bottom: 24px; }
				.requests-eyebrow { margin: 0 0 8px; color: #76887c; font-size: 10px; font-weight: 700; letter-spacing: 1.4px; }
				.requests-page-header h1 { margin: 0; color: var(--requests-forest); font-family: Georgia, "Times New Roman", serif; font-size: 34px; font-weight: 400; }
				.requests-page-header p:last-child { margin: 8px 0 0; color: var(--requests-muted); font-size: 13px; }
				.requests-form-section, .requests-list-section { border: 1px solid var(--requests-border); background: #fff; }
				.requests-form-section { margin-bottom: 22px; }
				.requests-section-header { padding: 18px 20px; border-bottom: 1px solid #e9ede9; }
				.requests-section-header h2 { margin: 0; color: #2e4437; font-size: 15px; font-weight: 650; }
				.requests-section-header p { margin: 5px 0 0; color: #87928a; font-size: 11px; }
				.requests-form { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; padding: 20px; }
				.requests-field { display: grid; align-content: start; gap: 7px; min-width: 0; }
				.requests-field label { color: #536057; font-size: 11px; font-weight: 650; }
				.requests-field input, .requests-field select, .requests-field textarea,
				.requests-filter-control input, .requests-filter-control select {
					width: 100%;
					min-height: 42px;
					padding: 0 12px;
					border: 1px solid #cfd8d0;
					border-radius: 3px;
					background: #fff;
					color: #25312a;
					font: inherit;
					font-size: 12px;
				}
				.requests-field textarea { min-height: 96px; padding: 11px 12px; resize: vertical; line-height: 1.5; }
				.requests-field input:focus, .requests-field select:focus, .requests-field textarea:focus,
				.requests-filter-control input:focus, .requests-filter-control select:focus,
				.requests-button:focus-visible {
					border-color: #3a725c;
					outline: 3px solid rgb(58 114 92 / 16%);
					outline-offset: 1px;
				}
				.requests-field [aria-invalid="true"] { border-color: #b34239; }
				.requests-description-field { grid-column: 1 / -1; }
				.requests-field-error { margin: 0; color: #a2342b; font-size: 11px; line-height: 1.4; }
				.requests-form-footer { display: flex; grid-column: 1 / -1; align-items: center; justify-content: space-between; gap: 14px; }
				.requests-form-actions { display: flex; flex-wrap: wrap; gap: 9px; }
				.requests-button { min-height: 40px; padding: 0 15px; border: 1px solid transparent; border-radius: 3px; font: inherit; font-size: 12px; font-weight: 650; cursor: pointer; }
				.requests-button-primary { background: #245541; color: #fff; }
				.requests-button-primary:hover { background: #193f30; }
				.requests-button-secondary { border-color: #cfd8d0; background: #fff; color: #536057; }
				.requests-button-secondary:hover { background: #f6f8f6; }
				.requests-form-message { grid-column: 1 / -1; margin: 0; padding: 11px 13px; border-left: 3px solid #4d805c; background: #edf5ed; color: #28563c; font-size: 12px; }
				.requests-filter-bar { display: flex; align-items: end; gap: 13px; padding: 16px 20px; border-bottom: 1px solid #edf0ed; }
				.requests-filter-control { display: grid; gap: 7px; }
				.requests-filter-control label { color: #536057; font-size: 11px; font-weight: 650; }
				.requests-search-control { width: min(100%, 390px); }
				.requests-status-control { width: 190px; }
				.requests-result-count { margin: 0 0 12px auto; color: #768178; font-size: 11px; }
				.requests-list { display: grid; gap: 12px; padding: 16px 20px 20px; }
				.request-card { min-width: 0; padding: 16px; border: 1px solid #e5ebe5; background: #fff; }
				.request-card-header { display: flex; align-items: start; justify-content: space-between; gap: 14px; }
				.request-card-title { min-width: 0; }
				.request-card-title span { display: block; margin-bottom: 5px; color: #718078; font-size: 10px; font-weight: 700; letter-spacing: .5px; }
				.request-card-title h3 { margin: 0; color: #304339; font-size: 14px; line-height: 1.4; overflow-wrap: anywhere; }
				.request-card-description { margin: 12px 0 15px; color: #657269; font-size: 12px; line-height: 1.55; overflow-wrap: anywhere; }
				.request-card-meta { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 13px; padding-top: 13px; border-top: 1px solid #edf0ed; }
				.request-card-meta span { display: block; margin-bottom: 5px; color: #87928a; font-size: 9px; font-weight: 700; letter-spacing: .4px; text-transform: uppercase; }
				.request-card-meta strong { display: block; color: #536057; font-size: 11px; font-weight: 600; overflow-wrap: anywhere; }
				.request-badge { display: inline-block; padding: 5px 8px; border-radius: 2px; background: #edf3ee; color: #40694f; font-size: 9px; font-weight: 700; white-space: nowrap; }
				.request-badge.priority-low { background: #eef2f5; color: #5f7687; }
				.request-badge.priority-medium { background: #f5f1e5; color: #8d7135; }
				.request-badge.priority-high, .request-badge.priority-critical { background: #fbefeb; color: #a04c3e; }
				.request-badge.status-in-progress { background: #eef2f5; color: #526f80; }
				.request-badge.status-resolved { background: #edf3ee; color: #40694f; }
				.request-badge.status-rejected { background: #f5eded; color: #8d5650; }
				.requests-empty { padding: 42px 20px; color: #69766d; text-align: center; }
				.requests-empty strong { display: block; margin-bottom: 6px; color: #34443a; font-size: 14px; }
				@media (max-width: 760px) {
					.service-requests-page { padding: 28px 18px; }
					.requests-form { grid-template-columns: repeat(2, minmax(0, 1fr)); }
					.requests-filter-bar { align-items: stretch; flex-wrap: wrap; }
					.requests-search-control { width: 100%; }
					.requests-status-control { width: min(100%, 230px); }
					.requests-result-count { width: 100%; margin: 2px 0 0; }
				}
				@media (max-width: 520px) {
					.requests-page-header h1 { font-size: 29px; }
					.requests-form { grid-template-columns: 1fr; padding: 16px; }
					.requests-description-field, .requests-form-footer, .requests-form-message { grid-column: auto; }
					.requests-form-footer { align-items: flex-start; flex-direction: column; }
					.requests-form-actions { width: 100%; }
					.requests-button { flex: 1; }
					.requests-section-header, .requests-filter-bar { padding: 15px 16px; }
					.requests-list { padding: 13px; }
					.request-card { padding: 14px; }
					.request-card-meta { grid-template-columns: repeat(2, minmax(0, 1fr)); row-gap: 14px; }
				}
			`}</style>

			<main className="requests-inner">
				<header className="requests-page-header">
					<p className="requests-eyebrow">IT SUPPORT</p>
					<h1>Service Requests</h1>
					<p>Report an issue with your equipment and follow its progress.</p>
				</header>

				<section className="requests-form-section" aria-labelledby="create-request-heading">
					<div className="requests-section-header">
						<h2 id="create-request-heading">Create New Request</h2>
						<p>Provide a few details so the IT team can help.</p>
					</div>
					<form className="requests-form" onSubmit={handleSubmit} noValidate>
						<div className="requests-field">
							<label htmlFor="request-asset">Assigned asset</label>
							<select id="request-asset" name="asset" value={form.asset} onChange={handleFieldChange} aria-invalid={Boolean(errors.asset)} aria-describedby={errors.asset ? "request-asset-error" : undefined}>
								<option value="">Select an asset</option>
								{assignedAssets.map((asset) => <option key={asset.id} value={asset.id}>{asset.name} ({asset.id})</option>)}
							</select>
							{errors.asset && <p className="requests-field-error" id="request-asset-error">{errors.asset}</p>}
						</div>

						<div className="requests-field">
							<label htmlFor="request-category">Issue category</label>
							<select id="request-category" name="category" value={form.category} onChange={handleFieldChange} aria-invalid={Boolean(errors.category)} aria-describedby={errors.category ? "request-category-error" : undefined}>
								<option value="">Select a category</option>
								{issueCategories.map((category) => <option key={category} value={category}>{category}</option>)}
							</select>
							{errors.category && <p className="requests-field-error" id="request-category-error">{errors.category}</p>}
						</div>

						<div className="requests-field">
							<label htmlFor="request-priority">Priority</label>
							<select id="request-priority" name="priority" value={form.priority} onChange={handleFieldChange} aria-invalid={Boolean(errors.priority)} aria-describedby={errors.priority ? "request-priority-error" : undefined}>
								<option value="">Select priority</option>
								{priorities.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
							</select>
							{errors.priority && <p className="requests-field-error" id="request-priority-error">{errors.priority}</p>}
						</div>

						<div className="requests-field requests-description-field">
							<label htmlFor="request-description">Problem description</label>
							<textarea id="request-description" name="description" placeholder="Describe what happened and any steps you have already tried." value={form.description} onChange={handleFieldChange} aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? "request-description-error" : undefined} />
							{errors.description && <p className="requests-field-error" id="request-description-error">{errors.description}</p>}
						</div>

						{successMessage && <p className="requests-form-message" role="status">{successMessage}</p>}
						<div className="requests-form-footer">
							<span className="requests-eyebrow">All fields are required</span>
							<div className="requests-form-actions">
								<button className="requests-button requests-button-secondary" type="button" onClick={handleReset}>Clear / Reset</button>
								<button className="requests-button requests-button-primary" type="submit">Submit Request</button>
							</div>
						</div>
					</form>
				</section>

				<section className="requests-list-section" aria-labelledby="my-requests-heading">
					<div className="requests-section-header">
						<h2 id="my-requests-heading">My Requests</h2>
						<p>Review recent and active requests for your account.</p>
					</div>
					<div className="requests-filter-bar">
						<div className="requests-filter-control requests-search-control">
							<label htmlFor="request-search">Search requests</label>
							<input id="request-search" type="search" placeholder="Search by request ID or asset name" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
						</div>
						<div className="requests-filter-control requests-status-control">
							<label htmlFor="request-status-filter">Status</label>
							<select id="request-status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
								{statuses.map((status) => <option key={status} value={status}>{status}</option>)}
							</select>
						</div>
						<p className="requests-result-count" aria-live="polite">Showing {filteredRequests.length} of {requests.length} requests</p>
					</div>

					{filteredRequests.length > 0 ? (
						<div className="requests-list">
							{filteredRequests.map((request) => (
								<article className="request-card" key={request.id}>
									<div className="request-card-header">
										<div className="request-card-title">
											<span>{request.id} · {request.date}</span>
											<h3>{request.asset}</h3>
										</div>
										<span className={`request-badge status-${request.status.toLowerCase().replaceAll(" ", "-")}`}>{request.status}</span>
									</div>
									<p className="request-card-description">{request.description}</p>
									<div className="request-card-meta">
										<div><span>Issue</span><strong>{request.category}</strong></div>
										<div><span>Priority</span><strong><span className={`request-badge priority-${request.priority.toLowerCase()}`}>{request.priority}</span></strong></div>
									</div>
								</article>
							))}
						</div>
					) : (
						<div className="requests-empty" role="status">
							<strong>No matching requests</strong>
							<span>Try a different request ID, asset name, or status.</span>
						</div>
					)}
				</section>
			</main>
		</div>
	);
}

export default Requests;
