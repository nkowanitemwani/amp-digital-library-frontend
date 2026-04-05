"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// =============================================================
// TYPES
// =============================================================

interface StudentLoginForm {
  schoolID:  string;
  username:  string;
  password:  string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

// =============================================================
// PAGE
// =============================================================

export default function StudentLoginPage() {
  const router = useRouter();

  const [form, setForm]         = useState<StudentLoginForm>({ schoolID: "", username: "", password: "" });
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Basic client-side presence check — the server validates fully.
    if (!form.schoolID.trim() || !form.username.trim() || !form.password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/auth/grade/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          school_id: form.schoolID.trim(),
          username:  form.username.trim(),
          password:  form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setError("Too many failed attempts. This account is temporarily locked. Please ask your teacher.");
        } else if (res.status === 403) {
          setError("This account has been deactivated. Please speak to your teacher.");
        } else {
          // 401 covers both wrong username and wrong password — same message
          // for both so students cannot enumerate valid usernames.
          setError(data.error ?? "Incorrect username or password. Please try again.");
        }
        return;
      }

      // Store the grade JWT — the dashboard reads role from this token
      // and renders the student view automatically.
      if (data.token) {
        localStorage.setItem("amp_token", data.token);
      }

      router.push("/dashboard");

    } catch {
      setError("Could not reach the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-input {
          width: 100%; height: 48px;
          border: 1.5px solid rgba(0,0,0,0.12); border-radius: 10px;
          padding: 0 14px; font-size: 14px;
          font-family: 'DM Sans', system-ui, sans-serif;
          color: #0A0A0A; background: #fff; outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .auth-input:focus {
          border-color: #1D4ED8;
          box-shadow: 0 0 0 3px rgba(29,78,216,0.1);
        }
        .auth-input.err {
          border-color: #EF4444;
          box-shadow: 0 0 0 3px rgba(239,68,68,0.08);
        }
        .auth-input::placeholder { color: #94A3B8; }

        .submit-btn {
          width: 100%; height: 52px; border: none; border-radius: 10px;
          background: #1D4ED8; color: #fff; font-size: 16px; font-weight: 700;
          font-family: 'DM Sans', system-ui, sans-serif; cursor: pointer;
          transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
          box-shadow: 0 4px 16px rgba(29,78,216,0.3);
          letter-spacing: 0.01em;
        }
        .submit-btn:hover:not(:disabled) {
          background: #1E40AF;
          box-shadow: 0 6px 20px rgba(29,78,216,0.4);
        }
        .submit-btn:active:not(:disabled) { transform: scale(0.99); }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        /* Left panel — dark navy, accessibility mission tone */
        .left-panel {
          background:
            radial-gradient(ellipse 70% 60% at 15% 10%,  rgba(29,78,216,0.85) 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 85% 90%,  rgba(234,88,12,0.3)  0%, transparent 55%),
            #0F172A;
          padding: 48px;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        /* Decorative orbs */
        .orb {
          position: absolute; border-radius: 50%;
          background: rgba(255,255,255,0.04);
          pointer-events: none;
        }

        /* Dark pill badge */
        .dark-pill {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 100px; padding: 7px 16px;
          font-size: 13px; font-weight: 500; color: #CBD5E1;
          margin-bottom: 10px;
        }

        /* Step indicator */
        .step {
          display: flex; align-items: flex-start; gap: 14px; margin-bottom: 20px;
        }
        .step-num {
          width: 28px; height: 28px; border-radius: 50%;
          background: rgba(96,165,250,0.2); border: 1px solid rgba(96,165,250,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: #93C5FD;
          flex-shrink: 0; margin-top: 1px;
        }

        @media (max-width: 768px) {
          .left-panel  { display: none !important; }
          .right-panel { grid-column: 1 / -1 !important; }
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 20px; height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
        }

        /* School ID helper tooltip */
        .helper-text {
          font-size: 11px; color: #94A3B8; margin-top: 5px; line-height: 1.5;
        }
      `}</style>

      {/* ══════════════════════════════════════
          LEFT PANEL — student-focused content
      ══════════════════════════════════════ */}
      <div className="left-panel">
        {/* Decorative orbs */}
        <div className="orb" style={{ width: 400, height: 400, top: -150, right: -150 }} />
        <div className="orb" style={{ width: 280, height: 280, bottom: -80, left: -80 }} />

        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", position: "relative", zIndex: 1 }}>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: "#fff" }}>
            Amp<span style={{ color: "#60A5FA" }}>.</span>
          </span>
        </Link>

        {/* Central content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 0", position: "relative", zIndex: 1 }}>

          {/* Mission badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.25)",
            borderRadius: 100, padding: "6px 14px",
            fontSize: 12, fontWeight: 600, color: "#93C5FD",
            marginBottom: 28, width: "fit-content",
          }}>
            <span style={{ fontSize: 16 }}>🎧</span>
            Student Library Access
          </div>

          {/* Headline */}
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
            fontWeight: 400, color: "#fff",
            lineHeight: 1.2, letterSpacing: "-0.025em",
            marginBottom: 16,
          }}>
            Your lessons,
            <br />
            <em style={{ color: "#FED7AA" }}>ready to listen.</em>
          </h2>

          <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.75, marginBottom: 36, maxWidth: 320 }}>
            Sign in with your grade account to access your school's audio library.
            Pick a subject, choose a unit, and start listening.
          </p>

          {/* How to sign in steps */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
              How to sign in
            </p>

            <div className="step">
              <div className="step-num">1</div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0" }}>Ask your teacher for the School ID</p>
                <p style={{ fontSize: 12, color: "#64748B", marginTop: 3 }}>Your teacher has the School ID for your school</p>
              </div>
            </div>

            <div className="step">
              <div className="step-num">2</div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0" }}>Enter your grade username</p>
                <p style={{ fontSize: 12, color: "#64748B", marginTop: 3 }}>e.g. "grade3" — shared by everyone in your class</p>
              </div>
            </div>

            <div className="step">
              <div className="step-num">3</div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#E2E8F0" }}>Press play and start listening</p>
                <p style={{ fontSize: 12, color: "#64748B", marginTop: 3 }}>Browse your subjects and choose a unit</p>
              </div>
            </div>
          </div>

          {/* Feature pills */}
          <div style={{ marginTop: 32 }}>
            <div className="dark-pill">
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22C55E", display: "inline-block" }} />
              No personal account needed
            </div>
            <div className="dark-pill">
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#60A5FA", display: "inline-block" }} />
              Works on any school computer
            </div>
          </div>
        </div>

        {/* Bottom — link to admin login */}
        <div style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20 }}>
          <p style={{ fontSize: 13, color: "#475569" }}>
            Are you a teacher?{" "}
            <Link href="/login" style={{ color: "#60A5FA", fontWeight: 600, textDecoration: "none" }}>
              Admin sign in →
            </Link>
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════
          RIGHT PANEL — login form
      ══════════════════════════════════════ */}
      <div
        className="right-panel"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "48px 32px", background: "#fff",
        }}
      >
        <div style={{ width: "100%", maxWidth: 400 }}>

          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 34, fontWeight: 400,
              letterSpacing: "-0.025em", color: "#0A0A0A", marginBottom: 8,
            }}>
              Student sign in.
            </h1>
            <p style={{ fontSize: 15, color: "#64748B" }}>
              Use your grade login details to access the library.
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div style={{
              background: "#FEF2F2", border: "1px solid #FECACA",
              borderRadius: 10, padding: "12px 16px",
              marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 10,
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
              <p style={{ fontSize: 13, color: "#B91C1C", lineHeight: 1.5 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* School ID */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                School ID
              </label>
              <input
                className={`auth-input ${error ? "err" : ""}`}
                type="text"
                name="schoolID"
                value={form.schoolID}
                onChange={handleChange}
                placeholder="Ask your teacher for this"
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
              />
              {/* Helper text so students know where to find the School ID */}
              <p className="helper-text">
                Your teacher has this — it looks like a long string of letters and numbers
              </p>
            </div>

            {/* Username */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Grade username
              </label>
              <input
                className={`auth-input ${error ? "err" : ""}`}
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="e.g. grade3"
                autoComplete="username"
                autoCapitalize="off"
                spellCheck={false}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  className={`auth-input ${error ? "err" : ""}`}
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  style={{
                    position: "absolute", right: 14, top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none",
                    cursor: "pointer", fontSize: 16,
                    color: "#94A3B8", padding: 0,
                  }}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <span className="spinner" />
                  Signing in…
                </span>
              ) : (
                "Sign in to my library 🎧"
              )}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "24px 0" }}>
            <div style={{ flex: 1, height: 1, background: "#F1F5F9" }} />
            <span style={{ fontSize: 12, color: "#94A3B8" }}>not a student?</span>
            <div style={{ flex: 1, height: 1, background: "#F1F5F9" }} />
          </div>

          {/* Admin link */}
          <p style={{ textAlign: "center", fontSize: 14, color: "#64748B" }}>
            Teacher or admin?{" "}
            <Link href="/login" style={{ color: "#1D4ED8", fontWeight: 600, textDecoration: "none" }}>
              Admin sign in →
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
}