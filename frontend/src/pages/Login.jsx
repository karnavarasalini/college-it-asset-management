import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

function Login() {
	const { login } = useAuth();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [rememberMe, setRememberMe] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState({});
	const [message, setMessage] = useState("");

	function handleSubmit(event) {
		event.preventDefault();

		const nextErrors = {};
		if (!username.trim()) {
			nextErrors.username = "Enter your email or username.";
		}
		if (!password.trim()) {
			nextErrors.password = "Enter your password.";
		}

		setErrors(nextErrors);
		setMessage("");

		if (Object.keys(nextErrors).length === 0) {
			const enteredUsername = username.trim();
			const name = enteredUsername
				.split("@")[0]
				.replace(/[._-]+/g, " ")
				.replace(/\b\w/g, (letter) => letter.toUpperCase());

			login({
				name,
				email: enteredUsername.includes("@") ? enteredUsername : `${enteredUsername}@college.edu`,
				role: "College Member",
				department: "Campus IT",
				userId: "DEMO-001",
			});
		}
	}

	function handleForgotPassword() {
		setMessage("Password recovery is not available in demo mode.");
	}

	return (
		<div className="college-login">
			<style>{`
				.college-login {
					--login-ink: #183b31;
					--login-muted: #69756e;
					--login-accent: #d2a94f;
					min-height: 100vh;
					min-height: 100svh;
					display: grid;
					grid-template-columns: minmax(280px, 0.88fr) minmax(360px, 1.12fr);
					background: #f5f6f1;
					color: #202923;
					font-family: "Segoe UI", Arial, sans-serif;
				}
				.college-login * { box-sizing: border-box; }
				.login-brand-panel {
					position: relative;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					overflow: hidden;
					padding: clamp(32px, 6vw, 76px);
					background-color: #183b31;
					background-image: repeating-linear-gradient(135deg, transparent 0 34px, rgb(255 255 255 / 3%) 35px 36px);
					color: #f8f8f1;
				}
				.login-brand-panel::after {
					position: absolute;
					right: -78px;
					bottom: 112px;
					width: 230px;
					height: 230px;
					border: 1px solid rgb(255 255 255 / 14%);
					content: "";
					transform: rotate(45deg);
				}
				.login-brand-mark {
					display: inline-flex;
					align-items: center;
					gap: 12px;
					font-size: 13px;
					font-weight: 700;
					letter-spacing: 1.5px;
				}
				.login-brand-monogram {
					display: grid;
					width: 42px;
					height: 42px;
					place-items: center;
					border: 1px solid rgb(255 255 255 / 48%);
					color: #f0d58c;
					font-family: Georgia, serif;
					font-size: 17px;
				}
				.login-brand-copy { max-width: 470px; margin: auto 0; padding: 56px 0; }
				.login-eyebrow {
					margin: 0 0 20px;
					color: #e6c873;
					font-size: 11px;
					font-weight: 700;
					letter-spacing: 1.7px;
				}
				.login-brand-copy h1 {
					max-width: 480px;
					margin: 0;
					font-family: Georgia, "Times New Roman", serif;
					font-size: clamp(34px, 4.2vw, 58px);
					font-weight: 400;
					line-height: 1.12;
				}
				.login-brand-copy p {
					max-width: 370px;
					margin: 22px 0 0;
					color: #d1ddd5;
					font-size: 15px;
					line-height: 1.7;
				}
				.login-campus-note {
					position: relative;
					z-index: 1;
					margin: 0;
					color: #d1ddd5;
					font-size: 12px;
					letter-spacing: 0.4px;
				}
				.login-form-panel {
					display: flex;
					align-items: center;
					justify-content: center;
					padding: clamp(28px, 7vw, 96px);
				}
				.login-form-content { width: min(100%, 420px); }
				.login-form-heading { margin-bottom: 34px; }
				.login-form-heading .login-eyebrow { margin-bottom: 10px; color: #718078; }
				.login-form-heading h2 {
					margin: 0;
					color: var(--login-ink);
					font-family: Georgia, "Times New Roman", serif;
					font-size: 34px;
					font-weight: 400;
				}
				.login-form-heading p:last-child { margin: 10px 0 0; color: var(--login-muted); font-size: 14px; }
				.login-form { display: grid; gap: 10px; }
				.login-form label { color: #34423a; font-size: 13px; font-weight: 600; }
				.login-input {
					width: 100%;
					min-height: 48px;
					margin: 0 0 10px;
					padding: 0 14px;
					border: 1px solid #cbd2cc;
					border-radius: 3px;
					background: #fff;
					color: #202923;
					font: inherit;
					font-size: 14px;
				}
				.login-input:focus { border-color: #3a725c; outline: 3px solid rgb(58 114 92 / 16%); }
				.login-input[aria-invalid="true"] { border-color: #b34239; }
				.login-password-wrap { position: relative; margin-bottom: 10px; }
				.login-password-wrap .login-input { margin-bottom: 0; padding-right: 82px; }
				.login-password-toggle {
					position: absolute;
					top: 50%;
					right: 12px;
					padding: 6px;
					border: 0;
					background: transparent;
					color: #315f4b;
					font: inherit;
					font-size: 12px;
					font-weight: 700;
					cursor: pointer;
					transform: translateY(-50%);
				}
				.login-password-toggle:focus-visible, .login-forgot:focus-visible, .login-submit:focus-visible {
					outline: 3px solid rgb(58 114 92 / 35%);
					outline-offset: 3px;
				}
				.login-field-error { margin: -6px 0 4px; color: #a2342b; font-size: 12px; }
				.login-options { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 0 0 12px; }
				.login-remember { display: inline-flex; align-items: center; gap: 8px; color: #536057 !important; font-size: 13px !important; font-weight: 400 !important; cursor: pointer; }
				.login-remember input { width: 16px; height: 16px; margin: 0; accent-color: #245541; }
				.login-forgot { padding: 4px 0; border: 0; background: transparent; color: #315f4b; font: inherit; font-size: 13px; font-weight: 600; cursor: pointer; }
				.login-submit {
					min-height: 48px;
					border: 0;
					border-radius: 3px;
					background: #245541;
					color: #fff;
					font: inherit;
					font-size: 14px;
					font-weight: 700;
					cursor: pointer;
				}
				.login-submit:hover { background: #193f30; }
				.login-feedback { margin: 8px 0; padding: 11px 12px; border-left: 3px solid #b34239; background: #fff0ed; color: #782a25; font-size: 13px; line-height: 1.45; }
				.login-feedback[role="status"] { border-color: #47785d; background: #edf5ed; color: #28563c; }
				@media (max-width: 760px) {
					.college-login { grid-template-columns: 1fr; }
					.login-brand-panel { min-height: 245px; padding: 26px 28px; }
					.login-brand-copy { padding: 32px 0 24px; }
					.login-brand-copy h1 { max-width: 560px; font-size: 36px; }
					.login-brand-copy p { margin-top: 12px; }
					.login-brand-panel::after { right: -125px; bottom: -126px; width: 220px; height: 220px; }
					.login-campus-note { display: none; }
					.login-form-panel { align-items: flex-start; padding: 38px 28px 52px; }
				}
				@media (max-width: 420px) {
					.login-options { align-items: flex-start; flex-direction: column; }
					.login-brand-copy h1 { font-size: 32px; }
				}
			`}</style>

			<section className="login-brand-panel" aria-label="Application">
				<div className="login-brand-mark">
					<span className="login-brand-monogram" aria-hidden="true">IT</span>
					<span>CAMPUS TECHNOLOGY</span>
				</div>
				<div className="login-brand-copy">
					<p className="login-eyebrow">COLLEGE IT SERVICES</p>
					<h1>College IT Asset Management System</h1>
					<p>One place to manage campus equipment and technology support.</p>
				</div>
				<p className="login-campus-note">INFORMATION TECHNOLOGY · ASSET SERVICES</p>
			</section>

			<main className="login-form-panel">
				<div className="login-form-content">
					<header className="login-form-heading">
						<p className="login-eyebrow">ACCOUNT ACCESS</p>
						<h2>User Login</h2>
						<p>Sign in with your college account.</p>
					</header>

					<form className="login-form" onSubmit={handleSubmit} noValidate>
						<label htmlFor="login-username">Email or username</label>
						<input
							className="login-input"
							id="login-username"
							name="username"
							type="text"
							autoComplete="username"
							value={username}
							aria-invalid={Boolean(errors.username)}
							aria-describedby={errors.username ? "login-username-error" : undefined}
							onChange={(event) => setUsername(event.target.value)}
						/>
						{errors.username && <p className="login-field-error" id="login-username-error">{errors.username}</p>}

						<label htmlFor="login-password">Password</label>
						<div className="login-password-wrap">
							<input
								className="login-input"
								id="login-password"
								name="password"
								type={showPassword ? "text" : "password"}
								autoComplete="current-password"
								value={password}
								aria-invalid={Boolean(errors.password)}
								aria-describedby={errors.password ? "login-password-error" : undefined}
								onChange={(event) => setPassword(event.target.value)}
							/>
							<button
								className="login-password-toggle"
								type="button"
								aria-label={showPassword ? "Hide password" : "Show password"}
								aria-pressed={showPassword}
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? "Hide" : "Show"}
							</button>
						</div>
						{errors.password && <p className="login-field-error" id="login-password-error">{errors.password}</p>}

						<div className="login-options">
							<label className="login-remember" htmlFor="login-remember">
								<input
									id="login-remember"
									name="rememberMe"
									type="checkbox"
									checked={rememberMe}
									onChange={(event) => setRememberMe(event.target.checked)}
								/>
								Remember me
							</label>
							<button className="login-forgot" type="button" onClick={handleForgotPassword}>
								Forgot Password?
							</button>
						</div>

						{message && <p className="login-feedback" role="status">{message}</p>}
						<button className="login-submit" type="submit">Login</button>
					</form>
				</div>
			</main>
		</div>
	);
}

export default Login;
