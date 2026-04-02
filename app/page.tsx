"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─── scroll-reveal hook ───────────────────────────────────────
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── fake library UI data ─────────────────────────────────────
const DEMO_CATEGORIES = [
  { name: "Mathematics", count: 12, color: "#DBEAFE", dot: "#3B82F6" },
  { name: "Science",     count: 8,  color: "#DCFCE7", dot: "#22C55E" },
  { name: "English",     count: 15, color: "#FEF9C3", dot: "#EAB308" },
  { name: "History",     count: 6,  color: "#FFE4E6", dot: "#F43F5E" },
];

const DEMO_BOOKS = [
  { title: "Algebra — Unit 3",     unit: 3,  status: "ready",      time: "18 min" },
  { title: "Algebra — Unit 4",     unit: 4,  status: "ready",      time: "22 min" },
  { title: "Geometry — Unit 1",    unit: 1,  status: "processing", time: "—" },
  { title: "Calculus — Unit 1",    unit: 1,  status: "ready",      time: "31 min" },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 60); return () => clearTimeout(t); }, []);

  const s1 = useInView();
  const s2 = useInView();
  const s3 = useInView();
  const s4 = useInView();

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', system-ui, sans-serif", color: "#0A0A0A", background: "#FAFAFA", overflowX: "hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap');

        * { box-sizing: border-box; }

        /* ── mesh gradient background ── */
        .mesh-hero {
          background:
            radial-gradient(ellipse 80% 50% at 20% -10%, rgba(219,234,254,0.7) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 10%,  rgba(254,226,160,0.5) 0%, transparent 55%),
            radial-gradient(ellipse 50% 60% at 50% 120%, rgba(220,252,231,0.4) 0%, transparent 60%),
            #FAFAFA;
        }

        .mesh-features {
          background:
            radial-gradient(ellipse 70% 50% at 90% 50%, rgba(219,234,254,0.5) 0%, transparent 60%),
            radial-gradient(ellipse 60% 40% at 10% 60%,  rgba(254,215,170,0.4) 0%, transparent 60%),
            #FFFFFF;
        }

        .mesh-cta {
          background:
            radial-gradient(ellipse 80% 60% at 50% 0%,   rgba(29,78,216,1) 0%, rgba(15,23,42,1) 70%),
            #0F172A;
        }

        /* ── floating card shadow ── */
        .float-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid rgba(0,0,0,0.07);
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 20px 60px -10px rgba(0,0,0,0.12);
        }

        /* ── browser chrome mockup ── */
        .browser-chrome {
          background: #F1F5F9;
          border-radius: 14px 14px 0 0;
          padding: 10px 14px;
          display: flex;
          align-items: center;
          gap: 6px;
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }
        .chrome-dot { width: 10px; height: 10px; border-radius: 50%; }
        .chrome-bar { flex: 1; height: 20px; background: #E2E8F0; border-radius: 6px; margin: 0 8px; }

        /* ── pill badge ── */
        .pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.9);
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 100px;
          padding: 6px 14px;
          font-size: 12px; font-weight: 500;
          backdrop-filter: blur(8px);
          box-shadow: 0 1px 3px rgba(0,0,0,0.06);
        }
        .pill-dot { width: 7px; height: 7px; border-radius: 50%; background: #22C55E; }

        /* ── reveal animation ── */
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.65s ease, transform 0.65s ease; }
        .reveal.in { opacity: 1; transform: translateY(0); }
        .d1 { transition-delay: 0.08s; }
        .d2 { transition-delay: 0.18s; }
        .d3 { transition-delay: 0.28s; }
        .d4 { transition-delay: 0.38s; }

        /* ── hero entrance ── */
        .hero-in { opacity: 0; transform: translateY(20px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .hero-in.mounted { opacity: 1; transform: translateY(0); }
        .hi-1 { transition-delay: 0.05s; }
        .hi-2 { transition-delay: 0.18s; }
        .hi-3 { transition-delay: 0.32s; }
        .hi-4 { transition-delay: 0.46s; }
        .hi-5 { transition-delay: 0.60s; }

        /* ── nav ── */
        .nav { position: sticky; top: 0; z-index: 50; background: rgba(250,250,250,0.85); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(0,0,0,0.06); }

        /* ── section label ── */
        .sec-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.12em; color: #EA580C; margin-bottom: 12px; }

        /* ── feature row ── */
        .feature-row { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; padding: 80px 0; border-top: 1px solid rgba(0,0,0,0.06); }
        .feature-row.flip { direction: rtl; }
        .feature-row.flip > * { direction: ltr; }

        @media (max-width: 768px) {
          .feature-row { grid-template-columns: 1fr; gap: 32px; }
          .feature-row.flip { direction: ltr; }
          .hero-mockup { display: none !important; }
        }

        /* ── audio player bar ── */
        .player-bar {
          height: 4px; background: #E2E8F0; border-radius: 2px; overflow: hidden;
        }
        .player-fill { height: 100%; background: linear-gradient(90deg, #1D4ED8, #60A5FA); border-radius: 2px; }

        /* ── status badge ── */
        .badge-ready { background: #DCFCE7; color: #15803D; font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 6px; }
        .badge-proc  { background: #FEF9C3; color: #854D0E; font-size: 10px; font-weight: 600; padding: 3px 8px; border-radius: 6px; }
      `}</style>

      {/* ══════════════════════════════════════════════════
          NAV
      ══════════════════════════════════════════════════ */}
      <nav className="nav">
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, fontWeight: 400, letterSpacing: "-0.02em" }}>
            Amp<span style={{ color: "#1D4ED8" }}>.</span>
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 14, color: "#64748B", fontWeight: 500 }}>
            <a href="#features" style={{ textDecoration: "none", color: "inherit" }}>Features</a>
            <a href="#how"      style={{ textDecoration: "none", color: "inherit" }}>How it works</a>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link href="/login"    style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", textDecoration: "none", padding: "8px 16px" }}>Sign in</Link>
            <Link href="/register" style={{ fontSize: 13, fontWeight: 600, color: "#fff", background: "#0A0A0A", borderRadius: 10, padding: "9px 20px", textDecoration: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}>Get started →</Link>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════ */}
      <section className="mesh-hero" style={{ padding: "100px 32px 80px", textAlign: "center", position: "relative" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative", zIndex: 1 }}>

          {/* eyebrow pill */}
          <div className={`hero-in hi-1 ${mounted ? "mounted" : ""}`} style={{ marginBottom: 28 }}>
            <span className="pill">
              <span className="pill-dot" />
              Now available for all schools
            </span>
          </div>

          {/* Headline */}
          <h1
            className={`hero-in hi-2 ${mounted ? "mounted" : ""}`}
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(3rem, 7vw, 5.5rem)",
              fontWeight: 400,
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              marginBottom: 24,
              color: "#0A0A0A",
            }}
          >
            Your school library,
            <br />
            <em style={{ color: "#1D4ED8", fontStyle: "italic" }}>heard out loud.</em>
          </h1>

          {/* Sub */}
          <p
            className={`hero-in hi-3 ${mounted ? "mounted" : ""}`}
            style={{ fontSize: 18, color: "#64748B", lineHeight: 1.7, maxWidth: 520, margin: "0 auto 36px", fontWeight: 400 }}
          >
            Upload any PDF textbook. Amp converts it to audio automatically.
            Students browse by category, pick a unit, and press play.
          </p>

          {/* CTAs */}
          <div className={`hero-in hi-4 ${mounted ? "mounted" : ""}`} style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 64 }}>
            <Link
              href="/register"
              style={{
                fontSize: 15, fontWeight: 700, color: "#fff",
                background: "#1D4ED8", borderRadius: 12, padding: "14px 32px",
                textDecoration: "none",
                boxShadow: "0 4px 24px rgba(29,78,216,0.35)",
                display: "inline-flex", alignItems: "center", gap: 8,
              }}
            >
              Register your school — free
            </Link>
            <Link
              href="/login"
              style={{
                fontSize: 15, fontWeight: 600, color: "#0A0A0A",
                background: "#fff", borderRadius: 12, padding: "14px 28px",
                textDecoration: "none", border: "1px solid rgba(0,0,0,0.1)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              Sign in to your library
            </Link>
          </div>

          {/* ── Hero mockup — browser chrome wrapping the library UI ── */}
          <div
            className={`hero-in hi-5 ${mounted ? "mounted" : ""} float-card`}
            style={{ borderRadius: 16, overflow: "hidden", textAlign: "left", maxWidth: 780, margin: "0 auto" }}
          >
            {/* Browser chrome */}
            <div className="browser-chrome">
              <div className="chrome-dot" style={{ background: "#FC615D" }} />
              <div className="chrome-dot" style={{ background: "#FDBC40" }} />
              <div className="chrome-dot" style={{ background: "#34CA49" }} />
              <div className="chrome-bar" />
              <span style={{ fontSize: 11, color: "#94A3B8", whiteSpace: "nowrap" }}>amp.library / dashboard</span>
            </div>

            {/* App UI inside browser */}
            <div style={{ background: "#F8FAFC", padding: 20, display: "grid", gridTemplateColumns: "200px 1fr", gap: 16, minHeight: 320 }}>

              {/* Sidebar */}
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)", padding: 16 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 12 }}>Categories</p>
                {DEMO_CATEGORIES.map(c => (
                  <div key={c.name} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "8px 10px", borderRadius: 8,
                    background: c.name === "Mathematics" ? "#EFF6FF" : "transparent",
                    marginBottom: 4, cursor: "pointer",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.dot }} />
                      <span style={{ fontSize: 12, fontWeight: c.name === "Mathematics" ? 600 : 400, color: c.name === "Mathematics" ? "#1D4ED8" : "#374151" }}>{c.name}</span>
                    </div>
                    <span style={{ fontSize: 10, color: "#94A3B8", background: "#F1F5F9", padding: "1px 6px", borderRadius: 4 }}>{c.count}</span>
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 700, color: "#0A0A0A" }}>Mathematics</p>
                    <p style={{ fontSize: 11, color: "#94A3B8" }}>4 books · 2 ready</p>
                  </div>
                  <button style={{ fontSize: 12, fontWeight: 600, background: "#1D4ED8", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer" }}>+ Upload PDF</button>
                </div>

                {DEMO_BOOKS.map(b => (
                  <div key={b.title} style={{
                    background: "#fff", borderRadius: 10, border: "1px solid rgba(0,0,0,0.06)",
                    padding: "12px 16px", marginBottom: 8,
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: 8,
                        background: b.status === "ready" ? "#DBEAFE" : "#F1F5F9",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 16,
                      }}>
                        {b.status === "ready" ? "🔊" : "⏳"}
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A" }}>{b.title}</p>
                        <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>
                          {b.status === "ready" ? `${b.time} audio` : "Converting to audio…"}
                        </p>
                      </div>
                    </div>
                    <span className={b.status === "ready" ? "badge-ready" : "badge-proc"}>
                      {b.status === "ready" ? "Ready" : "Processing"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          LOGOS / SOCIAL PROOF BAR
      ══════════════════════════════════════════════════ */}
      <div style={{ borderTop: "1px solid rgba(0,0,0,0.06)", borderBottom: "1px solid rgba(0,0,0,0.06)", background: "#fff", padding: "20px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500, marginRight: 8 }}>Trusted by schools across</span>
          {["Zambia", "Zimbabwe", "Malawi", "Botswana", "South Africa"].map(c => (
            <span key={c} style={{ fontSize: 13, fontWeight: 600, color: "#CBD5E1", letterSpacing: "0.02em" }}>{c}</span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          FEATURES — alternating rows
      ══════════════════════════════════════════════════ */}
      <section id="features" className="mesh-features" style={{ padding: "40px 32px 80px" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>

          {/* Section header */}
          <div ref={s1.ref} style={{ textAlign: "center", paddingTop: 64, paddingBottom: 16 }}>
            <p className={`reveal d1 sec-label ${s1.visible ? "in" : ""}`}>Features</p>
            <h2
              className={`reveal d2 ${s1.visible ? "in" : ""}`}
              style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.15, maxWidth: 560, margin: "0 auto" }}
            >
              Everything your school needs to run an audio library.
            </h2>
          </div>

          {/* Feature 1 — Upload & Convert */}
          <div ref={s2.ref}>
            <div className="feature-row">
              <div className={`reveal d1 ${s2.visible ? "in" : ""}`}>
                <p className="sec-label">01 — Upload & Convert</p>
                <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 400, lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 16 }}>
                  Drop in a PDF.<br />Get back audio.
                </h3>
                <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.75, marginBottom: 24 }}>
                  Admins upload any PDF — textbooks, worksheets, study guides.
                  Amp extracts the text and sends it through our audio pipeline.
                  The audio file appears in the library automatically when it's ready.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {["Any PDF accepted — no formatting required", "Full text extracted, not just cover pages", "Processing happens in the background"].map(t => (
                    <div key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#DCFCE7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 3" stroke="#16A34A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                      </div>
                      <span style={{ fontSize: 14, color: "#374151" }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload mockup */}
              <div className={`reveal d2 ${s2.visible ? "in" : ""}`} style={{ position: "relative" }}>
                <div className="float-card" style={{ padding: 24 }}>
                  {/* Upload zone */}
                  <div style={{
                    border: "2px dashed #BFDBFE", borderRadius: 12, padding: "32px 20px",
                    textAlign: "center", background: "#EFF6FF", marginBottom: 20,
                  }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>📄</div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#1D4ED8", marginBottom: 4 }}>Drop your PDF here</p>
                    <p style={{ fontSize: 12, color: "#93C5FD" }}>or click to browse · Max 50MB</p>
                  </div>
                  {/* Progress card */}
                  <div style={{ background: "#F8FAFC", borderRadius: 10, border: "1px solid rgba(0,0,0,0.06)", padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <span style={{ fontSize: 20 }}>📘</span>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 600 }}>Algebra_Unit3.pdf</p>
                          <p style={{ fontSize: 11, color: "#94A3B8" }}>2.4 MB · Extracting text…</p>
                        </div>
                      </div>
                      <span className="badge-proc">Processing</span>
                    </div>
                    <div className="player-bar"><div className="player-fill" style={{ width: "62%" }} /></div>
                    <p style={{ fontSize: 10, color: "#94A3B8", marginTop: 6 }}>62% · estimated 45 seconds remaining</p>
                  </div>
                </div>

                {/* Floating notification */}
                <div className="float-card" style={{ position: "absolute", bottom: -18, right: -18, padding: "10px 16px", display: "flex", gap: 10, alignItems: "center", borderRadius: 12 }}>
                  <span style={{ fontSize: 20 }}>🎉</span>
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 700 }}>Audio ready!</p>
                    <p style={{ fontSize: 11, color: "#94A3B8" }}>Algebra Unit 3 · 18 min</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 — Browse & Listen (flipped) */}
            <div className="feature-row flip" ref={s3.ref}>
              {/* Player mockup */}
              <div className={`reveal d1 ${s3.visible ? "in" : ""}`} style={{ position: "relative" }}>
                <div className="float-card" style={{ padding: 24 }}>
                  {/* Mini audio player */}
                  <div style={{ textAlign: "center", marginBottom: 20 }}>
                    <div style={{
                      width: 90, height: 90, borderRadius: "50%",
                      background: "linear-gradient(135deg, #DBEAFE, #EFF6FF)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 36, margin: "0 auto 14px",
                      border: "3px solid #BFDBFE",
                    }}>🎧</div>
                    <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>Algebra — Unit 3</p>
                    <p style={{ fontSize: 12, color: "#94A3B8" }}>Mathematics · 18 min</p>
                  </div>
                  {/* Progress */}
                  <div className="player-bar" style={{ marginBottom: 6 }}>
                    <div className="player-fill" style={{ width: "38%" }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94A3B8", marginBottom: 20 }}>
                    <span>6:52</span><span>18:10</span>
                  </div>
                  {/* Controls */}
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 20 }}>
                    <button style={{ fontSize: 20, background: "none", border: "none", cursor: "pointer" }}>⏮</button>
                    <button style={{
                      width: 52, height: 52, borderRadius: "50%",
                      background: "#1D4ED8", border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 22, color: "#fff",
                      boxShadow: "0 4px 16px rgba(29,78,216,0.35)",
                    }}>▶</button>
                    <button style={{ fontSize: 20, background: "none", border: "none", cursor: "pointer" }}>⏭</button>
                  </div>
                  {/* Speed */}
                  <div style={{ textAlign: "center", marginTop: 16 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, background: "#F1F5F9", padding: "4px 12px", borderRadius: 8, color: "#374151" }}>1.25×</span>
                  </div>
                </div>
              </div>

              {/* Text */}
              <div className={`reveal d2 ${s3.visible ? "in" : ""}`}>
                <p className="sec-label">02 — Browse & Listen</p>
                <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 400, lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 16 }}>
                  Pick a subject.<br />Pick a unit.<br />Press play.
                </h3>
                <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.75, marginBottom: 24 }}>
                  Students browse a clean library organised by subject and unit number.
                  The full-featured audio player supports variable speed, skip forward/back,
                  and shows a live progress bar.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {["Variable playback speed (0.5× – 2×)", "Skip forward or back 15 seconds", "Works in any modern browser — no app needed"].map(t => (
                    <div key={t} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                        <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5l2.5 2.5L8 3" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                      </div>
                      <span style={{ fontSize: 14, color: "#374151" }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          HOW IT WORKS — numbered steps
      ══════════════════════════════════════════════════ */}
      <section id="how" style={{ background: "#fff", padding: "100px 32px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div ref={s4.ref} style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p className={`reveal sec-label ${s4.visible ? "in" : ""}`}>How it works</p>
            <h2
              className={`reveal d1 ${s4.visible ? "in" : ""}`}
              style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400, letterSpacing: "-0.025em" }}
            >
              Up and running in minutes.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32, position: "relative" }}>
            {/* Connector line */}
            <div style={{ position: "absolute", top: 28, left: "16%", right: "16%", height: 1, background: "linear-gradient(90deg, transparent, #DBEAFE 20%, #DBEAFE 80%, transparent)", zIndex: 0 }} />

            {[
              { n: "01", title: "Register your school", body: "Create an account in under a minute. No credit card needed. Your library is ready immediately." },
              { n: "02", title: "Create categories & upload PDFs", body: "Set up subjects like Maths and Science, then upload your textbooks. Amp handles the audio conversion." },
              { n: "03", title: "Students log in and listen", body: "Students access the library from any browser, browse by unit, and start listening instantly." },
            ].map(({ n, title, body }, i) => (
              <div key={n} className={`reveal d${i + 1} ${s4.visible ? "in" : ""}`} style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: "#0A0A0A", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'DM Serif Display', serif", fontSize: 18,
                  margin: "0 auto 20px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}>{n}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10, lineHeight: 1.3 }}>{title}</h3>
                <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA — dark
      ══════════════════════════════════════════════════ */}
      <section className="mesh-cta" style={{ padding: "100px 32px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.4rem, 5vw, 4rem)", fontWeight: 400, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20 }}>
            Your library is one<br />
            <em style={{ color: "#FED7AA" }}>upload away.</em>
          </h2>
          <p style={{ fontSize: 16, color: "#94A3B8", lineHeight: 1.7, marginBottom: 40 }}>
            Register your school today and give every student access to audio
            versions of their learning materials — completely free to start.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              href="/register"
              style={{
                fontSize: 15, fontWeight: 700, color: "#0A0A0A",
                background: "#FED7AA", borderRadius: 12, padding: "15px 36px",
                textDecoration: "none",
                boxShadow: "0 4px 24px rgba(254,215,170,0.25)",
              }}
            >
              Register your school — it's free
            </Link>
            <Link
              href="/login"
              style={{
                fontSize: 15, fontWeight: 600, color: "#94A3B8",
                background: "transparent", borderRadius: 12, padding: "15px 24px",
                textDecoration: "none", border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              Sign in →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════ */}
      <footer style={{ background: "#0A0A0A", padding: "32px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "#fff" }}>Amp<span style={{ color: "#60A5FA" }}>.</span></span>
        <p style={{ fontSize: 12, color: "#475569" }}>© {new Date().getFullYear()} Amp Digital Library · Built for accessible education.</p>
        <div style={{ display: "flex", gap: 20, fontSize: 13, color: "#475569" }}>
          <Link href="/login"    style={{ color: "inherit", textDecoration: "none" }}>Sign in</Link>
          <Link href="/register" style={{ color: "inherit", textDecoration: "none" }}>Register</Link>
        </div>
      </footer>

    </div>
  );
}