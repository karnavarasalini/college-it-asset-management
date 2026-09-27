const assets = [
	{ id: "IT-001", name: "Dell Laptop", category: "Laptop", brand: "Dell", model: "Latitude 5440", serial: "DL-5440-8K2P19", date: "Sep 03, 2025", status: "In use", assignedTo: "Jordan Lee", location: "Innovation Hall, Room 314" },
	{ id: "IT-014", name: "Wireless Mouse", category: "Accessory", brand: "Logitech", model: "M185 Wireless Mouse", serial: "LGT-M185-7N4Q21", date: "Sep 03, 2025", status: "In use", assignedTo: "Jordan Lee", location: "Innovation Hall, Room 314" },
	{ id: "IT-021", name: "HP Monitor", category: "Monitor", brand: "HP", model: "E24 G5", serial: "HP-E24G5-CN4128", date: "Sep 03, 2025", status: "In use", assignedTo: "Jordan Lee", location: "Innovation Hall, Room 314" }
];

const requests = [
	{ id: "SR-2025-041", asset: "Dell Latitude 7440", issue: "Laptop runs slowly", date: "Oct 20, 2025", priority: "Medium", status: "In progress" },
	{ id: "SR-2025-036", asset: "Dell UltraSharp 27 Monitor", issue: "Display flickers occasionally", date: "Oct 16, 2025", priority: "Low", status: "Pending" }
];

const notifications = [
	{ id: "notification-001", title: "Asset Assigned", message: "Dell Laptop (IT-001) has been assigned to your account.", type: "Asset", dateTime: "Sep 03, 2025 · 10:15 AM", isRead: false },
	{ id: "notification-002", title: "Service Request Submitted", message: "Your request REQ-003 has been submitted and is waiting for IT review.", type: "Service Request", dateTime: "Sep 02, 2025 · 2:40 PM", isRead: false },
	{ id: "notification-003", title: "Service Request Completed", message: "Your account access request has been resolved by the IT support team.", type: "Service Request", dateTime: "Aug 28, 2025 · 11:05 AM", isRead: true },
	{ id: "notification-004", title: "Maintenance Reminder", message: "Please bring your assigned laptop to the service desk for its scheduled checkup.", type: "Maintenance", dateTime: "Aug 25, 2025 · 9:00 AM", isRead: false }
];

const profile = {
	fullName: "Jordan Lee",
	userId: "FAC-20847",
	email: "jordan.lee@northfield.edu",
	department: "School of Computing",
	role: "Faculty member",
	phoneNumber: "+1 (555) 014-2084"
};

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

function nextRequestId() {
	return `REQ-${String(requests.length + 1).padStart(3, "0")}`;
}

function renderAssets() {
	const searchTerm = document.getElementById("asset-search").value.trim().toLowerCase();
	const category = document.getElementById("asset-category-filter").value;
	const filteredAssets = assets.filter((asset) => {
		const matchesSearch = `${asset.id} ${asset.name}`.toLowerCase().includes(searchTerm);
		const matchesCategory = category === "All Categories" || asset.category === category;
		return matchesSearch && matchesCategory;
	});
	const rows = filteredAssets.map((asset) => `
		<tr>
			<td class="asset-id">${escapeHtml(asset.id)}</td>
			<td><div class="asset-name-cell"><strong>${escapeHtml(asset.name)}</strong><span>College-owned equipment</span></div></td>
			<td>${escapeHtml(asset.category)}</td>
			<td>${escapeHtml(asset.date)}</td>
			<td><span class="status-badge status-active">${escapeHtml(asset.status)}</span></td>
			<td><button class="action-button" type="button" data-asset-id="${escapeHtml(asset.id)}">View Details</button></td>
		</tr>`).join("");
	const emptyRow = '<tr><td class="empty-state" colspan="6">No assets found.</td></tr>';

	document.getElementById("recent-assets-body").innerHTML = assets.slice(0, 3).map((asset) => `
		<tr>
			<td><div class="asset-name-cell"><strong>${escapeHtml(asset.name)}</strong><span class="asset-id">${escapeHtml(asset.id)}</span></div></td>
			<td>${escapeHtml(asset.category)}</td><td>${escapeHtml(asset.date)}</td>
			<td><span class="status-badge status-active">${escapeHtml(asset.status)}</span></td>
		</tr>`).join("");
	document.getElementById("assets-table-body").innerHTML = rows || emptyRow;
	document.getElementById("assigned-count").textContent = assets.length;
	document.getElementById("asset-total").textContent = assets.length;
	document.getElementById("request-asset").innerHTML = '<option value="">Choose an asset</option>' + assets.map((asset) => `<option value="${escapeHtml(asset.id)}">${escapeHtml(asset.id)} - ${escapeHtml(asset.name)}</option>`).join("");
}

function renderRequests() {
	document.getElementById("requests-table-body").innerHTML = requests.map((request) => `
		<tr><td class="asset-id">${escapeHtml(request.id)}</td><td>${escapeHtml(request.asset)}</td><td>${escapeHtml(request.issue)}</td><td><span class="priority-badge priority-${escapeHtml((request.priority || "Medium").toLowerCase())}">${escapeHtml(request.priority || "Medium")}</span></td><td>${escapeHtml(request.date)}</td>
			<td><span class="status-badge ${statusClass(request.status)}">${escapeHtml(request.status)}</span></td></tr>`).join("");
	document.getElementById("request-preview-list").innerHTML = requests.slice(0, 3).map((request) => `
		<div class="request-preview"><div class="request-preview-copy"><strong>${escapeHtml(request.issue)}</strong><span>${escapeHtml(request.id)} · ${escapeHtml(request.date)}</span></div><span class="status-badge ${statusClass(request.status)}">${escapeHtml(request.status)}</span></div>`).join("");
	const activeCount = requests.filter((request) => request.status !== "Completed").length;
	document.getElementById("active-count").textContent = activeCount;
	document.getElementById("request-nav-count").textContent = activeCount;
	document.getElementById("request-total").textContent = `${requests.length} requests`;
}

function renderNotifications() {
	const notificationList = document.getElementById("notification-list");
	const unreadCount = notifications.filter((notification) => !notification.isRead).length;
	const navCount = document.getElementById("notification-nav-count");
	document.getElementById("notification-count").textContent = unreadCount;
	document.getElementById("notification-caption").textContent = unreadCount === 1 ? "Unread notification" : "Unread notifications";
	navCount.textContent = unreadCount;
	navCount.hidden = unreadCount === 0;
	document.getElementById("notification-empty").hidden = unreadCount > 0;
	document.getElementById("mark-all-notifications").disabled = unreadCount === 0;

	const symbols = { Asset: "↗", "Service Request": "✓", Maintenance: "i" };
	notificationList.innerHTML = notifications.map((notification) => {
		const typeClass = notification.type.toLowerCase().replace(/\s+/g, "-");
		const readState = notification.isRead ? "Read" : "Unread";
		return `
			<article class="notification-item ${notification.isRead ? "is-read" : "is-unread"}" role="listitem">
				<span class="notification-symbol symbol-${typeClass}" aria-hidden="true">${symbols[notification.type]}</span>
				<div class="notification-content">
					<div class="notification-title-row"><h2>${escapeHtml(notification.title)}</h2><span class="notification-type type-${typeClass}">${escapeHtml(notification.type)}</span></div>
					<p>${escapeHtml(notification.message)}</p>
					<span class="notification-time">${escapeHtml(notification.dateTime)}</span>
				</div>
				<div class="notification-actions"><span class="notification-read-status">${readState}</span>${notification.isRead ? "" : `<button class="button button-secondary mark-read-button" type="button" data-mark-read="${escapeHtml(notification.id)}">Mark as Read</button>`}</div>
			</article>`;
	}).join("");
}

function renderProfile() {
	const displayValues = {
		"profile-display-name": profile.fullName,
		"profile-display-name-detail": profile.fullName,
		"profile-display-user-id": profile.userId,
		"profile-display-email": profile.email,
		"profile-display-department": profile.department,
		"profile-display-role": profile.role,
		"profile-display-phone": profile.phoneNumber,
		"profile-display-role-banner": profile.role,
		"profile-display-department-banner": profile.department
	};
	Object.entries(displayValues).forEach(([elementId, value]) => {
		document.getElementById(elementId).textContent = value;
	});
	const initials = profile.fullName.trim().split(/\s+/).slice(0, 2).map((part) => part[0].toUpperCase()).join("");
	document.getElementById("profile-avatar").textContent = initials;
	document.getElementById("topbar-user-name").textContent = profile.fullName;
	document.getElementById("topbar-avatar").textContent = initials;
}

function populateProfileForm() {
	document.getElementById("profile-user-id-edit").value = profile.userId;
	document.getElementById("profile-role-edit").value = profile.role;
	document.getElementById("profile-name-edit").value = profile.fullName;
	document.getElementById("profile-email-edit").value = profile.email;
	document.getElementById("profile-phone-edit").value = profile.phoneNumber;
	document.getElementById("profile-department-edit").value = profile.department;
}

function setProfileEditing(isEditing) {
	document.getElementById("profile-display").hidden = isEditing;
	document.getElementById("profile-form").hidden = !isEditing;
	document.getElementById("edit-profile-button").hidden = isEditing;
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
	document.getElementById("request-id").value = nextRequestId();
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
renderNotifications();
renderProfile();

document.getElementById("asset-search").addEventListener("input", renderAssets);
document.getElementById("asset-category-filter").addEventListener("change", renderAssets);
document.getElementById("assets-table-body").addEventListener("click", (event) => {
	const button = event.target.closest("[data-asset-id]");
	if (!button) return;

	const asset = assets.find((item) => item.id === button.dataset.assetId);
	if (!asset) return;
	const details = {
		"asset-detail-id": asset.id,
		"asset-detail-name": asset.name,
		"asset-detail-category": asset.category,
		"asset-detail-brand": asset.brand,
		"asset-detail-model": asset.model,
		"asset-detail-serial": asset.serial,
		"asset-detail-date": asset.date,
		"asset-detail-status": asset.status,
		"asset-detail-assigned-to": asset.assignedTo,
		"asset-detail-location": asset.location
	};
	Object.entries(details).forEach(([elementId, value]) => {
		document.getElementById(elementId).textContent = value;
	});
	document.getElementById("asset-dialog").showModal();
});

navLinks.forEach((link) => link.addEventListener("click", () => showView(link.dataset.view)));
document.querySelectorAll("[data-go-view]").forEach((button) => button.addEventListener("click", () => showView(button.dataset.goView)));
document.querySelectorAll("[data-open-request]").forEach((button) => button.addEventListener("click", openRequestDialog));

document.getElementById("close-dialog").addEventListener("click", () => requestDialog.close());
document.getElementById("cancel-request").addEventListener("click", () => requestDialog.close());
requestDialog.addEventListener("click", (event) => {
	if (event.target === requestDialog) requestDialog.close();
});

const assetDialog = document.getElementById("asset-dialog");
document.getElementById("close-asset-dialog").addEventListener("click", () => assetDialog.close());
document.getElementById("close-asset-details").addEventListener("click", () => assetDialog.close());
assetDialog.addEventListener("click", (event) => {
	if (event.target === assetDialog) assetDialog.close();
});

requestForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const assetId = document.getElementById("request-asset").value;
	const issueType = document.getElementById("request-issue").value;
	const description = document.getElementById("request-description").value.trim();
	const priority = document.getElementById("request-priority").value;

	if (!assetId || !issueType || !description || !priority) {
		formError.textContent = "Choose an asset, issue category, and priority, then describe the problem.";
		formError.hidden = false;
		return;
	}

	const asset = assets.find((item) => item.id === assetId);
	const requestId = document.getElementById("request-id").value;
	requests.unshift({
		id: requestId,
		asset: `${asset.id} - ${asset.name}`,
		issue: `${issueType}: ${description}`,
		date: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date()),
		priority,
		status: "Pending"
	});
	renderRequests();
	requestDialog.close();
	showView("requests");
	showToast("Service request submitted successfully.");
});

menuToggle.addEventListener("click", () => {
	const isOpen = sidebar.classList.toggle("is-open");
	sidebarBackdrop.classList.toggle("is-visible", isOpen);
	menuToggle.setAttribute("aria-expanded", String(isOpen));
	menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});
sidebarBackdrop.addEventListener("click", closeSidebar);

document.getElementById("notification-list").addEventListener("click", (event) => {
	const button = event.target.closest("[data-mark-read]");
	if (!button) return;
	const notification = notifications.find((item) => item.id === button.dataset.markRead);
	if (!notification) return;
	notification.isRead = true;
	renderNotifications();
});
document.getElementById("mark-all-notifications").addEventListener("click", () => {
	notifications.forEach((notification) => { notification.isRead = true; });
	renderNotifications();
});

const profileForm = document.getElementById("profile-form");
const profileError = document.getElementById("profile-error");
document.getElementById("edit-profile-button").addEventListener("click", () => {
	populateProfileForm();
	profileError.hidden = true;
	setProfileEditing(true);
});
document.getElementById("cancel-profile-edit").addEventListener("click", () => {
	profileError.hidden = true;
	setProfileEditing(false);
});
profileForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const fullName = document.getElementById("profile-name-edit").value.trim();
	const email = document.getElementById("profile-email-edit").value.trim();
	const phoneNumber = document.getElementById("profile-phone-edit").value.trim();
	const department = document.getElementById("profile-department-edit").value.trim();
	const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

	if (!fullName || !email || !phoneNumber || !department || !validEmail) {
		profileError.textContent = !validEmail && email ? "Enter a valid email address and complete all required fields." : "Complete all required fields before saving.";
		profileError.hidden = false;
		return;
	}

	profile.fullName = fullName;
	profile.email = email;
	profile.phoneNumber = phoneNumber;
	profile.department = department;
	renderProfile();
	profileError.hidden = true;
	setProfileEditing(false);
	showToast("Profile updated successfully.");
});

document.getElementById("logout-button").addEventListener("click", () => {
	const shouldLogout = window.confirm("Are you sure you want to log out?");
	if (shouldLogout) showToast("You have been logged out. Connect authentication to finish this action.");
});
