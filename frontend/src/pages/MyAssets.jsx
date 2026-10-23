import React, { useState } from "react";

const assignedAssets = [
	{ assetId: "AST-IT-1048", assetName: "Latitude 5440", category: "Laptop", model: "Dell Latitude 5440", assignedDate: "Aug 19, 2025", status: "Assigned", location: "Computing · Room 214" },
	{ assetId: "AST-IT-0872", assetName: "UltraSharp Monitor", category: "Monitor", model: "Dell UltraSharp U2422H", assignedDate: "Aug 19, 2025", status: "Assigned", location: "Computing · Room 214" },
	{ assetId: "AST-IT-1126", assetName: "USB-C Dock", category: "Other", model: "HP USB-C Dock G5", assignedDate: "Sep 02, 2025", status: "In Repair", location: "IT Service Desk" },
	{ assetId: "AST-IT-0681", assetName: "Department Printer", category: "Printer", model: "HP LaserJet Pro M404dn", assignedDate: "Jan 12, 2024", status: "Assigned", location: "Computing · Shared Office" },
	{ assetId: "AST-IT-1193", assetName: "Faculty Desktop", category: "Desktop", model: "Lenovo ThinkCentre M80s", assignedDate: "Jan 08, 2026", status: "Assigned", location: "Computing · Room 216" },
	{ assetId: "AST-IT-0914", assetName: "Wireless Keyboard", category: "Other", model: "Logitech MX Keys Mini", assignedDate: "Oct 03, 2025", status: "Assigned", location: "Computing · Room 214" },
	{ assetId: "AST-IT-1075", assetName: "ThinkPad T14", category: "Laptop", model: "Lenovo ThinkPad T14 Gen 4", assignedDate: "May 27, 2025", status: "Assigned", location: "Computing · Room 214" },
];

const categories = ["All", "Laptop", "Desktop", "Monitor", "Printer", "Other"];

function MyAssets() {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [selectedAsset, setSelectedAsset] = useState(null);

	const normalizedSearch = searchTerm.trim().toLowerCase();
	const filteredAssets = assignedAssets.filter((asset) => {
		const matchesSearch =
			asset.assetName.toLowerCase().includes(normalizedSearch) ||
			asset.assetId.toLowerCase().includes(normalizedSearch);
		const matchesCategory = selectedCategory === "All" || asset.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	return (
		<div className="my-assets-page">
			<style>{`
				.my-assets-page {
					--assets-forest: #173c30;
					--assets-green: #2c684e;
					--assets-ink: #25312a;
					--assets-muted: #718078;
					--assets-border: #e1e7e1;
					min-height: 100vh;
					min-height: 100svh;
					padding: clamp(24px, 4vw, 52px);
					background: #f3f5f1;
					color: var(--assets-ink);
					font-family: "Segoe UI", Arial, sans-serif;
					font-size: 14px;
				}
				.my-assets-page * { box-sizing: border-box; }
				.my-assets-inner { width: min(100%, 1320px); margin: 0 auto; }
				.my-assets-header { display: flex; align-items: end; justify-content: space-between; gap: 20px; margin-bottom: 24px; }
				.my-assets-eyebrow { margin: 0 0 8px; color: #76887c; font-size: 10px; font-weight: 700; letter-spacing: 1.4px; }
				.my-assets-header h1 { margin: 0; color: var(--assets-forest); font-family: Georgia, "Times New Roman", serif; font-size: 34px; font-weight: 400; }
				.my-assets-header p:last-child { margin: 8px 0 0; color: var(--assets-muted); font-size: 13px; }
				.my-assets-count { flex: 0 0 auto; padding: 8px 11px; border: 1px solid #dce4dc; background: #fff; color: #53695a; font-size: 11px; }
				.my-assets-panel { border: 1px solid var(--assets-border); background: #fff; }
				.my-assets-toolbar { display: flex; align-items: end; gap: 14px; padding: 18px; border-bottom: 1px solid #e9ede9; }
				.my-assets-control { display: grid; gap: 7px; }
				.my-assets-control label { color: #536057; font-size: 11px; font-weight: 650; }
				.my-assets-search-control { width: min(100%, 390px); }
				.my-assets-search, .my-assets-select {
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
				.my-assets-search:focus, .my-assets-select:focus, .my-assets-details button:focus-visible, .my-assets-view-button:focus-visible {
					border-color: #3a725c;
					outline: 3px solid rgb(58 114 92 / 16%);
					outline-offset: 1px;
				}
				.my-assets-category-control { width: 190px; }
				.my-assets-results-count { margin: 0 0 12px auto; color: #768178; font-size: 11px; }
				.my-assets-table-wrap { overflow-x: auto; }
				.my-assets-table { width: 100%; border-collapse: collapse; text-align: left; }
				.my-assets-table th { padding: 12px 14px; background: #f8faf7; color: #78857c; font-size: 9px; font-weight: 700; letter-spacing: .55px; text-transform: uppercase; white-space: nowrap; }
				.my-assets-table td { padding: 14px; border-top: 1px solid #edf0ed; color: #59665d; font-size: 11px; vertical-align: middle; }
				.my-assets-table td:first-child, .my-assets-table td:nth-child(2) { color: #34443a; font-weight: 600; }
				.my-assets-table td:first-child { white-space: nowrap; }
				.my-assets-status { display: inline-block; padding: 5px 8px; border-radius: 2px; background: #edf3ee; color: #40694f; font-size: 9px; font-weight: 700; white-space: nowrap; }
				.my-assets-status.is-repair { background: #f5f1e5; color: #8d7135; }
				.my-assets-view-button { min-height: 31px; padding: 0 9px; border: 1px solid #cad8cd; border-radius: 3px; background: #fff; color: #315f4b; font: inherit; font-size: 10px; font-weight: 650; cursor: pointer; white-space: nowrap; }
				.my-assets-view-button:hover { border-color: #315f4b; background: #f4f8f4; }
				.my-assets-empty { padding: 42px 20px; color: #69766d; text-align: center; }
				.my-assets-empty strong { display: block; margin-bottom: 6px; color: #34443a; font-size: 14px; }
				.my-assets-details { margin-top: 18px; padding: 20px; border: 1px solid #dce5dd; border-left: 3px solid #588366; background: #fff; }
				.my-assets-details-heading { display: flex; align-items: start; justify-content: space-between; gap: 14px; margin-bottom: 16px; }
				.my-assets-details-heading p { margin: 0 0 5px; color: #76887c; font-size: 9px; font-weight: 700; letter-spacing: 1.2px; }
				.my-assets-details-heading h2 { margin: 0; color: var(--assets-forest); font-family: Georgia, "Times New Roman", serif; font-size: 20px; font-weight: 400; }
				.my-assets-details button { min-width: 34px; min-height: 34px; border: 1px solid #d7ded8; border-radius: 3px; background: #fff; color: #506057; font: inherit; font-size: 18px; cursor: pointer; }
				.my-assets-detail-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 15px; }
				.my-assets-detail-grid div { min-width: 0; }
				.my-assets-detail-grid span { display: block; margin-bottom: 5px; color: #839087; font-size: 9px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; }
				.my-assets-detail-grid strong { display: block; overflow-wrap: anywhere; color: #3a493f; font-size: 12px; font-weight: 600; }
				@media (max-width: 760px) {
					.my-assets-page { padding: 28px 18px; }
					.my-assets-header { align-items: flex-start; flex-direction: column; gap: 14px; }
					.my-assets-toolbar { align-items: stretch; flex-wrap: wrap; }
					.my-assets-search-control { width: 100%; }
					.my-assets-category-control { width: min(100%, 230px); }
					.my-assets-results-count { width: 100%; margin: 2px 0 0; }
					.my-assets-detail-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
				}
				@media (max-width: 560px) {
					.my-assets-header h1 { font-size: 29px; }
					.my-assets-toolbar { padding: 14px; }
					.my-assets-category-control { width: 100%; }
					.my-assets-table thead { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; }
					.my-assets-table, .my-assets-table tbody, .my-assets-table tr, .my-assets-table td { display: block; width: 100%; }
					.my-assets-table tr { display: grid; grid-template-columns: 1fr 1fr; gap: 0 12px; padding: 10px 14px; border-top: 1px solid #edf0ed; }
					.my-assets-table td { display: flex; justify-content: space-between; gap: 10px; padding: 7px 0; border: 0; text-align: right; }
					.my-assets-table td::before { content: attr(data-label); color: #87928a; font-size: 9px; font-weight: 600; text-align: left; }
					.my-assets-table td:first-child { grid-column: 1 / -1; justify-content: flex-start; }
					.my-assets-table td:nth-child(2) { grid-column: 1 / -1; justify-content: flex-start; }
					.my-assets-table td:last-child { grid-column: 1 / -1; justify-content: flex-start; }
					.my-assets-details { padding: 16px; }
					.my-assets-detail-grid { gap: 13px; }
				}
			`}</style>

			<main className="my-assets-inner">
				<header className="my-assets-header">
					<div>
						<p className="my-assets-eyebrow">EQUIPMENT &amp; ASSIGNMENTS</p>
						<h1>My Assets</h1>
						<p>View the equipment currently assigned to your college account.</p>
					</div>
					<span className="my-assets-count">{assignedAssets.length} assigned assets</span>
				</header>

				<section className="my-assets-panel" aria-label="Assigned assets">
					<div className="my-assets-toolbar">
						<div className="my-assets-control my-assets-search-control">
							<label htmlFor="asset-search">Search assets</label>
							<input
								className="my-assets-search"
								id="asset-search"
								type="search"
								placeholder="Search by asset name or ID"
								value={searchTerm}
								onChange={(event) => setSearchTerm(event.target.value)}
							/>
						</div>
						<div className="my-assets-control my-assets-category-control">
							<label htmlFor="asset-category">Category</label>
							<select
								className="my-assets-select"
								id="asset-category"
								value={selectedCategory}
								onChange={(event) => setSelectedCategory(event.target.value)}
							>
								{categories.map((category) => <option key={category} value={category}>{category}</option>)}
							</select>
						</div>
						<p className="my-assets-results-count" aria-live="polite">
							Showing {filteredAssets.length} of {assignedAssets.length} assets
						</p>
					</div>

					{filteredAssets.length > 0 ? (
						<div className="my-assets-table-wrap">
							<table className="my-assets-table">
								<thead>
									<tr>
										<th scope="col">Asset ID</th>
										<th scope="col">Asset Name</th>
										<th scope="col">Category</th>
										<th scope="col">Brand / Model</th>
										<th scope="col">Assigned Date</th>
										<th scope="col">Status</th>
										<th scope="col">Location</th>
										<th scope="col">Action</th>
									</tr>
								</thead>
								<tbody>
									{filteredAssets.map((asset) => (
										<tr key={asset.assetId}>
											<td data-label="Asset ID">{asset.assetId}</td>
											<td data-label="Asset Name">{asset.assetName}</td>
											<td data-label="Category">{asset.category}</td>
											<td data-label="Brand / Model">{asset.model}</td>
											<td data-label="Assigned Date">{asset.assignedDate}</td>
											<td data-label="Status"><span className={`my-assets-status${asset.status === "In Repair" ? " is-repair" : ""}`}>{asset.status}</span></td>
											<td data-label="Location">{asset.location}</td>
											<td data-label="Action">
												<button className="my-assets-view-button" type="button" onClick={() => setSelectedAsset(asset)}>
													View Details
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<div className="my-assets-empty" role="status">
							<strong>No assets found</strong>
							<span>Try another asset name, ID, or category.</span>
						</div>
					)}
				</section>

				{selectedAsset && (
					<section className="my-assets-details" aria-labelledby="asset-details-title" aria-live="polite">
						<div className="my-assets-details-heading">
							<div>
								<p>ASSET DETAILS</p>
								<h2 id="asset-details-title">{selectedAsset.assetName}</h2>
							</div>
							<button type="button" aria-label="Close asset details" onClick={() => setSelectedAsset(null)}>×</button>
						</div>
						<div className="my-assets-detail-grid">
							<div><span>Asset ID</span><strong>{selectedAsset.assetId}</strong></div>
							<div><span>Category</span><strong>{selectedAsset.category}</strong></div>
							<div><span>Brand / Model</span><strong>{selectedAsset.model}</strong></div>
							<div><span>Assigned Date</span><strong>{selectedAsset.assignedDate}</strong></div>
							<div><span>Status</span><strong>{selectedAsset.status}</strong></div>
							<div><span>Location</span><strong>{selectedAsset.location}</strong></div>
						</div>
					</section>
				)}
			</main>
		</div>
	);
}

export default MyAssets;
