import React, { useState } from "react";

const sampleRepairs = [
	{
		repairId: "RPR-042",
		assetId: "AST-IT-1126",
		assetName: "HP USB-C Dock G5",
		issue: "External monitors disconnect intermittently when the dock is moved.",
		submittedDate: "Sep 23, 2026",
		expectedCompletionDate: "Sep 30, 2026",
		technician: "Morgan Chen",
		status: "Under Repair",
	},
	{
		repairId: "RPR-041",
		assetId: "AST-IT-1048",
		assetName: "Dell Latitude 5440",
		issue: "Battery holds less than one hour of charge during normal use.",
		submittedDate: "Sep 24, 2026",
		expectedCompletionDate: "Oct 01, 2026",
		technician: "Avery Patel",
		status: "Pending",
	},
	{
		repairId: "RPR-039",
		assetId: "AST-IT-0872",
		assetName: "Dell UltraSharp U2422H",
		issue: "Display flickers after warming up; cable replacement did not resolve it.",
		submittedDate: "Sep 16, 2026",
		expectedCompletionDate: "Sep 25, 2026",
		technician: "Morgan Chen",
		status: "Completed",
	},
	{
		repairId: "RPR-036",
		assetId: "AST-IT-0681",
		assetName: "HP LaserJet Pro M404dn",
		issue: "Paper feed rollers were replaced and the printer passed a test run.",
		submittedDate: "Sep 08, 2026",
		expectedCompletionDate: "Sep 12, 2026",
		technician: "Jordan Rivera",
		status: "Completed",
	},
	{
		repairId: "RPR-031",
		assetId: "AST-IT-0914",
		assetName: "Logitech MX Keys Mini",
		issue: "Key input issue could not be reproduced during the initial inspection.",
		submittedDate: "Aug 28, 2026",
		expectedCompletionDate: "Sep 04, 2026",
		technician: "Avery Patel",
		status: "Cancelled",
	},
];

const repairStatuses = ["All", "Pending", "Under Repair", "Completed", "Cancelled"];

function Repairs() {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("All");
	const [selectedRepair, setSelectedRepair] = useState(null);

	const normalizedSearch = searchTerm.trim().toLowerCase();
	const filteredRepairs = sampleRepairs.filter((repair) => {
		const matchesSearch = [repair.repairId, repair.assetId, repair.assetName]
			.some((value) => value.toLowerCase().includes(normalizedSearch));
		const matchesStatus = statusFilter === "All" || repair.status === statusFilter;
		return matchesSearch && matchesStatus;
	});

	function toggleRepairDetails(repair) {
		setSelectedRepair((currentRepair) =>
			currentRepair?.repairId === repair.repairId ? null : repair,
		);
	}

	return (
		<div className="repairs-page">
			<style>{`
				.repairs-page {
					--repairs-forest: #173c30;
					--repairs-ink: #25312a;
					--repairs-muted: #718078;
					--repairs-border: #e1e7e1;
					min-height: 100vh;
					min-height: 100svh;
					padding: clamp(24px, 4vw, 52px);
					background: #f3f5f1;
					color: var(--repairs-ink);
					font-family: "Segoe UI", Arial, sans-serif;
					font-size: 14px;
				}
				.repairs-page * { box-sizing: border-box; }
				.repairs-inner { width: min(100%, 1320px); margin: 0 auto; }
				.repairs-header { display: flex; align-items: end; justify-content: space-between; gap: 20px; margin-bottom: 24px; }
				.repairs-eyebrow { margin: 0 0 8px; color: #76887c; font-size: 10px; font-weight: 700; letter-spacing: 1.4px; }
				.repairs-header h1 { margin: 0; color: var(--repairs-forest); font-family: Georgia, "Times New Roman", serif; font-size: 34px; font-weight: 400; }
				.repairs-header p:last-child { margin: 8px 0 0; color: var(--repairs-muted); font-size: 13px; }
				.repairs-count { flex: 0 0 auto; padding: 8px 11px; border: 1px solid #dce4dc; background: #fff; color: #53695a; font-size: 11px; }
				.repairs-panel { border: 1px solid var(--repairs-border); background: #fff; }
				.repairs-toolbar { display: flex; align-items: end; gap: 14px; padding: 18px; border-bottom: 1px solid #e9ede9; }
				.repairs-control { display: grid; gap: 7px; }
				.repairs-control label { color: #536057; font-size: 11px; font-weight: 650; }
				.repairs-search-control { width: min(100%, 400px); }
				.repairs-search, .repairs-select {
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
				.repairs-search:focus, .repairs-select:focus, .repair-details-toggle:focus-visible, .repair-details-close:focus-visible {
					border-color: #3a725c;
					outline: 3px solid rgb(58 114 92 / 16%);
					outline-offset: 1px;
				}
				.repairs-status-control { width: 190px; }
				.repairs-results-count { margin: 0 0 12px auto; color: #768178; font-size: 11px; }
				.repair-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; padding: 18px; }
				.repair-card { min-width: 0; padding: 17px; border: 1px solid #e5ebe5; background: #fff; }
				.repair-card-heading { display: flex; align-items: start; justify-content: space-between; gap: 12px; }
				.repair-card-id { display: block; margin-bottom: 7px; color: #758279; font-size: 10px; font-weight: 700; letter-spacing: .5px; }
				.repair-card-heading h2 { margin: 0; color: #304339; font-size: 14px; line-height: 1.4; overflow-wrap: anywhere; }
				.repair-asset-id { display: block; margin-top: 5px; color: #77847b; font-size: 10px; }
				.repair-status { display: inline-block; flex: 0 0 auto; padding: 5px 8px; border-radius: 2px; background: #f5f1e5; color: #8d7135; font-size: 9px; font-weight: 700; white-space: nowrap; }
				.repair-status.status-under-repair { background: #eef2f5; color: #526f80; }
				.repair-status.status-completed { background: #edf3ee; color: #40694f; }
				.repair-status.status-cancelled { background: #f5eded; color: #8d5650; }
				.repair-card-issue { margin: 14px 0; color: #5e6b62; font-size: 12px; line-height: 1.55; }
				.repair-card-meta { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; padding-top: 12px; border-top: 1px solid #edf0ed; }
				.repair-card-meta span { display: block; margin-bottom: 5px; color: #87928a; font-size: 9px; font-weight: 700; letter-spacing: .4px; text-transform: uppercase; }
				.repair-card-meta strong { display: block; color: #536057; font-size: 10px; font-weight: 600; overflow-wrap: anywhere; }
				.repair-details-toggle { min-height: 34px; margin-top: 14px; padding: 0 10px; border: 1px solid #cad8cd; border-radius: 3px; background: #fff; color: #315f4b; font: inherit; font-size: 10px; font-weight: 650; cursor: pointer; }
				.repair-details-toggle:hover { border-color: #315f4b; background: #f4f8f4; }
				.repairs-empty { padding: 42px 20px; color: #69766d; text-align: center; }
				.repairs-empty strong { display: block; margin-bottom: 6px; color: #34443a; font-size: 14px; }
				.repair-details { margin: 0 18px 18px; padding: 19px; border: 1px solid #dce5dd; border-left: 3px solid #588366; background: #fbfcfa; }
				.repair-details-header { display: flex; align-items: start; justify-content: space-between; gap: 14px; margin-bottom: 16px; }
				.repair-details-header p { margin: 0 0 5px; color: #76887c; font-size: 9px; font-weight: 700; letter-spacing: 1.2px; }
				.repair-details-header h2 { margin: 0; color: var(--repairs-forest); font-family: Georgia, "Times New Roman", serif; font-size: 20px; font-weight: 400; }
				.repair-details-close { width: 34px; height: 34px; border: 1px solid #d7ded8; border-radius: 3px; background: #fff; color: #506057; font: inherit; font-size: 18px; cursor: pointer; }
				.repair-details-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
				.repair-details-grid div { min-width: 0; }
				.repair-details-grid span { display: block; margin-bottom: 5px; color: #839087; font-size: 9px; font-weight: 700; letter-spacing: .4px; text-transform: uppercase; }
				.repair-details-grid strong { display: block; color: #3a493f; font-size: 11px; font-weight: 600; line-height: 1.5; overflow-wrap: anywhere; }
				@media (max-width: 900px) {
					.repair-list { grid-template-columns: 1fr; }
					.repair-details-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
				}
				@media (max-width: 650px) {
					.repairs-page { padding: 28px 18px; }
					.repairs-header { align-items: flex-start; flex-direction: column; gap: 14px; }
					.repairs-toolbar { align-items: stretch; flex-wrap: wrap; padding: 14px; }
					.repairs-search-control, .repairs-status-control { width: 100%; }
					.repairs-results-count { width: 100%; margin: 2px 0 0; }
					.repair-list { padding: 13px; }
					.repair-card { padding: 14px; }
					.repair-card-meta { grid-template-columns: repeat(2, minmax(0, 1fr)); }
					.repair-details { margin: 0 13px 13px; padding: 15px; }
					.repair-details-grid { gap: 12px; }
				}
				@media (max-width: 380px) {
					.repair-card-heading { flex-direction: column; }
					.repair-details-grid { grid-template-columns: 1fr; }
				}
			`}</style>

			<main className="repairs-inner">
				<header className="repairs-header">
					<div>
						<p className="repairs-eyebrow">EQUIPMENT SUPPORT</p>
						<h1>Repairs</h1>
						<p>Track the repair status of your assigned IT assets.</p>
					</div>
					<span className="repairs-count">{sampleRepairs.length} repair records</span>
				</header>

				<section className="repairs-panel" aria-label="Repair records">
					<div className="repairs-toolbar">
						<div className="repairs-control repairs-search-control">
							<label htmlFor="repair-search">Search repairs</label>
							<input
								className="repairs-search"
								id="repair-search"
								type="search"
								placeholder="Repair ID, asset ID, or asset name"
								value={searchTerm}
								onChange={(event) => setSearchTerm(event.target.value)}
							/>
						</div>
						<div className="repairs-control repairs-status-control">
							<label htmlFor="repair-status-filter">Status</label>
							<select className="repairs-select" id="repair-status-filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
								{repairStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
							</select>
						</div>
						<p className="repairs-results-count" aria-live="polite">Showing {filteredRepairs.length} of {sampleRepairs.length} repairs</p>
					</div>

					{filteredRepairs.length > 0 ? (
						<div className="repair-list">
							{filteredRepairs.map((repair) => {
								const isSelected = selectedRepair?.repairId === repair.repairId;
								return (
									<article className="repair-card" key={repair.repairId}>
										<div className="repair-card-heading">
											<div>
												<span className="repair-card-id">{repair.repairId}</span>
												<h2>{repair.assetName}</h2>
												<span className="repair-asset-id">Asset ID: {repair.assetId}</span>
												</div>
											<span className={`repair-status status-${repair.status.toLowerCase().replaceAll(" ", "-")}`}>{repair.status}</span>
										</div>
										<p className="repair-card-issue">{repair.issue}</p>
										<div className="repair-card-meta">
											<div><span>Submitted</span><strong>{repair.submittedDate}</strong></div>
											<div><span>Expected completion</span><strong>{repair.expectedCompletionDate}</strong></div>
											<div><span>Technician</span><strong>{repair.technician}</strong></div>
										</div>
										<button className="repair-details-toggle" type="button" aria-expanded={isSelected} aria-controls="repair-details-panel" onClick={() => toggleRepairDetails(repair)}>
											{isSelected ? "Hide Details" : "View Details"}
										</button>
									</article>
								);
							})}
						</div>
					) : (
						<div className="repairs-empty" role="status">
							<strong>No matching repair records</strong>
							<span>Try a different repair ID, asset, or status.</span>
						</div>
					)}

					{selectedRepair && (
						<section className="repair-details" id="repair-details-panel" aria-labelledby="repair-details-title" aria-live="polite">
							<div className="repair-details-header">
								<div>
									<p>REPAIR DETAILS · {selectedRepair.repairId}</p>
									<h2 id="repair-details-title">{selectedRepair.assetName}</h2>
								</div>
								<button className="repair-details-close" type="button" aria-label="Close repair details" onClick={() => setSelectedRepair(null)}>×</button>
							</div>
							<div className="repair-details-grid">
								<div><span>Repair ID</span><strong>{selectedRepair.repairId}</strong></div>
								<div><span>Asset ID</span><strong>{selectedRepair.assetId}</strong></div>
								<div><span>Issue</span><strong>{selectedRepair.issue}</strong></div>
								<div><span>Submitted Date</span><strong>{selectedRepair.submittedDate}</strong></div>
								<div><span>Expected Completion</span><strong>{selectedRepair.expectedCompletionDate}</strong></div>
								<div><span>Technician</span><strong>{selectedRepair.technician}</strong></div>
								<div><span>Status</span><strong>{selectedRepair.status}</strong></div>
							</div>
						</section>
					)}
				</section>
			</main>
		</div>
	);
}

export default Repairs;
