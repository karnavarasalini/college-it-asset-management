import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const initialProfile = {
	fullName: "Jordan Lee",
	email: "jordan.lee@northfield.edu",
	userId: "FAC-20418",
	department: "School of Computing",
	phone: "+1 (555) 014-8290",
	role: "Faculty",
};

const profileFields = [
	{ name: "fullName", label: "Full Name", type: "text", autoComplete: "name" },
	{ name: "email", label: "Email", type: "email", autoComplete: "email" },
	{ name: "userId", label: "Employee / Student ID", type: "text", autoComplete: "off" },
	{ name: "department", label: "Department", type: "text", autoComplete: "organization-title" },
	{ name: "phone", label: "Phone Number", type: "tel", autoComplete: "tel" },
	{ name: "role", label: "Role", type: "text", autoComplete: "off" },
];

function Users({ onLogout }) {
	const { currentUser, login } = useAuth();
	const [profile, setProfile] = useState(() => ({
		...initialProfile,
		fullName: currentUser?.name || currentUser?.fullName || initialProfile.fullName,
		email: currentUser?.email || initialProfile.email,
		userId: currentUser?.userId || initialProfile.userId,
		department: currentUser?.department || initialProfile.department,
		phone: currentUser?.phone || initialProfile.phone,
		role: currentUser?.role || initialProfile.role,
	}));
	const [draftProfile, setDraftProfile] = useState(() => ({ ...profile }));
	const [isEditing, setIsEditing] = useState(false);
	const [errors, setErrors] = useState({});
	const [message, setMessage] = useState("");

	function startEditing() {
		setDraftProfile({ ...profile });
		setErrors({});
		setMessage("");
		setIsEditing(true);
	}

	function cancelEditing() {
		setDraftProfile({ ...profile });
		setErrors({});
		setIsEditing(false);
		setMessage("");
	}

	function handleFieldChange(event) {
		const { name, value } = event.target;
		setDraftProfile((currentProfile) => ({ ...currentProfile, [name]: value }));
		setErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
		setMessage("");
	}

	function validateProfile() {
		const nextErrors = {};
		const normalizedEmail = draftProfile.email.trim();
		const phoneDigits = draftProfile.phone.replace(/\D/g, "");

		if (!draftProfile.fullName.trim()) {
			nextErrors.fullName = "Enter your full name.";
		}
		if (!normalizedEmail) {
			nextErrors.email = "Enter your email address.";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
			nextErrors.email = "Enter a valid email address.";
		}
		if (phoneDigits.length < 7 || phoneDigits.length > 15) {
			nextErrors.phone = "Enter a phone number with 7 to 15 digits.";
		}

		return nextErrors;
	}

	function handleSave(event) {
		event.preventDefault();
		const nextErrors = validateProfile();
		setErrors(nextErrors);

		if (Object.keys(nextErrors).length > 0) {
			setMessage("");
			return;
		}

		const updatedProfile = Object.fromEntries(
			Object.entries(draftProfile).map(([key, value]) => [key, value.trim()]),
		);
		setProfile(updatedProfile);
		setDraftProfile(updatedProfile);
		login({
			...currentUser,
			...updatedProfile,
			name: updatedProfile.fullName,
		});
		setErrors({});
		setIsEditing(false);
		setMessage("Profile changes saved successfully.");
	}

	function showSecurityMessage(action) {
		setMessage(`${action} is not connected in this demo.`);
	}

	return (
		<div className="user-profile-page">
			<style>{`
				.user-profile-page {
					--profile-forest: #173c30;
					--profile-ink: #25312a;
					--profile-muted: #718078;
					--profile-border: #e1e7e1;
					min-height: 100vh;
					min-height: 100svh;
					padding: clamp(24px, 4vw, 52px);
					background: #f3f5f1;
					color: var(--profile-ink);
					font-family: "Segoe UI", Arial, sans-serif;
					font-size: 14px;
				}
				.user-profile-page * { box-sizing: border-box; }
				.profile-inner { width: min(100%, 1180px); margin: 0 auto; }
				.profile-page-header { margin-bottom: 24px; }
				.profile-eyebrow { margin: 0 0 8px; color: #76887c; font-size: 10px; font-weight: 700; letter-spacing: 1.4px; }
				.profile-page-header h1 { margin: 0; color: var(--profile-forest); font-family: Georgia, "Times New Roman", serif; font-size: 34px; font-weight: 400; }
				.profile-page-header p:last-child { margin: 8px 0 0; color: var(--profile-muted); font-size: 13px; }
				.profile-layout { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(260px, .8fr); gap: 20px; align-items: start; }
				.profile-column { display: grid; gap: 20px; min-width: 0; }
				.profile-section { min-width: 0; border: 1px solid var(--profile-border); background: #fff; }
				.profile-section-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 18px 20px; border-bottom: 1px solid #e9ede9; }
				.profile-section-header h2 { margin: 0; color: #2e4437; font-size: 14px; font-weight: 650; }
				.profile-section-header p { margin: 5px 0 0; color: #87928a; font-size: 11px; }
				.profile-primary-action, .profile-secondary-action {
					min-height: 36px;
					padding: 0 12px;
					border: 1px solid transparent;
					border-radius: 3px;
					font: inherit;
					font-size: 11px;
					font-weight: 650;
					cursor: pointer;
					white-space: nowrap;
				}
				.profile-primary-action { background: #245541; color: #fff; }
				.profile-primary-action:hover { background: #193f30; }
				.profile-secondary-action { border-color: #cfd8d0; background: #fff; color: #536057; }
				.profile-secondary-action:hover { background: #f6f8f6; }
				.profile-primary-action:focus-visible, .profile-secondary-action:focus-visible, .profile-security-button:focus-visible {
					outline: 3px solid rgb(58 114 92 / 20%);
					outline-offset: 2px;
				}
				.profile-display-grid, .profile-edit-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px 18px; padding: 22px 20px; }
				.profile-display-field { min-width: 0; }
				.profile-display-field span { display: block; margin-bottom: 6px; color: #839087; font-size: 9px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; }
				.profile-display-field strong { display: block; color: #3a493f; font-size: 12px; font-weight: 600; overflow-wrap: anywhere; }
				.profile-edit-grid { padding-bottom: 14px; }
				.profile-edit-field { display: grid; align-content: start; gap: 7px; min-width: 0; }
				.profile-edit-field label { color: #536057; font-size: 11px; font-weight: 650; }
				.profile-edit-field input { width: 100%; min-height: 40px; padding: 0 11px; border: 1px solid #cfd8d0; border-radius: 3px; background: #fff; color: #25312a; font: inherit; font-size: 12px; }
				.profile-edit-field input:focus { border-color: #3a725c; outline: 3px solid rgb(58 114 92 / 16%); outline-offset: 1px; }
				.profile-edit-field input[aria-invalid="true"] { border-color: #b34239; }
				.profile-field-error { margin: 0; color: #a2342b; font-size: 10px; line-height: 1.4; }
				.profile-edit-actions { display: flex; justify-content: flex-end; gap: 9px; padding: 0 20px 20px; }
				.profile-feedback { margin: 0 20px 18px; padding: 10px 12px; border-left: 3px solid #4d805c; background: #edf5ed; color: #28563c; font-size: 11px; line-height: 1.5; }
				.profile-feedback.is-error { border-color: #b34239; background: #fff0ed; color: #782a25; }
				.profile-account-list { display: grid; gap: 0; padding: 4px 20px; }
				.profile-account-row { display: flex; align-items: center; justify-content: space-between; gap: 14px; padding: 14px 0; border-bottom: 1px solid #edf0ed; }
				.profile-account-row:last-child { border-bottom: 0; }
				.profile-account-row span { color: #78857c; font-size: 11px; }
				.profile-account-row strong { color: #3d4c42; font-size: 11px; font-weight: 600; text-align: right; }
				.profile-account-status { display: inline-flex; align-items: center; gap: 6px; color: #40694f !important; }
				.profile-account-status::before { width: 7px; height: 7px; border-radius: 50%; background: #5a9b6e; content: ""; }
				.profile-security-content { display: grid; gap: 10px; padding: 18px 20px 20px; }
				.profile-security-content p { margin: 0 0 4px; color: #78857c; font-size: 11px; line-height: 1.5; }
				.profile-security-button { min-height: 38px; padding: 0 11px; border: 1px solid #cfd8d0; border-radius: 3px; background: #fff; color: #315f4b; font: inherit; font-size: 11px; font-weight: 650; text-align: left; cursor: pointer; }
				.profile-security-button:hover { background: #f6f9f6; }
				@media (max-width: 800px) {
					.user-profile-page { padding: 28px 18px; }
					.profile-layout { grid-template-columns: 1fr; }
				}
				@media (max-width: 520px) {
					.profile-page-header h1 { font-size: 29px; }
					.profile-section-header { align-items: flex-start; flex-direction: column; }
					.profile-display-grid, .profile-edit-grid { grid-template-columns: 1fr; gap: 16px; padding: 18px; }
					.profile-edit-actions { padding: 0 18px 18px; }
					.profile-edit-actions button { flex: 1; }
					.profile-feedback { margin-right: 18px; margin-left: 18px; }
				}
			`}</style>

			<main className="profile-inner">
				<header className="profile-page-header">
					<p className="profile-eyebrow">YOUR ACCOUNT</p>
					<h1>My Profile</h1>
					<p>Review your account details and contact information.</p>
				</header>

				{message && <p className="profile-feedback" role="status">{message}</p>}

				<div className="profile-layout">
					<section className="profile-section" aria-labelledby="profile-information-heading">
						<div className="profile-section-header">
							<div>
								<h2 id="profile-information-heading">Profile Information</h2>
								<p>Personal and department details on your account.</p>
							</div>
							{!isEditing && <button className="profile-primary-action" type="button" onClick={startEditing}>Edit Profile</button>}
						</div>

						{isEditing ? (
							<form onSubmit={handleSave} noValidate>
								<div className="profile-edit-grid">
									{profileFields.map((field) => (
										<div className="profile-edit-field" key={field.name}>
											<label htmlFor={`profile-${field.name}`}>{field.label}</label>
											<input
												id={`profile-${field.name}`}
												name={field.name}
												type={field.type}
												autoComplete={field.autoComplete}
												value={draftProfile[field.name]}
												aria-invalid={Boolean(errors[field.name])}
												aria-describedby={errors[field.name] ? `profile-${field.name}-error` : undefined}
												onChange={handleFieldChange}
											/>
											{errors[field.name] && <p className="profile-field-error" id={`profile-${field.name}-error`}>{errors[field.name]}</p>}
										</div>
									))}
								</div>
								<div className="profile-edit-actions">
									<button className="profile-secondary-action" type="button" onClick={cancelEditing}>Cancel</button>
									<button className="profile-primary-action" type="submit">Save Changes</button>
								</div>
							</form>
						) : (
							<div className="profile-display-grid">
								{profileFields.map((field) => (
									<div className="profile-display-field" key={field.name}>
										<span>{field.label}</span>
										<strong>{profile[field.name]}</strong>
									</div>
								))}
							</div>
						)}
					</section>

					<div className="profile-column">
						<section className="profile-section" aria-labelledby="account-information-heading">
							<div className="profile-section-header">
								<div>
									<h2 id="account-information-heading">Account Information</h2>
									<p>Access and account activity.</p>
								</div>
							</div>
							<div className="profile-account-list">
								<div className="profile-account-row"><span>Account status</span><strong className="profile-account-status">Active</strong></div>
								<div className="profile-account-row"><span>Role</span><strong>{profile.role}</strong></div>
								<div className="profile-account-row"><span>Last login</span><strong>Sep 28, 2026 · 8:42 AM</strong></div>
							</div>
						</section>

						<section className="profile-section" aria-labelledby="security-heading">
							<div className="profile-section-header">
								<div>
									<h2 id="security-heading">Security</h2>
									<p>Manage access to your college account.</p>
								</div>
							</div>
							<div className="profile-security-content">
								<p>Password changes are not connected in this demo. Logout will end your current session.</p>
								<button className="profile-security-button" type="button" onClick={() => showSecurityMessage("Change Password")}>Change Password</button>
								<button className="profile-security-button" type="button" onClick={onLogout}>Logout</button>
							</div>
						</section>
					</div>
				</div>
			</main>
		</div>
	);
}

export default Users;
