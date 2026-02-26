import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  GraduationCap,
  Users,
  BarChart2,
  CreditCard,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  User,
  Lock,
  ArrowRight,
  ShieldCheck,
  Mail,
} from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const { login, sendMagicLink } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setUnverifiedEmail(null);

    try {
      setLoading(true);
      await login({ identifier, password });
      navigate("/dashboard");
    } catch (err: any) {
      setLoading(false);
      if (err.code === "EMAIL_NOT_CONFIRMED") {
        setUnverifiedEmail(err.email);
        setError("Your email is not verified yet.");
        return;
      }
      setError(err.message || "Login failed.");
    }
  }

  async function handleSendVerification() {
    if (!unverifiedEmail) return;
    try {
      await sendMagicLink(unverifiedEmail);
      setVerificationSent(true);
    } catch (err) {
      console.error(err);
      setError("Failed to send verification email. Try again.");
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

        .lp-root {
          min-height: 100vh;
          display: flex;
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
          background: #F6F9FC;
          -webkit-font-smoothing: antialiased;
        }

        /* ── LEFT PANEL ── */
        .lp-left {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 3rem;
          flex: 1;
          position: relative;
          background: linear-gradient(145deg, #1E88E5 0%, #5B9FFF 100%);
          overflow: hidden;
        }

        @media (min-width: 1024px) {
          .lp-left { display: flex; }
        }

        /* subtle grid */
        .lp-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px);
          background-size: 44px 44px;
        }

        /* light radial glows */
        .lp-glow-1 {
          position: absolute;
          width: 380px; height: 380px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          filter: blur(60px);
          top: -80px; left: -80px;
          animation: lpFloat 10s ease-in-out infinite;
        }
        .lp-glow-2 {
          position: absolute;
          width: 280px; height: 280px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          filter: blur(50px);
          bottom: -60px; right: -40px;
          animation: lpFloat 14s ease-in-out infinite reverse;
        }

        @keyframes lpFloat {
          0%, 100% { transform: translate(0,0); }
          50%       { transform: translate(16px, -20px); }
        }

        .lp-left-content {
          position: relative;
          z-index: 10;
          text-align: center;
          max-width: 380px;
        }

        .lp-logo-wrap {
          width: 76px; height: 76px;
          border-radius: 22px;
          background: rgba(255,255,255,0.2);
          border: 1.5px solid rgba(255,255,255,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          backdrop-filter: blur(8px);
        }

        .lp-left-title {
          font-size: 2.125rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.03em;
          line-height: 1.2;
          margin-bottom: 1rem;
        }

        .lp-left-sub {
          font-size: 0.9375rem;
          color: rgba(255,255,255,0.78);
          line-height: 1.65;
          margin-bottom: 2.5rem;
        }

        /* Feature chips */
        .lp-chips {
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }

        .lp-chip {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.22);
          border-radius: 12px;
          padding: 0.75rem 1rem;
          backdrop-filter: blur(8px);
          text-align: left;
          animation: chipFloat 7s ease-in-out infinite;
        }
        .lp-chip:nth-child(2) { animation-delay: -2.5s; }
        .lp-chip:nth-child(3) { animation-delay: -5s; }

        @keyframes chipFloat {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-5px); }
        }

        .lp-chip-icon {
          width: 36px; height: 36px;
          border-radius: 9px;
          background: rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        .lp-chip-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #fff;
          display: block;
        }
        .lp-chip-sub {
          font-size: 0.78rem;
          color: rgba(255,255,255,0.65);
        }

        /* ── RIGHT PANEL ── */
        .lp-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1.25rem;
          background: #F6F9FC;
        }

        .lp-card {
          width: 100%;
          max-width: 440px;
          background: #ffffff;
          border-radius: 24px;
          border: 1px solid #E8EDF4;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03);
          padding: 2.5rem 2.25rem;
          position: relative;
        }

        /* thin blue top line accent matching gradient-primary */
        .lp-card::before {
          content: '';
          position: absolute;
          top: -1px; left: 10%; right: 10%;
          height: 3px;
          border-radius: 0 0 3px 3px;
          background: linear-gradient(90deg, #1E88E5, #5B9FFF);
        }

        /* brand row */
        .lp-brand {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
        }

        .lp-brand-icon {
          width: 42px; height: 42px;
          border-radius: 12px;
          background: linear-gradient(135deg, #1E88E5 0%, #5B9FFF 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(30,136,229,0.35);
        }

        .lp-brand-name {
          font-size: 1.0625rem;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.02em;
        }

        .lp-brand-tag {
          font-size: 0.75rem;
          color: #6B7280;
          font-weight: 400;
        }

        /* headings */
        .lp-heading {
          font-size: 1.75rem;
          font-weight: 700;
          color: #111827;
          letter-spacing: -0.025em;
          margin-bottom: 0.35rem;
        }

        .lp-subheading {
          font-size: 0.9rem;
          color: #6B7280;
          margin-bottom: 1.875rem;
        }

        /* form fields */
        .lp-field {
          margin-bottom: 1.125rem;
        }

        .lp-label {
          display: block;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.4375rem;
        }

        .lp-field-wrap {
          position: relative;
        }

        .lp-field-icon {
          position: absolute;
          left: 0.875rem;
          top: 50%;
          transform: translateY(-50%);
          color: #9CA3AF;
          display: flex; align-items: center;
          pointer-events: none;
        }

        .lp-input {
          width: 100%;
          padding: 0.8125rem 0.9375rem 0.8125rem 2.625rem;
          background: #F9FAFB;
          border: 1.5px solid #E5E7EB;
          border-radius: 10px;
          font-size: 0.9375rem;
          font-family: inherit;
          color: #111827;
          outline: none;
          transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
          box-sizing: border-box;
        }

        .lp-input::placeholder { color: #9CA3AF; }

        .lp-input:focus {
          border-color: #3B82F6;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.12);
        }

        .lp-input.pr-icon { padding-right: 2.75rem; }

        .lp-pw-toggle {
          position: absolute;
          right: 0.875rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #9CA3AF;
          padding: 0;
          display: flex; align-items: center;
          transition: color 0.15s;
        }
        .lp-pw-toggle:hover { color: #6B7280; }

        /* error */
        .lp-error {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          padding: 0.75rem 0.875rem;
          background: #FEF2F2;
          border: 1px solid #FECACA;
          border-radius: 10px;
          margin-bottom: 1.125rem;
          color: #DC2626;
          font-size: 0.875rem;
        }

        /* submit */
        .lp-btn {
          width: 100%;
          padding: 0.875rem;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #1E88E5 0%, #5B9FFF 100%);
          color: #fff;
          font-size: 0.9375rem;
          font-weight: 700;
          font-family: inherit;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          box-shadow: 0 4px 14px rgba(30,136,229,0.38);
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          letter-spacing: -0.01em;
          margin-top: 0.25rem;
        }

        .lp-btn:hover:not(:disabled) {
          opacity: 0.93;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(30,136,229,0.45);
        }

        .lp-btn:active:not(:disabled) { transform: translateY(0); }

        .lp-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* spinner */
        .lp-spin {
          width: 17px; height: 17px;
          border: 2.5px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: lpSpin 0.7s linear infinite;
        }

        @keyframes lpSpin { to { transform: rotate(360deg); } }

        /* verification box */
        .lp-verify {
          margin-top: 1.5rem;
          background: #FFFBEB;
          border: 1px solid #FDE68A;
          border-radius: 12px;
          padding: 1rem 1.125rem;
        }

        .lp-verify-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #92400E;
          margin-bottom: 0.25rem;
        }

        .lp-verify-email {
          font-size: 0.8125rem;
          color: #B45309;
          text-decoration: underline;
          text-underline-offset: 2px;
          word-break: break-all;
        }

        .lp-verify-btn {
          margin-top: 0.75rem;
          width: 100%;
          padding: 0.5625rem;
          border-radius: 8px;
          border: 1.5px solid #FCD34D;
          background: #FEF3C7;
          color: #92400E;
          font-size: 0.875rem;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.15s;
        }
        .lp-verify-btn:hover { background: #FDE68A; }

        .lp-verify-success {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.75rem;
          color: #065F46;
          font-size: 0.875rem;
          font-weight: 600;
        }

        /* divider */
        .lp-divider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #9CA3AF;
          font-size: 0.8rem;
          margin: 1.5rem 0 0;
        }
        .lp-divider::before, .lp-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #E5E7EB;
        }

        /* footer note */
        .lp-footer {
          margin-top: 1.5rem;
          text-align: center;
          font-size: 0.8125rem;
          color: #9CA3AF;
        }
        .lp-footer a {
          color: #3B82F6;
          font-weight: 600;
          text-decoration: none;
        }
        .lp-footer a:hover { text-decoration: underline; }
      `}</style>

      <div className="lp-root">

        {/* ── LEFT BRANDING PANEL ── */}
        <div className="lp-left">
          <div className="lp-grid" />
          <div className="lp-glow-1" />
          <div className="lp-glow-2" />

          <div className="lp-left-content">
            <div className="lp-logo-wrap">
              <GraduationCap size={36} color="#fff" strokeWidth={1.75} />
            </div>
            <h1 className="lp-left-title">
              School Management<br />Made Effortless
            </h1>
            <p className="lp-left-sub">
              A unified platform for administrators, teachers,<br />
              students and parents — built for modern schools.
            </p>

            <div className="lp-chips">
              <div className="lp-chip">
                <div className="lp-chip-icon">
                  <Users size={18} color="#fff" strokeWidth={2} />
                </div>
                <div>
                  <span className="lp-chip-label">Student & Teacher Portal</span>
                  <span className="lp-chip-sub">All roles in one place</span>
                </div>
              </div>
              <div className="lp-chip">
                <div className="lp-chip-icon">
                  <BarChart2 size={18} color="#fff" strokeWidth={2} />
                </div>
                <div>
                  <span className="lp-chip-label">Analytics & Reports</span>
                  <span className="lp-chip-sub">Real-time data insights</span>
                </div>
              </div>
              <div className="lp-chip">
                <div className="lp-chip-icon">
                  <CreditCard size={18} color="#fff" strokeWidth={2} />
                </div>
                <div>
                  <span className="lp-chip-label">Fee Management</span>
                  <span className="lp-chip-sub">Payments & collections</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT FORM PANEL ── */}
        <div className="lp-right">
          <div className="lp-card">

            <h2 className="lp-heading">Welcome back</h2>
            <p className="lp-subheading">Sign in to access your school portal</p>

            {/* Error Banner */}
            {error && !unverifiedEmail && (
              <div className="lp-error">
                <AlertCircle size={15} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin}>
              {/* Identifier */}
              <div className="lp-field">
                <label className="lp-label" htmlFor="login-identifier">
                  Email / Phone / Username
                </label>
                <div className="lp-field-wrap">
                  <span className="lp-field-icon">
                    <User size={15} />
                  </span>
                  <input
                    id="login-identifier"
                    type="text"
                    className="lp-input"
                    placeholder="Enter email, phone or username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    autoComplete="username"
                    autoFocus
                  />
                </div>
              </div>

              {/* Password */}
              <div className="lp-field">
                <label className="lp-label" htmlFor="login-password">
                  Password
                </label>
                <div className="lp-field-wrap">
                  <span className="lp-field-icon">
                    <Lock size={15} />
                  </span>
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    className="lp-input pr-icon"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="lp-pw-toggle"
                    onClick={() => setShowPassword((p) => !p)}
                    tabIndex={-1}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              <button
                id="login-submit"
                type="submit"
                className="lp-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="lp-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={15} strokeWidth={2.5} />
                  </>
                )}
              </button>
            </form>

            {/* Email Verification Prompt */}
            {unverifiedEmail && (
              <div className="lp-verify">
                <div className="lp-verify-title" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                  <AlertTriangle size={14} />
                  Email not verified
                </div>
                <div className="lp-verify-email">{unverifiedEmail}</div>
                {!verificationSent ? (
                  <button className="lp-verify-btn" onClick={handleSendVerification}>
                    Send Verification Email
                  </button>
                ) : (
                  <div className="lp-verify-success">
                    <CheckCircle2 size={15} />
                    Verification email sent! Check your inbox.
                  </div>
                )}
              </div>
            )}

            <div className="lp-divider">
              <ShieldCheck size={13} style={{ flexShrink: 0 }} />
              Secure access
            </div>

            <div className="lp-footer">
              Need help?{" "}
              <a href="mailto:admin@school.com">
                <Mail size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
                Contact your administrator
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
