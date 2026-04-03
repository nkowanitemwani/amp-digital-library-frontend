"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

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

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const s1 = useInView();
  const s2 = useInView();
  const s3 = useInView();
  const s4 = useInView();
  const s5 = useInView();

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", color: "#0A0A0A", background: "#FAFAFA", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap');
        * { box-sizing: border-box; }

        .mesh-hero {
          background:
            radial-gradient(ellipse 90% 60% at 10% 0%,   rgba(254,243,199,0.95) 0%, transparent 55%),
            radial-gradient(ellipse 70% 50% at 90% 20%,  rgba(219,234,254,0.80) 0%, transparent 55%),
            radial-gradient(ellipse 60% 70% at 50% 110%, rgba(220,252,231,0.50) 0%, transparent 55%),
            #FFFBF5;
        }
        .mesh-how {
          background:
            radial-gradient(ellipse 80% 50% at 0%   50%, rgba(219,234,254,0.5) 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 100% 50%, rgba(254,243,199,0.5) 0%, transparent 55%),
            #FFFFFF;
        }
        .nav {
          position: sticky; top: 0; z-index: 50;
          background: rgba(255,251,245,0.88);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(0,0,0,0.06);
        }
        .browser {
          background: #fff; border-radius: 16px;
          border: 1px solid rgba(0,0,0,0.07);
          box-shadow: 0 4px 6px rgba(0,0,0,0.04), 0 24px 64px rgba(0,0,0,0.10);
          overflow: hidden;
        }
        .chrome { background: #F1F5F9; padding: 10px 14px; display: flex; align-items: center; gap: 5px; border-bottom: 1px solid rgba(0,0,0,0.06); }
        .cdot { width: 9px; height: 9px; border-radius: 50%; }
        .cbar { flex: 1; height: 18px; background: #E2E8F0; border-radius: 5px; margin: 0 8px; }
        .pill { display: inline-flex; align-items: center; gap: 7px; background: rgba(255,255,255,0.95); border: 1px solid rgba(0,0,0,0.08); border-radius: 100px; padding: 6px 16px; font-size: 12px; font-weight: 500; box-shadow: 0 1px 4px rgba(0,0,0,0.06); backdrop-filter: blur(8px); }
        .pbar { height: 5px; background: #E2E8F0; border-radius: 3px; overflow: hidden; }
        .pfill { height: 100%; background: linear-gradient(90deg, #D97706, #F59E0B); border-radius: 3px; }
        .step-card { background: #fff; border-radius: 20px; border: 1px solid rgba(0,0,0,0.06); padding: 32px 28px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .step-card:hover { transform: translateY(-4px); box-shadow: 0 8px 32px rgba(0,0,0,0.10); }
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.65s ease, transform 0.65s ease; }
        .reveal.in { opacity: 1; transform: translateY(0); }
        .d1 { transition-delay: 0.06s; } .d2 { transition-delay: 0.16s; } .d3 { transition-delay: 0.26s; } .d4 { transition-delay: 0.36s; }
        .hero-in { opacity: 0; transform: translateY(22px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .hero-in.on { opacity: 1; transform: translateY(0); }
        .hi1 { transition-delay: 0.05s; } .hi2 { transition-delay: 0.18s; } .hi3 { transition-delay: 0.32s; } .hi4 { transition-delay: 0.46s; } .hi5 { transition-delay: 0.60s; }
        .quote-card { border-left: 4px solid #D97706; padding: 20px 24px; background: #FFFBF5; border-radius: 0 12px 12px 0; }
        .badge-r { background: #D1FAE5; color: #065F46; font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 6px; }
        .badge-p { background: #FEF3C7; color: #92400E; font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 6px; }
        @media (max-width: 768px) {
          .two-col { grid-template-columns: 1fr !important; }
          .three-col { grid-template-columns: 1fr !important; }
          .hero-app { display: none !important; }
        }
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#0A0A0A" }}>
              Amp<span style={{ color: "#D97706" }}>.</span>
            </span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 14, color: "#64748B", fontWeight: 500 }}>
            <a href="#how"     style={{ textDecoration: "none", color: "inherit" }}>How it works</a>
            <a href="#mission" style={{ textDecoration: "none", color: "inherit" }}>Our mission</a>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link href="/login"    style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", textDecoration: "none", padding: "8px 16px" }}>Sign in</Link>
            <Link href="/register" style={{ fontSize: 13, fontWeight: 700, color: "#fff", background: "#D97706", borderRadius: 10, padding: "9px 20px", textDecoration: "none", boxShadow: "0 2px 10px rgba(217,119,6,0.35)" }}>
              Register your school
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="mesh-hero" style={{ padding: "96px 28px 80px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className={`hero-in hi1 ${mounted ? "on" : ""}`} style={{ marginBottom: 28, textAlign: "center" }}>
            <span className="pill">
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#D97706", display: "inline-block" }} />
              Accessibility tool for visually impaired primary school students
            </span>
          </div>
          <h1
            className={`hero-in hi2 ${mounted ? "on" : ""}`}
            style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.8rem, 6.5vw, 5.2rem)", fontWeight: 400, lineHeight: 1.07, letterSpacing: "-0.03em", textAlign: "center", maxWidth: 820, margin: "0 auto 24px" }}
          >
            Every child deserves to<br />
            <em style={{ color: "#D97706" }}>hear their lessons.</em>
          </h1>
          <p
            className={`hero-in hi3 ${mounted ? "on" : ""}`}
            style={{ fontSize: 18, color: "#64748B", lineHeight: 1.75, maxWidth: 560, margin: "0 auto 36px", textAlign: "center" }}
          >
            Amp converts school textbooks into audio for visually impaired
            primary school students. Teachers upload a PDF — students listen.
            No reading required.
          </p>
          <div className={`hero-in hi4 ${mounted ? "on" : ""}`} style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 72 }}>
            <Link href="/register" style={{ fontSize: 15, fontWeight: 700, color: "#fff", background: "#D97706", borderRadius: 12, padding: "15px 36px", textDecoration: "none", boxShadow: "0 6px 24px rgba(217,119,6,0.35)" }}>
              Register your school — free
            </Link>
            <Link href="/login" style={{ fontSize: 15, fontWeight: 600, color: "#0A0A0A", background: "#fff", borderRadius: 12, padding: "15px 28px", textDecoration: "none", border: "1px solid rgba(0,0,0,0.1)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              Sign in to your library
            </Link>
          </div>

          {/* Hero mockup */}
          <div className={`hero-in hi5 ${mounted ? "on" : ""} browser hero-app`} style={{ maxWidth: 820, margin: "0 auto" }}>
            <div className="chrome">
              <div className="cdot" style={{ background: "#FC615D" }} />
              <div className="cdot" style={{ background: "#FDBC40" }} />
              <div className="cdot" style={{ background: "#34CA49" }} />
              <div className="cbar" />
              <span style={{ fontSize: 10, color: "#94A3B8" }}>amp.library / mathematics</span>
            </div>
            <div style={{ background: "#F8FAFC", padding: 20, display: "grid", gridTemplateColumns: "180px 1fr", gap: 14 }}>
              {/* sidebar */}
              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)", padding: 14 }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Subjects</p>
                {[{ name: "Mathematics", dot: "#3B82F6", active: true }, { name: "Science", dot: "#22C55E", active: false }, { name: "English", dot: "#D97706", active: false }, { name: "Life Skills", dot: "#A855F7", active: false }].map(c => (
                  <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 9px", borderRadius: 8, marginBottom: 3, background: c.active ? "#EFF6FF" : "transparent" }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, fontWeight: c.active ? 600 : 400, color: c.active ? "#1D4ED8" : "#374151" }}>{c.name}</span>
                  </div>
                ))}
                <div style={{ marginTop: 14, padding: 10, background: "#FFFBF5", borderRadius: 10, border: "1px solid #FEF3C7" }}>
                  <p style={{ fontSize: 9, fontWeight: 700, color: "#92400E", marginBottom: 6 }}>NOW PLAYING</p>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "#0A0A0A", marginBottom: 4 }}>Unit 3 — Addition</p>
                  <div className="pbar"><div className="pfill" style={{ width: "55%" }} /></div>
                  <p style={{ fontSize: 9, color: "#94A3B8", marginTop: 4 }}>12:30 / 22:15</p>
                </div>
              </div>
              {/* books */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <div><p style={{ fontSize: 15, fontWeight: 700 }}>Mathematics</p><p style={{ fontSize: 11, color: "#94A3B8" }}>Grade 3 · 4 units · 3 ready</p></div>
                  <button style={{ fontSize: 11, fontWeight: 600, background: "#D97706", color: "#fff", border: "none", borderRadius: 8, padding: "7px 12px", cursor: "pointer" }}>+ Upload PDF</button>
                </div>
                {[
                  { title: "Unit 1 — Counting & Numbers", time: "15 min", status: "ready", playing: false },
                  { title: "Unit 2 — Shapes & Patterns",  time: "19 min", status: "ready", playing: false },
                  { title: "Unit 3 — Addition",           time: "22 min", status: "ready", playing: true  },
                  { title: "Unit 4 — Subtraction",        time: "—",      status: "processing", playing: false },
                ].map(b => (
                  <div key={b.title} style={{ background: b.playing ? "#FFFBF5" : "#fff", border: `1px solid ${b.playing ? "#FDE68A" : "rgba(0,0,0,0.06)"}`, borderRadius: 10, padding: "11px 14px", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 8, background: b.playing ? "#FEF3C7" : b.status === "ready" ? "#DBEAFE" : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                        {b.playing ? "▶️" : b.status === "ready" ? "🔊" : "⏳"}
                      </div>
                      <div>
                        <p style={{ fontSize: 12, fontWeight: b.playing ? 700 : 600, color: b.playing ? "#92400E" : "#0A0A0A" }}>{b.title}</p>
                        <p style={{ fontSize: 10, color: "#94A3B8", marginTop: 1 }}>{b.status === "ready" ? `${b.time} audio` : "Converting to audio…"}</p>
                      </div>
                    </div>
                    <span className={b.status === "ready" ? "badge-r" : "badge-p"}>{b.playing ? "Playing" : b.status === "ready" ? "Ready" : "Processing"}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STAT BAR */}
      <div style={{ background: "#0A0A0A", padding: "20px 28px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)" }}>
          {[
            { value: "1 in 4",  label: "Primary school children in Sub-Saharan Africa have a visual impairment" },
            { value: "< 2 min", label: "From PDF upload to audio ready for students to hear" },
            { value: "0",       label: "Specialist equipment required — works on any school computer" },
          ].map(({ value, label }, i) => (
            <div key={i} style={{ textAlign: "center", padding: "28px 20px", borderRight: i < 2 ? "1px solid #1E293B" : "none" }}>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "#D97706", fontWeight: 400, marginBottom: 8 }}>{value}</p>
              <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MISSION */}
      <section id="mission" ref={s1.ref} style={{ padding: "100px 28px", background: "#FFFBF5", borderTop: "1px solid rgba(217,119,6,0.1)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <p className={`reveal d1 ${s1.visible ? "in" : ""}`} style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#D97706", marginBottom: 12 }}>Our mission</p>
              <h2 className={`reveal d2 ${s1.visible ? "in" : ""}`} style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.2, marginBottom: 20 }}>
                No child should fall behind because they can't read the board.
              </h2>
              <p className={`reveal d3 ${s1.visible ? "in" : ""}`} style={{ fontSize: 15, color: "#64748B", lineHeight: 1.8, marginBottom: 16 }}>
                Visually impaired primary school students in under-resourced schools often
                lack access to braille materials, screen readers, or assistive technology.
                Amp removes that barrier entirely.
              </p>
              <p className={`reveal d4 ${s1.visible ? "in" : ""}`} style={{ fontSize: 15, color: "#64748B", lineHeight: 1.8 }}>
                A teacher uploads the class textbook once. From that moment, every unit
                is available as clear, natural-sounding audio — ready to play in the
                computer lab without any specialist equipment on the student's side.
              </p>
            </div>
            <div className={`reveal d2 ${s1.visible ? "in" : ""}`}>
              <div className="quote-card" style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 16, lineHeight: 1.75, color: "#0A0A0A", fontStyle: "italic", marginBottom: 12 }}>
                  "Many of our visually impaired learners were simply being left out.
                  They couldn't access the same materials as their classmates.
                  A tool like this changes everything."
                </p>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>— Primary school teacher, Lusaka</p>
              </div>
              {[
                { icon: "🏫", text: "Designed for the computer lab — a teacher plays the audio for the whole class" },
                { icon: "📖", text: "Works with any PDF textbook already in use at the school" },
                { icon: "🔊", text: "Clear, naturally paced audio that works on basic speakers" },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
                  <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                  <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.6 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mesh-how" ref={s2.ref} style={{ padding: "100px 28px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p className={`reveal d1 ${s2.visible ? "in" : ""}`} style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#D97706", marginBottom: 12 }}>How it works</p>
            <h2 className={`reveal d2 ${s2.visible ? "in" : ""}`} style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.2 }}>
              Simple enough for any teacher.<br />Powerful enough for every student.
            </h2>
          </div>
          <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, position: "relative" }}>
            <div style={{ position: "absolute", top: 36, left: "18%", right: "18%", height: 1, background: "linear-gradient(90deg, transparent, #FDE68A 30%, #FDE68A 70%, transparent)", zIndex: 0 }} />
            {[
              { n: "01", icon: "📋", bg: "#FEF3C7", title: "Register your school",      body: "Takes under two minutes. No technical setup. Your library is ready immediately." },
              { n: "02", icon: "📄", bg: "#DBEAFE", title: "Upload your textbooks",     body: "Teachers upload the class PDF. Amp converts it to natural-sounding audio automatically." },
              { n: "03", icon: "🎧", bg: "#D1FAE5", title: "Students listen together",  body: "The teacher plays the audio in the computer lab. Visually impaired students follow along with their peers." },
            ].map(({ n, icon, bg, title, body }, i) => (
              <div key={n} className={`reveal step-card d${i + 1} ${s2.visible ? "in" : ""}`} style={{ position: "relative", zIndex: 1 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 20 }}>{icon}</div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.08em", marginBottom: 8 }}>{n}</p>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, lineHeight: 1.3 }}>{title}</h3>
                <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOR TEACHERS */}
      <section ref={s3.ref} style={{ padding: "100px 28px", background: "#fff", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p className={`reveal d1 ${s3.visible ? "in" : ""}`} style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#D97706", marginBottom: 12 }}>For teachers</p>
            <h2 className={`reveal d2 ${s3.visible ? "in" : ""}`} style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.2 }}>
              Built for the classroom,<br />not the IT department.
            </h2>
          </div>
          <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {[
              { icon: "⚡", title: "No training needed",       body: "If you can attach a file to an email, you can use Amp. Upload a PDF and you're done.", bg: "#FFFBF5", border: "#FEF3C7" },
              { icon: "📚", title: "Any subject, any grade",   body: "Mathematics, Science, English, Life Skills — if it's a PDF, Amp can convert it to audio.", bg: "#F0F9FF", border: "#DBEAFE" },
              { icon: "🔄", title: "Organised automatically",  body: "Books sorted by subject and unit number. Students always know which unit comes next.", bg: "#F0FDF4", border: "#D1FAE5" },
              { icon: "⏸️", title: "Full playback control",    body: "Pause, rewind 15 seconds, adjust speed. Teachers control the pace of the lesson.", bg: "#FAFAFA", border: "#E2E8F0" },
              { icon: "🔒", title: "Private to your school",   body: "Your library is completely separate from every other school. Only your teachers log in.", bg: "#FFFBF5", border: "#FEF3C7" },
              { icon: "💻", title: "Works on any computer",    body: "No app to install. Works in any browser — including older school computers.", bg: "#F0F9FF", border: "#DBEAFE" },
            ].map(({ icon, title, body, bg, border }, i) => (
              <div key={title} className={`reveal d${(i % 3) + 1} ${s3.visible ? "in" : ""}`} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 16, padding: "24px 22px" }}>
                <span style={{ fontSize: 28, display: "block", marginBottom: 14 }}>{icon}</span>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTES */}
      <section ref={s4.ref} style={{ padding: "80px 28px", background: "#FFFBF5", borderTop: "1px solid rgba(217,119,6,0.1)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {[
              { quote: "We used to read handouts aloud one-by-one. Amp means the whole class hears the lesson together.", name: "Grade 4 teacher", location: "Ndola, Zambia" },
              { quote: "Our visually impaired students now follow the same curriculum as everyone else. Their confidence has improved enormously.", name: "Headteacher", location: "Harare, Zimbabwe" },
            ].map(({ quote, name, location }, i) => (
              <div key={i} className={`reveal d${i + 1} ${s4.visible ? "in" : ""} quote-card`}>
                <p style={{ fontSize: 15, lineHeight: 1.8, color: "#0A0A0A", fontStyle: "italic", marginBottom: 16 }}>"{quote}"</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{name}</p>
                <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={s5.ref} style={{ padding: "100px 28px", textAlign: "center", background: "radial-gradient(ellipse 80% 60% at 50% 0%, #0A0A0A 0%, #1C1917 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 600, height: 300, borderRadius: "50%", background: "rgba(217,119,6,0.12)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div className={`reveal d1 ${s5.visible ? "in" : ""}`} style={{ maxWidth: 640, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#D97706", marginBottom: 20 }}>Every school. Every student.</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.4rem,5vw,4rem)", fontWeight: 400, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20 }}>
            Give your visually impaired students a voice in their education.
          </h2>
          <p style={{ fontSize: 16, color: "#78716C", lineHeight: 1.75, marginBottom: 44 }}>
            Register your school today. Free to start — no credit card, no specialist hardware, no IT support required.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" style={{ fontSize: 15, fontWeight: 700, color: "#0A0A0A", background: "#D97706", borderRadius: 12, padding: "16px 40px", textDecoration: "none", boxShadow: "0 6px 28px rgba(217,119,6,0.35)" }}>
              Register your school — free
            </Link>
            <Link href="/login" style={{ fontSize: 15, fontWeight: 600, color: "#78716C", background: "transparent", borderRadius: 12, padding: "16px 24px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)" }}>
              Already registered? Sign in →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: "#0A0A0A", padding: "28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "#fff" }}>Amp<span style={{ color: "#D97706" }}>.</span></span>
        <p style={{ fontSize: 12, color: "#44403C" }}>© {new Date().getFullYear()} Amp Digital Library · Accessibility for every learner.</p>
        <div style={{ display: "flex", gap: 20, fontSize: 13, color: "#44403C" }}>
          <Link href="/login"    style={{ color: "inherit", textDecoration: "none" }}>Sign in</Link>
          <Link href="/register" style={{ color: "inherit", textDecoration: "none" }}>Register</Link>
        </div>
      </footer>
    </div>
  );
}