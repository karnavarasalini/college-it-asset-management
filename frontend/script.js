const assets = [
	{ id: "AST-1042", name: "Dell Latitude 7440", category: "Laptop", date: "Oct 14, 2025", status: "In use" },
	{ id: "AST-0876", name: "Dell UltraSharp 27 Monitor", category: "Monitor", date: "Aug 28, 2025", status: "In use" },
	{ id: "AST-1129", name: "Logitech Brio Webcam", category: "Accessories", date: "Aug 28, 2025", status: "In use" },
	{ id: "AST-0651", name: "Logitech MX Keys", category: "Accessories", date: "Aug 28, 2025", status: "In use" }
];

const requests = [
	{ id: "SR-2025-041", asset: "Dell Latitude 7440", issue: "Laptop runs slowly", date: "Oct 20, 2025", status: "In progress" },
	{ id: "SR-2025-036", asset: "Dell UltraSharp 27 Monitor", issue: "Display flickers occasionally", date: "Oct 16, 2025", status: "Pending" }
];

const pageTitles = {
	dashboard: "Dashboard",
	assets: "My Assets",
	requests: "Service Requests",
	notifications: "Notifications",
	profile: "My Profile"
};

const navLinks = document.querySelectorAll("[data-view]");
const pageHeading = document.getElementById("page-heading");
const requestDialog = document.getElementById("request-dialog");
const requestForm = document.getElementById("request-form");
const formError = document.getElementById("form-error");
const toast = document.getElementById("toast");
let toastTimer;

function escapeHtml(value) {
	const characters = { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" };
	return String(value).replace(/[&<>"']/g, (character) => characters[character]);
}

function statusClass(status) {
	if (status === "In progress") return "status-progress";
	if (status === "Pending") return "status-pending";
	if (status === "Completed") return "status-completed";
	return "status-active";
}

function renderAssets() {
	const rows = assets.map((asset) => `
		<tr>
			<td class="asset-id">${escapeHtml(asset.id)}</td>
			<td><div class="asset-name-cell"><strong>${escapeHtml(asset.name)}</strong><span>College-owned equipment</span></div></td>
			<td>${escapeHtml(asset.category)}</td>
			<td>${escapeHtml(asset.date)}</td>
			<td><span class="status-badge status-active">${escapeHtml(asset.status)}</span></td>
		</tr>`).join("");

	document.getElementById("recent-assets-body").innerHTML = assets.slice(0, 3).map((asset) => `
		<tr>
			<td><div class="asset-name-cell"><strong>${escapeHtml(asset.name)}</strong><span class="asset-id">${escapeHtml(asset.id)}</span></div></td>
			<td>${escapeHtml(asset.category)}</td><td>${escapeHtml(asset.date)}</td>
			<td><span class="status-badge status-active">${escapeHtml(asset.status)}</span></td>
		</tr>`).join("");
	document.getElementById("assets-table-body").innerHTML = rows;
	document.getElementById("assigned-count").textContent = assets.length;
	document.getElementById("asset-total").textContent = assets.length;
	document.getElementById("request-asset").innerHTML = '<option value="">Choose an asset</option>' + assets.map((asset) => `<option value="${escapeHtml(asset.id)}">${escapeHtml(asset.name)} (${escapeHtml(asset.id)})</option>`).join("");
}

function renderRequests() {
	document.getElementById("requests-table-body").innerHTML = requests.map((request) => `
		<tr><td class="asset-id">${escapeHtml(request.id)}</td><td>${escapeHtml(request.asset)}</td><td>${escapeHtml(request.issue)}</td><td>${escapeHtml(request.date)}</td>
			<td><span class="status-badge ${statusClass(request.status)}">${escapeHtml(request.status)}</span></td></tr>`).join("");
	document.getElementById("request-preview-list").innerHTML = requests.slice(0, 3).map((request) => `
		<div class="request-preview"><div class="request-preview-copy"><strong>${escapeHtml(request.issue)}</strong><span>${escapeHtml(request.id)} · ${escapeHtml(request.date)}</span></div><span class="status-badge ${statusClass(request.status)}">${escapeHtml(request.status)}</span></div>`).join("");
	const activeCount = requests.filter((request) => request.status !== "Completed").length;
	document.getElementById("active-count").textContent = activeCount;
	document.getElementById("request-nav-count").textContent = activeCount;
	document.getElementById("request-total").textContent = `${requests.length} requests`;
}

function showView(viewName) {
	document.querySelectorAll(".view-section").forEach((section) => {
		const isSelected = section.id === `view-${viewName}`;
		section.hidden = !isSelected;
		section.classList.toggle("is-visible", isSelected);
	});
	navLinks.forEach((link) => {
		const isSelected = link.dataset.view === viewName;
		link.classList.toggle("is-active", isSelected);
		if (isSelected) link.setAttribute("aria-current", "page");
		else link.removeAttribute("aria-current");
	});
	pageHeading.textContent = pageTitles[viewName];
	closeSidebar();
	window.scrollTo({ top: 0, behavior: "smooth" });
}

function openRequestDialog() {
	formError.hidden = true;
	requestForm.reset();
	requestDialog.showModal();
}

function showToast(message) {
	document.getElementById("toast-message").textContent = message;
	toast.hidden = false;
	window.clearTimeout(toastTimer);
	toastTimer = window.setTimeout(() => { toast.hidden = true; }, 4000);
}

const sidebar = document.getElementById("sidebar");
const menuToggle = document.getElementById("menu-toggle");
const sidebarBackdrop = document.getElementById("sidebar-backdrop");

function closeSidebar() {
	sidebar.classList.remove("is-open");
	sidebarBackdrop.classList.remove("is-visible");
	menuToggle.setAttribute("aria-expanded", "false");
	menuToggle.setAttribute("aria-label", "Open navigation");
}

renderAssets();
renderRequests();

navLinks.forEach((link) => link.addEventListener("click", () => showView(link.dataset.view)));
document.querySelectorAll("[data-go-view]").forEach((button) => button.addEventListener("click", () => showView(button.dataset.goView)));
document.querySelectorAll("[data-open-request]").forEach((button) => button.addEventListener("click", openRequestDialog));

document.getElementById("close-dialog").addEventListener("click", () => requestDialog.close());
document.getElementById("cancel-request").addEventListener("click", () => requestDialog.close());
requestDialog.addEventListener("click", (event) => {
	if (event.target === requestDialog) requestDialog.close();
});

requestForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const assetId = document.getElementById("request-asset").value;
	const issueType = document.getElementById("request-issue").value;
	const description = document.getElementById("request-description").value.trim();

	if (!assetId || !issueType || description.length < 10) {
		formError.textContent = "Choose an asset and issue type, then describe the issue in at least 10 characters.";
		formError.hidden = false;
		return;
	}

	const asset = assets.find((item) => item.id === assetId);
	const requestId = `SR-2025-${String(42 + requests.length - 2).padStart(3, "0")}`;
	requests.unshift({
		id: requestId,
		asset: asset.name,
		issue: `${issueType}: ${description}`,
		date: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date()),
		status: "Pending"
	});
	renderRequests();
	requestDialog.close();
	showView("requests");
	showToast(`Request ${requestId} submitted successfully.`);
});

menuToggle.addEventListener("click", () => {
	const isOpen = sidebar.classList.toggle("is-open");
	sidebarBackdrop.classList.toggle("is-visible", isOpen);
	menuToggle.setAttribute("aria-expanded", String(isOpen));
	menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});
sidebarBackdrop.addEventListener("click", closeSidebar);

document.getElementById("logout-button").addEventListener("click", () => {
	const shouldLogout = window.confirm("Are you sure you want to log out?");
	if (shouldLogout) showToast("You have been logged out. Connect authentication to finish this action.");
});
