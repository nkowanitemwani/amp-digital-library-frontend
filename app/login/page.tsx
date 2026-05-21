"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Volume2, MessageSquare, PenLine, CheckCircle, AlertCircle } from "lucide-react";

interface LoginForm {
  email: string;
  password: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

function LoginContent() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";

  const [form, setForm]       = useState<LoginForm>({ email: "", password: "" });
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error) setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res  = await fetch(`${API_BASE}/auth/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 429)      setError("Too many failed attempts. Your account is temporarily locked. Please try again later.");
        else if (res.status === 403) setError("This account has been deactivated. Please contact your administrator.");
        else                         setError(data.error ?? "Login failed. Please try again.");
        return;
      }
      if (data.token) localStorage.setItem("amp_token", data.token);
      router.push("/dashboard");
    } catch {
      setError("Could not reach the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", display: "grid", gridTemplateColumns: "1fr 1fr" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .auth-input { width: 100%; height: 48px; border: 1.5px solid rgba(0,0,0,0.12); border-radius: 10px; padding: 0 14px; font-size: 14px; font-family: 'DM Sans', system-ui, sans-serif; color: #0A0A0A; background: #fff; outline: none; transition: border-color 0.15s, box-shadow 0.15s; }
        .auth-input:focus { border-color: #1D4ED8; box-shadow: 0 0 0 3px rgba(29,78,216,0.1); }
        .auth-input.err  { border-color: #EF4444; box-shadow: 0 0 0 3px rgba(239,68,68,0.08); }
        .auth-input::placeholder { color: #94A3B8; }
        .submit-btn { width: 100%; height: 48px; border: none; border-radius: 10px; background: #1D4ED8; color: #fff; font-size: 15px; font-weight: 700; font-family: 'DM Sans', system-ui, sans-serif; cursor: pointer; transition: background 0.15s, transform 0.1s, box-shadow 0.15s; box-shadow: 0 4px 16px rgba(29,78,216,0.3); }
        .submit-btn:hover:not(:disabled) { background: #1E40AF; box-shadow: 0 6px 20px rgba(29,78,216,0.4); }
        .submit-btn:active:not(:disabled) { transform: scale(0.99); }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }
        .left-panel { background: radial-gradient(ellipse 70% 50% at 10% 10%, rgba(29,78,216,0.9) 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 90% 90%, rgba(234,88,12,0.35) 0%, transparent 55%), #0F172A; padding: 48px; display: flex; flex-direction: column; position: relative; overflow: hidden; }
        .orb { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.04); pointer-events: none; }
        .feature-row { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 18px; }
        .feature-icon { width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
        .dark-pill { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); border-radius: 100px; padding: 7px 14px; font-size: 12px; font-weight: 500; color: #CBD5E1; margin-bottom: 8px; width: fit-content; }
        @media (max-width: 768px) { .left-panel { display: none !important; } .right-panel { grid-column: 1 / -1 !important; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner { width: 18px; height: 18px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
      `}</style>

      {/* ── LEFT PANEL ── */}
      <div className="left-panel">
        <div className="orb" style={{ width: 400, height: 400, top: -150, right: -150 }} />
        <div className="orb" style={{ width: 300, height: 300, bottom: -100, left: -100 }} />

        <Link href="/" style={{ textDecoration: "none", position: "relative", zIndex: 1 }}>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: "#fff" }}>
            Amplify<span style={{ color: "#60A5FA" }}>.</span>
          </span>
        </Link>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 0", position: "relative", zIndex: 1 }}>

          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.25)", borderRadius: 100, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#93C5FD", marginBottom: 24, width: "fit-content" }}>
            Accessibility for all learners
          </div>

          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 400, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.025em", marginBottom: 12 }}>
            Every lesson.<br />Every student.<br />
            <em style={{ color: "#FED7AA" }}>No one left behind.</em>
          </h2>

          <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.7, marginBottom: 28, maxWidth: 310 }}>
            Upload one PDF textbook and Amplify automatically creates three complete learning formats for your visually impaired students.
          </p>

          <div className="feature-row">
            <div className="feature-icon" style={{ background: "rgba(251,191,36,0.15)", border: "1px solid rgba(251,191,36,0.2)" }}>
              <Volume2 size={18} color="#FBBF24" />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0", marginBottom: 3 }}>Audio Lesson</p>
              <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>The full unit narrated clearly — students listen while the class follows along.</p>
            </div>
          </div>

          <div className="feature-row">
            <div className="feature-icon" style={{ background: "rgba(96,165,250,0.15)", border: "1px solid rgba(96,165,250,0.2)" }}>
              <MessageSquare size={18} color="#60A5FA" />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0", marginBottom: 3 }}>Teaching Dialogue</p>
              <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>Two AI voices discuss the topic in a Socratic format — explains the why, not just the what.</p>
            </div>
          </div>

          <div className="feature-row">
            <div className="feature-icon" style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.2)" }}>
              <PenLine size={18} color="#34D399" />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#E2E8F0", marginBottom: 3 }}>Spoken Quiz</p>
              <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>Questions read aloud, answered by pressing 1–4. No reading or writing required.</p>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <div className="dark-pill">
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", display: "inline-block" }} />
              One PDF upload — three formats generated
            </div>
            <div className="dark-pill">
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#60A5FA", display: "inline-block" }} />
              Works on any school computer
            </div>
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 1, borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 20 }}>
          <p style={{ fontSize: 13, color: "#475569" }}>
            Are you a student?{" "}
            <Link href="/student/login" style={{ color: "#60A5FA", fontWeight: 600, textDecoration: "none" }}>Student sign in →</Link>
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="right-panel" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 32px", background: "#fff" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>

          {justRegistered && (
            <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 10, padding: "12px 16px", marginBottom: 24, display: "flex", alignItems: "flex-start", gap: 10 }}>
              <CheckCircle size={18} color="#15803D" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 13, color: "#15803D", lineHeight: 1.5 }}>Your school library has been created. Sign in below to get started.</p>
            </div>
          )}

          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, fontWeight: 400, letterSpacing: "-0.025em", color: "#0A0A0A", marginBottom: 8 }}>Welcome back.</h1>
            <p style={{ fontSize: 15, color: "#64748B" }}>Sign in to your school's library.</p>
          </div>

          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 10 }}>
              <AlertCircle size={16} color="#B91C1C" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 13, color: "#B91C1C", lineHeight: 1.5 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Email address</label>
              <input className={`auth-input ${error ? "err" : ""}`} type="email" name="email" value={form.email} onChange={handleChange} placeholder="admin@yourschool.edu" autoComplete="email" required />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input className={`auth-input ${error ? "err" : ""}`} type={showPass ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="Enter your password" autoComplete="current-password" style={{ paddingRight: 44 }} required />
                <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#94A3B8", padding: 0 }} aria-label={showPass ? "Hide password" : "Show password"} />
              </div>
            </div>
            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}><span className="spinner" /> Signing in…</span> : "Sign in"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "24px 0" }}>
            <div style={{ flex: 1, height: 1, background: "#F1F5F9" }} />
            <span style={{ fontSize: 12, color: "#94A3B8" }}>or</span>
            <div style={{ flex: 1, height: 1, background: "#F1F5F9" }} />
          </div>

          <p style={{ textAlign: "center", fontSize: 14, color: "#64748B", marginBottom: 8 }}>
            Don't have an account?{" "}
            <Link href="/register" style={{ color: "#1D4ED8", fontWeight: 600, textDecoration: "none" }}>Register your school →</Link>
          </p>
          <p style={{ textAlign: "center", fontSize: 14, color: "#64748B" }}>
            Are you a student?{" "}
            <Link href="/student/login" style={{ color: "#1D4ED8", fontWeight: 600, textDecoration: "none" }}>Student sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return <Suspense fallback={null}><LoginContent /></Suspense>;
}