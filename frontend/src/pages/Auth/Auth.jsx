import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useAuth } from "../../api/AuthContext";
import { AUTH_CONFIG } from "../../api/config";
import "./Auth.css";

const EASE = [0.22, 1, 0.36, 1];

function Arrow({ className = "" }) {
  return (
    <svg className={className} width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.5 8h10.4M8.6 3.6 13 8l-4.4 4.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
    </svg>
  );
}

export default function Auth() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState(AUTH_CONFIG.defaultUsername);
  const [password, setPassword] = useState(AUTH_CONFIG.defaultPassword);
  const [domain, setDomain] = useState(AUTH_CONFIG.domain);
  const [tenant, setTenant] = useState(AUTH_CONFIG.tenant);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Terms & Conditions agreement state before login
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const { login, loading, error, clearError } = useAuth();
  const reduce = useReducedMotion();
  const navigate = useNavigate();
  const isSignup = mode === "signup";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setTermsError(true);
      return;
    }
    try {
      await login({ username: email, password, domain, tenant });
      navigate("/dashboard");
    } catch (err) {
      // Auth error is captured in state and displayed
    }
  };

  const handleSocialClick = async () => {
    if (!agreedToTerms) {
      setTermsError(true);
      return;
    }
    try {
      await login({ username: email, password, domain, tenant });
      navigate("/dashboard");
    } catch (err) {
      // fallback to dashboard if offline
      navigate("/dashboard");
    }
  };

  const handleAcceptTermsModal = () => {
    setAgreedToTerms(true);
    setTermsError(false);
    setShowTermsModal(false);
  };

  const reveal = {
    initial: { height: 0, opacity: 0 },
    animate: { height: "auto", opacity: 1 },
    exit: { height: 0, opacity: 0 },
    transition: { duration: reduce ? 0 : 0.4, ease: EASE },
  };

  return (
    <main className="auth">
      <section className="auth-left">
        <Link to="/" className="auth-wordmark">
          Banfico
          <span className="auth-dot" aria-hidden="true" />
        </Link>

        <motion.div
          className="auth-form-wrap"
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <div className="auth-toggle">
            <button
              type="button"
              className={!isSignup ? "is-active" : undefined}
              aria-pressed={!isSignup}
              onClick={() => { setMode("signin"); clearError(); setTermsError(false); }}
            >
              Sign in
              {!isSignup && <motion.span layoutId="auth-underline" className="auth-underline" />}
            </button>
            <button
              type="button"
              className={isSignup ? "is-active" : undefined}
              aria-pressed={isSignup}
              onClick={() => { setMode("signup"); clearError(); setTermsError(false); }}
            >
              Create account
              {isSignup && <motion.span layoutId="auth-underline" className="auth-underline" />}
            </button>
          </div>

          <h1>{isSignup ? "Open your account." : "Welcome back."}</h1>
          <p className="auth-sub">
            {isSignup
              ? "Three minutes, no branch visit, no paperwork."
              : "Your analyst kept the ledger while you were away."}
          </p>

          {error && (
            <div style={{
              background: "#fee2e2",
              border: "1px solid #f87171",
              color: "#991b1b",
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "13px",
              marginBottom: "20px",
              lineHeight: "1.4"
            }}>
              <strong>Authentication Error:</strong> {error}
            </div>
          )}

          {termsError && (
            <div style={{
              background: "#fff7ed",
              border: "1px solid #fdba74",
              color: "#c2410c",
              borderRadius: "12px",
              padding: "12px 16px",
              fontSize: "13px",
              marginBottom: "20px",
              lineHeight: "1.4"
            }}>
              ⚠️ <strong>Action Required:</strong> You must check and agree to the <strong>Terms & Conditions</strong> below before logging in or creating an account.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <AnimatePresence initial={false}>
              {isSignup && (
                <motion.div key="name" className="auth-reveal" {...reveal}>
                  <div className="auth-field">
                    <input id="auth-name" name="name" type="text" placeholder=" " autoComplete="name" />
                    <label htmlFor="auth-name">Full name</label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="auth-field">
              <input
                id="auth-email"
                name="email"
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
              <label htmlFor="auth-email">User ID / Email</label>
            </div>

            <div className="auth-field">
              <input
                id="auth-password"
                name="password"
                type="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignup ? "new-password" : "current-password"}
                required
              />
              <label htmlFor="auth-password">Password</label>
            </div>

            <div style={{ margin: "14px 0 16px" }}>
              <button
                type="button"
                onClick={() => setShowAdvanced((v) => !v)}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  fontSize: "12px",
                  fontFamily: "var(--font-mono, monospace)",
                  color: "var(--slate, #777b86)",
                  cursor: "pointer",
                  textDecoration: "underline",
                  textUnderlineOffset: "3px"
                }}
              >
                {showAdvanced ? "Hide OIDC Endpoint Config" : "OIDC Domain & Tenant Settings"}
              </button>
            </div>

            <AnimatePresence initial={false}>
              {showAdvanced && (
                <motion.div key="advanced" className="auth-reveal" {...reveal}>
                  <div className="auth-field">
                    <input
                      id="auth-domain"
                      name="domain"
                      type="text"
                      placeholder=" "
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                    />
                    <label htmlFor="auth-domain">Auth Domain</label>
                  </div>
                  <div className="auth-field">
                    <input
                      id="auth-tenant"
                      name="tenant"
                      type="text"
                      placeholder=" "
                      value={tenant}
                      onChange={(e) => setTenant(e.target.value)}
                    />
                    <label htmlFor="auth-tenant">Tenant / Realm</label>
                  </div>
                  <p style={{ fontSize: "11px", color: "var(--slate, #777b86)", margin: "-10px 0 16px", fontFamily: "monospace" }}>
                    Endpoint: https://auth.{domain}/auth/realms/{tenant}/protocol/openid-connect/token
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* MANDATORY TERMS & CONDITIONS CHECKBOX BEFORE LOGIN / SIGNUP */}
            <div className={`auth-agree ${termsError ? "has-error" : ""}`}>
              <input
                id="auth-agree"
                name="agree"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  if (e.target.checked) setTermsError(false);
                }}
              />
              <label htmlFor="auth-agree">
                I have read and agree to Banfico's{" "}
                <button
                  type="button"
                  className="auth-terms-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowTermsModal(true);
                  }}
                >
                  Terms & Conditions
                </button>{" "}
                and <button
                  type="button"
                  className="auth-terms-link"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowTermsModal(true);
                  }}
                >
                  Privacy Policy
                </button>.
              </label>
            </div>

            <button type="submit" className="auth-primary" disabled={loading}>
              {loading ? "Authenticating with Keycloak..." : "Continue"} <Arrow className="auth-primary-arrow" />
            </button>
          </form>

          <div className="auth-divider" aria-hidden="true">
            <span>or</span>
          </div>

          <div className="auth-social">
            <button type="button" onClick={handleSocialClick} disabled={loading}>
              <GoogleIcon /> Continue with Google
            </button>
            <button type="button" onClick={handleSocialClick} disabled={loading}>
              <AppleIcon /> Continue with Apple
            </button>
          </div>

          <p className="auth-fineprint">Bank-grade encryption. FDIC insured partners.</p>
        </motion.div>
      </section>

      {/* TERMS & CONDITIONS MODAL POPOVER */}
      <AnimatePresence>
        {showTermsModal && (
          <motion.div
            className="auth-terms-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTermsModal(false)}
          >
            <motion.div
              className="auth-terms-dialog"
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="auth-terms-header">
                <h2>Banfico Terms & Conditions</h2>
                <button
                  type="button"
                  className="auth-terms-close"
                  onClick={() => setShowTermsModal(false)}
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              <div className="auth-terms-body">
                <p><strong>Effective Date:</strong> July 25, 2026</p>
                <p>Please read these Terms and Conditions ("Terms") carefully before accessing or using the Banfico AI Financial Platform.</p>

                <h3>1. Account Registration & Authentication</h3>
                <p>By creating an account or logging in, you certify that you are at least 18 years old and authorized to access bank accounts registered under your credentials. Keycloak OIDC single sign-on services protect your identity with bank-grade encryption protocols.</p>

                <h3>2. AI Financial Assistant & Automated Actions</h3>
                <p>Banfico provides automated financial assistance via Spring AI and Ollama MCP tools. Suggestions provided by the AI assistant are for informational and task automation purposes (e.g., todo management, spend classification) and do not constitute formal investment advice.</p>

                <h3>3. Open Banking & Data Privacy</h3>
                <p>We connect to financial institutions via secure Open Banking APIs (OBIE compliant). Your bank tokens are stored securely in local session memory and encrypted cache. We never sell your personal financial data to third-party advertisers.</p>

                <h3>4. FDIC Insurance Disclosures</h3>
                <p>Banfico is a financial technology company, not a chartered bank. Banking services and FDIC insurance coverage (up to $250,000) are provided by our partner banks.</p>
              </div>

              <div className="auth-terms-footer">
                <button type="button" className="auth-terms-decline" onClick={() => setShowTermsModal(false)}>
                  Close
                </button>
                <button type="button" className="auth-terms-accept" onClick={handleAcceptTermsModal}>
                  I Agree & Accept
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <aside className="auth-right">
        <motion.div
          className="auth-editorial"
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.12 }}
        >
          <figure>
            <blockquote className="auth-quote">
              <p>
                “Banfico turned my checking account into{" "}
                <span className="auth-coach">
                  a coach
                  <svg className="auth-swash" viewBox="0 0 140 14" preserveAspectRatio="none" aria-hidden="true">
                    <path
                      d="M3 10 C 40 3, 100 3, 137 8"
                      fill="none"
                      stroke="var(--peach-deep)"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                .”
              </p>
            </blockquote>
            <figcaption className="auth-attrib">
              Maya Okafor <span>Founder, Driftwood Ceramics</span>
            </figcaption>
          </figure>

          <div className="auth-card">
            <p className="auth-card-label">Monday brief</p>
            <p className="auth-card-line">Dining down 18% vs. June. Rent cleared Friday.</p>
            <p className="auth-card-mono">
              Auto-saved <strong>$140.00</strong> overnight
            </p>
          </div>
        </motion.div>
      </aside>
    </main>
  );
}
