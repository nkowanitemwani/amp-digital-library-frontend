"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  location: string;
}

type FormErrors = Partial<Record<keyof RegisterForm, string>>;

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm]         = useState<RegisterForm>({ name: "", email: "", password: "", confirmPassword: "", location: "" });
  const [errors, setErrors]     = useState<FormErrors>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading]   = useState(false);
  const [showPass, setShowPass] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof RegisterForm]) setErrors(prev => ({ ...prev, [name]: undefined }));
    if (apiError) setApiError("");
  }

  function validate(): boolean {
    const next: FormErrors = {};
    if (!form.name.trim() || form.name.trim().length < 2)
      next.name = "School name must be at least 2 characters.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Please enter a valid email address.";
    if (!form.password || form.password.length < 8)
      next.password = "Password must be at least 8 characters.";
    if (form.password !== form.confirmPassword)
      next.confirmPassword = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError("");

    try {
      const res  = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:     form.name.trim(),
          email:    form.email.trim(),
          password: form.password,
          location: form.location.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          setApiError("An account with this email already exists. Did you mean to sign in?");
        } else {
          setApiError(data.error ?? "Registration failed. Please try again.");
        }
        return;
      }

      router.push("/login?registered=true");

    } catch {
      setApiError("Could not reach the server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  function passwordStrength(p: string): { label: string; color: string; width: string } {
    if (!p)                                              return { label: "",          color: "#E2E8F0", width: "0%"   };
    if (p.length < 8)                                   return { label: "Too short", color: "#EF4444", width: "25%"  };
    if (p.length < 12 && !/[^a-zA-Z0-9]/.test(p))     return { label: "Weak",      color: "#F97316", width: "40%"  };
    if (p.length >= 12 && /[^a-zA-Z0-9]/.test(p))     return { label: "Strong",    color: "#22C55E", width: "100%" };
    return { label: "Fair", color: "#EAB308", width: "65%" };
  }
  const strength = passwordStrength(form.password);

  return (
    <div style={{
      minHeight: "100vh",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-input {
          width: 100%; height: 48px;
          border: 1.5px solid rgba(0,0,0,0.12); border-radius: 10px;
          padding: 0 14px; font-size: 14px;
          font-family: 'DM Sans', system-ui, sans-serif;
          color: #0A0A0A; background: #fff; outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .auth-input:focus { border-color: #1D4ED8; box-shadow: 0 0 0 3px rgba(29,78,216,0.1); }
        .auth-input.err  { border-color: #EF4444; box-shadow: 0 0 0 3px rgba(239,68,68,0.08); }
        .auth-input::placeholder { color: #94A3B8; }

        .submit-btn {
          width: 100%; height: 48px; border: none; border-radius: 10px;
          background: #1D4ED8; color: #fff; font-size: 15px; font-weight: 700;
          font-family: 'DM Sans', system-ui, sans-serif; cursor: pointer;
          transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
          box-shadow: 0 4px 16px rgba(29,78,216,0.3);
        }
        .submit-btn:hover:not(:disabled) { background: #1E40AF; }
        .submit-btn:active:not(:disabled) { transform: scale(0.99); }
        .submit-btn:disabled { opacity: 0.65; cursor: not-allowed; }

        .field-err { font-size: 12px; color: #EF4444; margin-top: 5px; }

        /* Left panel — warm mission-focused, lighter than login */
        .left-panel {
          background:
            radial-gradient(ellipse 70% 50% at 15% 10%,  rgba(219,234,254,0.85) 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 85% 85%,  rgba(254,215,170,0.60) 0%, transparent 55%),
            radial-gradient(ellipse 50% 60% at 50% 50%,  rgba(220,252,231,0.30) 0%, transparent 60%),
            #F8FAFF;
          padding: 48px;
          display: flex; flex-direction: column;
        }

        /* Impact number */
        .impact-num {
          font-family: 'DM Serif Display', serif;
          font-size: 3rem; font-weight: 400;
          color: #1D4ED8; line-height: 1;
        }

        @media (max-width: 768px) {
          .left-panel  { display: none !important; }
          .right-panel { grid-column: 1 / -1 !important; }
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite; display: inline-block;
        }
      `}</style>

      {/* ── LEFT PANEL ── */}
      <div className="left-panel">
        <Link href="/" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: "#0A0A0A" }}>
            Amp<span style={{ color: "#1D4ED8" }}>.</span>
          </span>
        </Link>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 0" }}>

          {/* Accessibility badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#EFF6FF", border: "1px solid #BFDBFE",
            borderRadius: 100, padding: "6px 14px",
            fontSize: 12, fontWeight: 600, color: "#1D4ED8",
            marginBottom: 24, width: "fit-content",
          }}>
            <span style={{ fontSize: 14 }}>♿</span>
            Free for all schools
          </div>

          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
            fontWeight: 400, lineHeight: 1.2,
            letterSpacing: "-0.025em", marginBottom: 20, color: "#0A0A0A",
          }}>
            Give your visually<br />
            impaired students<br />
            <em style={{ color: "#1D4ED8" }}>a voice in class.</em>
          </h2>

          <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.75, marginBottom: 36, maxWidth: 340 }}>
            Register your school and upload your first textbook today.
            Every visually impaired student in your school can be
            listening to their lessons within minutes.
          </p>

          {/* What you get */}
          <div style={{ marginBottom: 36 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>
              What you get
            </p>
            {[
              { icon: "🎧", text: "Automatic audio for every PDF you upload" },
              { icon: "📂", text: "Organise books by subject and unit number" },
              { icon: "🔒", text: "Your library is private to your school" },
              { icon: "🖥️", text: "Works in any school computer lab" },
              { icon: "♾️",  text: "No limit on books or categories" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                <span style={{ fontSize: 18, width: 24, textAlign: "center", flexShrink: 0 }}>{icon}</span>
                <span style={{ fontSize: 14, color: "#374151" }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Impact stat */}
          <div style={{
            background: "rgba(255,255,255,0.7)",
            border: "1px solid rgba(0,0,0,0.07)",
            borderRadius: 14, padding: "20px 20px",
            backdropFilter: "blur(8px)",
          }}>
            <p className="impact-num">1 in 4</p>
            <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6, marginTop: 8 }}>
              students in sub-Saharan Africa has a visual impairment that affects their
              ability to access printed learning materials.
            </p>
          </div>
        </div>

        <p style={{ fontSize: 13, color: "#64748B" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#1D4ED8", fontWeight: 600, textDecoration: "none" }}>
            Sign in here →
          </Link>
        </p>
      </div>

      {/* ── RIGHT PANEL — registration form ── */}
      <div
        className="right-panel"
        style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "48px 32px", background: "#fff", overflowY: "auto",
        }}
      >
        <div style={{ width: "100%", maxWidth: 420 }}>

          <div style={{ marginBottom: 32 }}>
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 34, fontWeight: 400,
              letterSpacing: "-0.025em", color: "#0A0A0A", marginBottom: 8,
            }}>
              Register your school.
            </h1>
            <p style={{ fontSize: 15, color: "#64748B" }}>
              Set up your library in under two minutes.
            </p>
          </div>

          {/* API error */}
          {apiError && (
            <div style={{
              background: "#FEF2F2", border: "1px solid #FECACA",
              borderRadius: 10, padding: "12px 16px",
              marginBottom: 20, display: "flex", alignItems: "flex-start", gap: 10,
            }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>⚠️</span>
              <p style={{ fontSize: 13, color: "#B91C1C", lineHeight: 1.5 }}>{apiError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>

            {/* School name */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                School name <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                className={`auth-input ${errors.name ? "err" : ""}`}
                type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="e.g. Kabulonga Secondary School"
                autoComplete="organization"
              />
              {errors.name && <p className="field-err">⚠ {errors.name}</p>}
            </div>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Email address <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                className={`auth-input ${errors.email ? "err" : ""}`}
                type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="admin@yourschool.edu"
                autoComplete="email"
              />
              {errors.email && <p className="field-err">⚠ {errors.email}</p>}
            </div>

            {/* Location */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Location <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 400 }}>(optional)</span>
              </label>
              <input
                className="auth-input"
                type="text" name="location" value={form.location} onChange={handleChange}
                placeholder="e.g. Lusaka, Zambia"
                autoComplete="address-level2"
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Password <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  className={`auth-input ${errors.password ? "err" : ""}`}
                  type={showPass ? "text" : "password"} name="password"
                  value={form.password} onChange={handleChange}
                  placeholder="At least 8 characters"
                  autoComplete="new-password" style={{ paddingRight: 44 }}
                />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#94A3B8", padding: 0 }}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
              {form.password && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ height: 3, background: "#F1F5F9", borderRadius: 2, overflow: "hidden", marginBottom: 4 }}>
                    <div style={{ height: "100%", width: strength.width, background: strength.color, borderRadius: 2, transition: "width 0.3s, background 0.3s" }} />
                  </div>
                  <span style={{ fontSize: 11, color: strength.color, fontWeight: 600 }}>{strength.label}</span>
                </div>
              )}
              {errors.password && <p className="field-err">⚠ {errors.password}</p>}
            </div>

            {/* Confirm password */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
                Confirm password <span style={{ color: "#EF4444" }}>*</span>
              </label>
              <input
                className={`auth-input ${errors.confirmPassword ? "err" : ""}`}
                type={showPass ? "text" : "password"} name="confirmPassword"
                value={form.confirmPassword} onChange={handleChange}
                placeholder="Repeat your password"
                autoComplete="new-password"
              />
              {errors.confirmPassword && <p className="field-err">⚠ {errors.confirmPassword}</p>}
            </div>

            <button className="submit-btn" type="submit" disabled={loading}>
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <span className="spinner" /> Creating your library…
                </span>
              ) : "Create my school library →"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 14, color: "#64748B", marginTop: 24 }}>
            Already registered?{" "}
            <Link href="/login" style={{ color: "#1D4ED8", fontWeight: 600, textDecoration: "none" }}>
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}