"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Volume2, MessageSquare, PenLine, Zap, BookOpen, BarChart2,
  Lock, Monitor, School, FileText, Headphones, Play, Pause,
  Clock, CheckCircle, AlertCircle,
} from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"listen" | "dialogue" | "quiz">("listen");

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
        * { box-sizing: border-box; margin: 0; padding: 0; }
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
        .nav { position: sticky; top: 0; z-index: 50; background: rgba(255,251,245,0.88); backdrop-filter: blur(14px); border-bottom: 1px solid rgba(0,0,0,0.06); }
        .browser { background: #fff; border-radius: 16px; border: 1px solid rgba(0,0,0,0.07); box-shadow: 0 4px 6px rgba(0,0,0,0.04), 0 24px 64px rgba(0,0,0,0.10); overflow: hidden; }
        .chrome { background: #F1F5F9; padding: 10px 14px; display: flex; align-items: center; gap: 5px; border-bottom: 1px solid rgba(0,0,0,0.06); }
        .cdot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
        .cbar { flex: 1; height: 18px; background: #E2E8F0; border-radius: 5px; margin: 0 8px; }
        .pill { display: inline-flex; align-items: center; gap: 7px; background: rgba(255,255,255,0.95); border: 1px solid rgba(0,0,0,0.08); border-radius: 100px; padding: 6px 16px; font-size: 12px; font-weight: 500; box-shadow: 0 1px 4px rgba(0,0,0,0.06); backdrop-filter: blur(8px); }
        .pbar { height: 5px; background: #E2E8F0; border-radius: 3px; overflow: hidden; }
        .pfill { height: 100%; border-radius: 3px; }
        .step-card { background: #fff; border-radius: 20px; border: 1px solid rgba(0,0,0,0.06); padding: 32px 28px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .step-card:hover { transform: translateY(-4px); box-shadow: 0 8px 32px rgba(0,0,0,0.10); }
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.65s ease, transform 0.65s ease; }
        .reveal.in { opacity: 1; transform: translateY(0); }
        .d1 { transition-delay: 0.06s; } .d2 { transition-delay: 0.16s; } .d3 { transition-delay: 0.26s; } .d4 { transition-delay: 0.36s; } .d5 { transition-delay: 0.46s; }
        .hero-in { opacity: 0; transform: translateY(22px); transition: opacity 0.8s ease, transform 0.8s ease; }
        .hero-in.on { opacity: 1; transform: translateY(0); }
        .hi1 { transition-delay: 0.05s; } .hi2 { transition-delay: 0.18s; } .hi3 { transition-delay: 0.32s; } .hi4 { transition-delay: 0.46s; } .hi5 { transition-delay: 0.60s; }
        .badge-r { background: #D1FAE5; color: #065F46; font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 6px; }
        .badge-p { background: #FEF3C7; color: #92400E; font-size: 10px; font-weight: 700; padding: 3px 9px; border-radius: 6px; }
        .tab-btn { padding: 10px 22px; border-radius: 10px; border: none; cursor: pointer; font-size: 13px; font-weight: 600; font-family: inherit; transition: all 0.18s ease; display: flex; align-items: center; gap: 7px; }
        .tab-btn.active { background: #0A0A0A; color: #fff; box-shadow: 0 4px 14px rgba(0,0,0,0.18); }
        .tab-btn.inactive { background: transparent; color: #64748B; }
        .tab-btn.inactive:hover { background: rgba(0,0,0,0.05); color: #0A0A0A; }
        .feature-card { border-radius: 20px; padding: 28px; border: 1px solid rgba(0,0,0,0.07); transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .feature-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.09); }
        .quiz-opt { border-radius: 10px; padding: 10px 14px; font-size: 12px; font-weight: 500; display: flex; align-items: center; gap: 10px; margin-bottom: 7px; border: 2px solid transparent; transition: all 0.15s; }
        @keyframes wave-0 { 0%{height:6px} 100%{height:22px} }
        @keyframes wave-1 { 0%{height:10px} 100%{height:18px} }
        @keyframes wave-2 { 0%{height:8px} 100%{height:24px} }
        @keyframes wave-3 { 0%{height:14px} 100%{height:10px} }
        .wave-bar { width: 3px; border-radius: 2px; background: #D97706; display: inline-block; }
        @media (max-width: 768px) {
          .two-col { grid-template-columns: 1fr !important; }
          .three-col { grid-template-columns: 1fr !important; }
          .hero-app { display: none !important; }
          .feat-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className="nav">
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#0A0A0A" }}>
              Amplify<span style={{ color: "#D97706" }}>.</span>
            </span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 14, color: "#64748B", fontWeight: 500 }}>
            <a href="#features" style={{ textDecoration: "none", color: "inherit" }}>Features</a>
            <a href="#how"      style={{ textDecoration: "none", color: "inherit" }}>How it works</a>
            <a href="#mission"  style={{ textDecoration: "none", color: "inherit" }}>Our mission</a>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link href="/login"    style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", textDecoration: "none", padding: "8px 16px" }}>Sign in</Link>
            <Link href="/register" style={{ fontSize: 13, fontWeight: 700, color: "#fff", background: "#D97706", borderRadius: 10, padding: "9px 20px", textDecoration: "none", boxShadow: "0 2px 10px rgba(217,119,6,0.35)" }}>
              Register your school
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="mesh-hero" style={{ padding: "96px 28px 80px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          <div className={`hero-in hi1 ${mounted ? "on" : ""}`} style={{ marginBottom: 28, textAlign: "center" }}>
            <span className="pill">
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#D97706", display: "inline-block" }} />
              Audio lessons · Teaching dialogues · Comprehension quizzes
            </span>
          </div>

          <h1
            className={`hero-in hi2 ${mounted ? "on" : ""}`}
            style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.8rem, 6.5vw, 5.2rem)", fontWeight: 400, lineHeight: 1.07, letterSpacing: "-0.03em", textAlign: "center", maxWidth: 860, margin: "0 auto 24px" }}
          >
            Every child deserves to<br />
            <em style={{ color: "#D97706" }}>hear, discuss, and understand.</em>
          </h1>

          <p
            className={`hero-in hi3 ${mounted ? "on" : ""}`}
            style={{ fontSize: 18, color: "#64748B", lineHeight: 1.75, maxWidth: 600, margin: "0 auto 36px", textAlign: "center" }}
          >
            Amplify turns any PDF textbook into three learning experiences for visually impaired
            primary school students — a narrated audio lesson, a two-voice teaching dialogue,
            and a spoken comprehension quiz. Teachers upload once. Students learn fully.
          </p>

          <div className={`hero-in hi4 ${mounted ? "on" : ""}`} style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 72 }}>
            <Link href="/register" style={{ fontSize: 15, fontWeight: 700, color: "#fff", background: "#D97706", borderRadius: 12, padding: "15px 36px", textDecoration: "none", boxShadow: "0 6px 24px rgba(217,119,6,0.35)" }}>
              Register your school
            </Link>
            <Link href="/login" style={{ fontSize: 15, fontWeight: 600, color: "#0A0A0A", background: "#fff", borderRadius: 12, padding: "15px 28px", textDecoration: "none", border: "1px solid rgba(0,0,0,0.1)", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              Sign in to your library
            </Link>
          </div>

          {/* ── Hero interactive mockup ── */}
          <div className={`hero-in hi5 ${mounted ? "on" : ""} browser hero-app`} style={{ maxWidth: 860, margin: "0 auto" }}>
            <div className="chrome">
              <div className="cdot" style={{ background: "#FC615D" }} />
              <div className="cdot" style={{ background: "#FDBC40" }} />
              <div className="cdot" style={{ background: "#34CA49" }} />
              <div className="cbar" />
              <span style={{ fontSize: 10, color: "#94A3B8" }}>amplify.library / grade3 / mathematics</span>
            </div>

            {/* Tab switcher */}
            <div style={{ background: "#F8FAFC", padding: "14px 20px 0", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", gap: 8 }}>
              {(["listen", "dialogue", "quiz"] as const).map(tab => (
                <button
                  key={tab}
                  className={`tab-btn ${activeTab === tab ? "active" : "inactive"}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "listen"   ? <><Volume2    size={14} /> Audio Lesson</>      :
                   tab === "dialogue" ? <><MessageSquare size={14} /> Teaching Dialogue</> :
                                        <><PenLine     size={14} /> Quiz</>}
                </button>
              ))}
            </div>

            {/* Tab panels */}
            <div style={{ background: "#F8FAFC", padding: 20, minHeight: 260 }}>

              {/* LISTEN TAB */}
              {activeTab === "listen" && (
                <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 14 }}>
                  <div style={{ background: "#fff", borderRadius: 12, border: "1px solid rgba(0,0,0,0.06)", padding: 14 }}>
                    <p style={{ fontSize: 9, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Subjects</p>
                    {[{ name: "Mathematics", dot: "#3B82F6", active: true }, { name: "Science", dot: "#22C55E" }, { name: "English", dot: "#D97706" }, { name: "Life Skills", dot: "#A855F7" }].map(c => (
                      <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 9px", borderRadius: 8, marginBottom: 3, background: c.active ? "#EFF6FF" : "transparent" }}>
                        <div style={{ width: 7, height: 7, borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
                        <span style={{ fontSize: 11, fontWeight: c.active ? 600 : 400, color: c.active ? "#1D4ED8" : "#374151" }}>{c.name}</span>
                      </div>
                    ))}
                    <div style={{ marginTop: 14, padding: 10, background: "#FFFBF5", borderRadius: 10, border: "1px solid #FEF3C7" }}>
                      <p style={{ fontSize: 9, fontWeight: 700, color: "#92400E", marginBottom: 6 }}>NOW PLAYING</p>
                      <p style={{ fontSize: 11, fontWeight: 600, color: "#0A0A0A", marginBottom: 6 }}>Unit 3 — Addition</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 6 }}>
                        {[0.6,1,0.75,0.9,0.5,0.85,0.65,1].map((h,i) => (
                          <div key={i} className="wave-bar" style={{ height: `${h*20}px`, animation: `wave-${i%4} ${0.7+(i%3)*0.2}s ease-in-out infinite alternate` }} />
                        ))}
                      </div>
                      <div className="pbar"><div className="pfill" style={{ width: "55%", background: "linear-gradient(90deg,#D97706,#F59E0B)" }} /></div>
                      <p style={{ fontSize: 9, color: "#94A3B8", marginTop: 4 }}>12:30 / 22:15</p>
                    </div>
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                      <div><p style={{ fontSize: 15, fontWeight: 700 }}>Mathematics</p><p style={{ fontSize: 11, color: "#94A3B8" }}>Grade 3 · 4 units · 3 ready</p></div>
                      <button style={{ fontSize: 11, fontWeight: 600, background: "#D97706", color: "#fff", border: "none", borderRadius: 8, padding: "7px 12px", cursor: "pointer" }}>+ Upload PDF</button>
                    </div>
                    {[
                      { title: "Unit 1 — Counting & Numbers", time: "15 min", status: "ready",      playing: false },
                      { title: "Unit 2 — Shapes & Patterns",  time: "19 min", status: "ready",      playing: false },
                      { title: "Unit 3 — Addition",           time: "22 min", status: "ready",      playing: true  },
                      { title: "Unit 4 — Subtraction",        time: "—",      status: "processing", playing: false },
                    ].map(b => (
                      <div key={b.title} style={{ background: b.playing ? "#FFFBF5" : "#fff", border: `1px solid ${b.playing ? "#FDE68A" : "rgba(0,0,0,0.06)"}`, borderRadius: 10, padding: "11px 14px", marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 34, height: 34, borderRadius: 8, background: b.playing ? "#FEF3C7" : b.status === "ready" ? "#DBEAFE" : "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {b.playing
                              ? <Play    size={14} color="#D97706" fill="#D97706" />
                              : b.status === "ready"
                              ? <Volume2 size={14} color="#1D4ED8" />
                              : <Clock   size={14} color="#94A3B8" />}
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
              )}

              {/* DIALOGUE TAB */}
              {activeTab === "dialogue" && (
                <div style={{ maxWidth: 560, margin: "0 auto" }}>
                  <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#0A0A0A", marginBottom: 4 }}>Unit 3 — Addition · Teaching Dialogue</p>
                    <p style={{ fontSize: 11, color: "#94A3B8" }}>Two voices discuss the lesson — Teacher A explains, Teacher B asks questions</p>
                  </div>
                  {[
                    { voice: "A", label: "Teacher A", color: "#1D4ED8", bg: "#EFF6FF", text: "Today we're learning about addition. When we add two numbers together, we get a larger number called the sum." },
                    { voice: "B", label: "Teacher B", color: "#D97706", bg: "#FFFBF5", text: "Can you give us an example? If I have 3 apples and my friend gives me 4 more, how many do I have?" },
                    { voice: "A", label: "Teacher A", color: "#1D4ED8", bg: "#EFF6FF", text: "Exactly! 3 plus 4 equals 7. We write this as 3 + 4 = 7. The plus sign means we are combining the groups." },
                    { voice: "B", label: "Teacher B", color: "#D97706", bg: "#FFFBF5", text: "So the equals sign tells us what the total is? Students, can you think of another example from your own life?" },
                  ].map((line, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, justifyContent: line.voice === "B" ? "flex-end" : "flex-start" }}>
                      {line.voice === "A" && (
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: line.bg, border: `1.5px solid ${line.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: line.color, flexShrink: 0 }}>A</div>
                      )}
                      <div style={{ background: line.bg, border: `1px solid ${line.color}22`, borderRadius: 12, padding: "10px 14px", maxWidth: "78%" }}>
                        <p style={{ fontSize: 9, fontWeight: 700, color: line.color, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{line.label}</p>
                        <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.6 }}>{line.text}</p>
                      </div>
                      {line.voice === "B" && (
                        <div style={{ width: 28, height: 28, borderRadius: "50%", background: line.bg, border: `1.5px solid ${line.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: line.color, flexShrink: 0 }}>B</div>
                      )}
                    </div>
                  ))}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", borderRadius: 12, border: "1px solid rgba(0,0,0,0.08)", padding: "10px 14px", marginTop: 12 }}>
                    <button style={{ width: 36, height: 36, borderRadius: "50%", background: "#D97706", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Pause size={14} color="#fff" />
                    </button>
                    <div style={{ flex: 1 }}>
                      <div className="pbar"><div className="pfill" style={{ width: "38%", background: "linear-gradient(90deg,#D97706,#F59E0B)" }} /></div>
                    </div>
                    <span style={{ fontSize: 10, color: "#94A3B8", whiteSpace: "nowrap" }}>8:12 / 21:40</span>
                  </div>
                </div>
              )}

              {/* QUIZ TAB */}
              {activeTab === "quiz" && (
                <div style={{ maxWidth: 480, margin: "0 auto" }}>
                  <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(0,0,0,0.08)", padding: "20px 22px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Question 2 of 5</p>
                      <p style={{ fontSize: 11, color: "#94A3B8" }}>Unit 3 — Addition</p>
                    </div>
                    <div style={{ height: 4, background: "#E2E8F0", borderRadius: 2, marginBottom: 18, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: "40%", background: "#D97706", borderRadius: 2 }} />
                    </div>
                    <div style={{ background: "#FFFBF5", borderRadius: 10, padding: "12px 14px", marginBottom: 16, display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <Volume2 size={16} color="#D97706" style={{ flexShrink: 0, marginTop: 2 }} />
                      <div>
                        <p style={{ fontSize: 10, fontWeight: 700, color: "#D97706", marginBottom: 4 }}>LISTEN TO QUESTION</p>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", lineHeight: 1.5 }}>If Chanda has 5 mangoes and her mother gives her 3 more, how many mangoes does Chanda have in total?</p>
                      </div>
                    </div>
                    {[
                      { label: "6 mangoes",  key: "1", selected: false },
                      { label: "8 mangoes",  key: "2", selected: true  },
                      { label: "9 mangoes",  key: "3", selected: false },
                      { label: "15 mangoes", key: "4", selected: false },
                    ].map(opt => (
                      <div key={opt.key} className="quiz-opt" style={{ background: opt.selected ? "#EFF6FF" : "#F8FAFC", borderColor: opt.selected ? "#1D4ED8" : "transparent" }}>
                        <div style={{ width: 24, height: 24, borderRadius: 6, background: opt.selected ? "#1D4ED8" : "#E2E8F0", color: opt.selected ? "#fff" : "#64748B", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{opt.key}</div>
                        <span style={{ fontSize: 12, color: opt.selected ? "#1D4ED8" : "#374151", fontWeight: opt.selected ? 600 : 400 }}>{opt.label}</span>
                      </div>
                    ))}
                    <button style={{ width: "100%", height: 42, background: "#1D4ED8", color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", marginTop: 8 }}>
                      Confirm answer — Press Enter
                    </button>
                    <p style={{ fontSize: 10, color: "#94A3B8", textAlign: "center", marginTop: 10 }}>Press 1 · 2 · 3 · 4 to select &nbsp;·&nbsp; R to replay question audio</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── STAT BAR ── */}
      <div style={{ background: "#0A0A0A", padding: "20px 28px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)" }}>
          {[
            { value: "3 formats", label: "Audio lesson · Teaching dialogue · Spoken quiz — generated automatically from one PDF upload" },
            { value: "< 2 min",   label: "From PDF upload to all three formats ready for students to access" },
            { value: "0",         label: "Specialist equipment required — works in any school computer lab browser" },
          ].map(({ value, label }, i) => (
            <div key={i} style={{ textAlign: "center", padding: "28px 20px", borderRight: i < 2 ? "1px solid #1E293B" : "none" }}>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem,4vw,2.8rem)", color: "#D97706", fontWeight: 400, marginBottom: 8 }}>{value}</p>
              <p style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6 }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── THREE FEATURES ── */}
      <section id="features" ref={s1.ref} style={{ padding: "100px 28px", background: "#fff", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p className={`reveal d1 ${s1.visible ? "in" : ""}`} style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#D97706", marginBottom: 12 }}>Three learning formats</p>
            <h2 className={`reveal d2 ${s1.visible ? "in" : ""}`} style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.2, maxWidth: 680, margin: "0 auto" }}>
              One PDF upload creates three complete learning experiences.
            </h2>
          </div>

          <div className="feat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>

            <div className={`reveal d1 feature-card ${s1.visible ? "in" : ""}`} style={{ background: "#FFFBF5", borderColor: "#FEF3C7" }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <Volume2 size={24} color="#D97706" />
              </div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#D97706", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Audio Lesson</p>
              <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12, lineHeight: 1.2 }}>The textbook, read aloud clearly.</h3>
              <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.75, marginBottom: 20 }}>
                The full textbook unit narrated by a natural-sounding AI voice at a comfortable pace.
                Students listen as the teacher plays it through the classroom speakers —
                no reading required, no equipment needed on the student's side.
              </p>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {["Pause, rewind 15 seconds, adjust speed", "Plays on any browser and speaker", "Covers the full unit content verbatim"].map(f => (
                  <li key={f} style={{ fontSize: 13, color: "#374151", display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 7 }}>
                    <CheckCircle size={14} color="#D97706" style={{ flexShrink: 0, marginTop: 2 }} />{f}
                  </li>
                ))}
              </ul>
            </div>

            <div className={`reveal d2 feature-card ${s1.visible ? "in" : ""}`} style={{ background: "#F0F9FF", borderColor: "#DBEAFE" }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <MessageSquare size={24} color="#1D4ED8" />
              </div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#1D4ED8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Teaching Dialogue</p>
              <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12, lineHeight: 1.2 }}>Two teachers explain together.</h3>
              <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.75, marginBottom: 20 }}>
                An AI-generated conversation between two voices — one explains the concept,
                one asks the questions a student would ask. This Socratic format helps students
                understand not just what the answer is, but why.
              </p>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {["Two distinct voices (Voice A + Voice B)", "AI-written to match the unit's content", "Designed to spark classroom discussion"].map(f => (
                  <li key={f} style={{ fontSize: 13, color: "#374151", display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 7 }}>
                    <CheckCircle size={14} color="#1D4ED8" style={{ flexShrink: 0, marginTop: 2 }} />{f}
                  </li>
                ))}
              </ul>
            </div>

            <div className={`reveal d3 feature-card ${s1.visible ? "in" : ""}`} style={{ background: "#F0FDF4", borderColor: "#D1FAE5" }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: "#D1FAE5", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                <PenLine size={24} color="#15803D" />
              </div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#15803D", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Comprehension Quiz</p>
              <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 12, lineHeight: 1.2 }}>Check understanding, no pen required.</h3>
              <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.75, marginBottom: 20 }}>
                Five multiple-choice questions, auto-generated from the unit content.
                Each question is read aloud. Students answer by pressing 1–4 on the keyboard —
                no reading, no writing. Instant score and a full review at the end.
              </p>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {["Questions and options read aloud automatically", "Keyboard-only — fully accessible", "Instant score with answer review"].map(f => (
                  <li key={f} style={{ fontSize: 13, color: "#374151", display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 7 }}>
                    <CheckCircle size={14} color="#15803D" style={{ flexShrink: 0, marginTop: 2 }} />{f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section id="mission" ref={s2.ref} style={{ padding: "100px 28px", background: "#FFFBF5", borderTop: "1px solid rgba(217,119,6,0.1)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div className="two-col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
            <div>
              <p className={`reveal d1 ${s2.visible ? "in" : ""}`} style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#D97706", marginBottom: 12 }}>Our mission</p>
              <h2 className={`reveal d2 ${s2.visible ? "in" : ""}`} style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.2, marginBottom: 20 }}>
                No child should fall behind because they can't see the board.
              </h2>
              <p className={`reveal d3 ${s2.visible ? "in" : ""}`} style={{ fontSize: 15, color: "#64748B", lineHeight: 1.8, marginBottom: 16 }}>
                Visually impaired primary school students in under-resourced schools often
                lack access to braille materials, screen readers, or assistive technology.
                Amplify removes that barrier entirely — with no specialist equipment on the student's side.
              </p>
              <p className={`reveal d4 ${s2.visible ? "in" : ""}`} style={{ fontSize: 15, color: "#64748B", lineHeight: 1.8 }}>
                A teacher uploads the class textbook once. From that moment, every unit is available
                as a narrated lesson, a teaching dialogue, and a spoken quiz — ready to run in the
                computer lab alongside every other student in the class.
              </p>
            </div>
            <div className={`reveal d2 ${s2.visible ? "in" : ""}`}>
              {[
                { Icon: School,         color: "#D97706", text: "Designed for the computer lab — a teacher plays audio for the whole class together" },
                { Icon: BookOpen,       color: "#1D4ED8", text: "Works with any PDF textbook already approved and in use at your school" },
                { Icon: MessageSquare,  color: "#7C3AED", text: "The dialogue format sparks discussion — visually impaired students can participate fully" },
                { Icon: PenLine,        color: "#15803D", text: "Quiz results let teachers know instantly which students understood the unit" },
              ].map(({ Icon, color, text }) => (
                <div key={text} style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 18 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={18} color={color} />
                  </div>
                  <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.65, paddingTop: 8 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="mesh-how" ref={s3.ref} style={{ padding: "100px 28px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p className={`reveal d1 ${s3.visible ? "in" : ""}`} style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#D97706", marginBottom: 12 }}>How it works</p>
            <h2 className={`reveal d2 ${s3.visible ? "in" : ""}`} style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.2 }}>
              Simple enough for any teacher.<br />Powerful enough for every student.
            </h2>
          </div>
          <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20, position: "relative" }}>
            <div style={{ position: "absolute", top: 36, left: "18%", right: "18%", height: 1, background: "linear-gradient(90deg, transparent, #FDE68A 30%, #FDE68A 70%, transparent)", zIndex: 0 }} />
            {[
              { n: "01", Icon: FileText,  bg: "#FEF3C7", iconColor: "#D97706", title: "Register your school",  body: "Takes under two minutes. Add your grades and subjects. Your library is ready immediately — no IT support needed." },
              { n: "02", Icon: BookOpen,  bg: "#DBEAFE", iconColor: "#1D4ED8", title: "Upload a PDF textbook", body: "Teachers upload the unit PDF. Amplify automatically generates the audio lesson, teaching dialogue, and quiz questions." },
              { n: "03", Icon: Headphones,bg: "#D1FAE5", iconColor: "#15803D", title: "Students learn fully",  body: "Play the audio lesson, run the dialogue discussion, then test understanding with the spoken quiz — all in the same class period." },
            ].map(({ n, Icon, bg, iconColor, title, body }, i) => (
              <div key={n} className={`reveal step-card d${i + 1} ${s3.visible ? "in" : ""}`} style={{ position: "relative", zIndex: 1 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  <Icon size={24} color={iconColor} />
                </div>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: "0.08em", marginBottom: 8 }}>{n}</p>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, lineHeight: 1.3 }}>{title}</h3>
                <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR TEACHERS ── */}
      <section ref={s4.ref} style={{ padding: "100px 28px", background: "#fff", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p className={`reveal d1 ${s4.visible ? "in" : ""}`} style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#D97706", marginBottom: 12 }}>For teachers</p>
            <h2 className={`reveal d2 ${s4.visible ? "in" : ""}`} style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 400, letterSpacing: "-0.025em", lineHeight: 1.2 }}>
              Built for the classroom,<br />not the IT department.
            </h2>
          </div>
          <div className="three-col" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {[
              { Icon: Zap,           iconColor: "#D97706", title: "No training needed",          body: "If you can attach a file to an email, you can use Amplify. Upload a PDF and all three formats are generated automatically.", bg: "#FFFBF5", border: "#FEF3C7" },
              { Icon: BookOpen,      iconColor: "#1D4ED8", title: "Any subject, any grade",      body: "Mathematics, Science, English, Life Skills — upload any PDF textbook and Amplify creates the audio, dialogue, and quiz.", bg: "#F0F9FF", border: "#DBEAFE" },
              { Icon: MessageSquare, iconColor: "#15803D", title: "Richer classroom discussion", body: "The teaching dialogue format gives visually impaired students the same Socratic discussion their sighted peers get from the whiteboard.", bg: "#F0FDF4", border: "#D1FAE5" },
              { Icon: BarChart2,     iconColor: "#7C3AED", title: "See who understood",          body: "Quiz results are saved per grade. At a glance, teachers can see scores and review which questions students found hardest.", bg: "#FAFAFA", border: "#E2E8F0" },
              { Icon: Lock,          iconColor: "#D97706", title: "Private to your school",      body: "Your library, grades, and quiz results are completely private. Only your teachers and grade accounts can access your content.", bg: "#FFFBF5", border: "#FEF3C7" },
              { Icon: Monitor,       iconColor: "#1D4ED8", title: "Works on any computer",       body: "No app to install, no account per student. One grade login shared by the class — works in any browser on any school computer.", bg: "#F0F9FF", border: "#DBEAFE" },
            ].map(({ Icon, iconColor, title, body, bg, border }, i) => (
              <div key={title} className={`reveal d${(i % 3) + 1} ${s4.visible ? "in" : ""}`} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 16, padding: "24px 22px" }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${iconColor}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  <Icon size={22} color={iconColor} />
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{title}</h3>
                <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.7 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section ref={s5.ref} style={{ padding: "100px 28px", textAlign: "center", background: "radial-gradient(ellipse 80% 60% at 50% 0%, #0A0A0A 0%, #1C1917 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 600, height: 300, borderRadius: "50%", background: "rgba(217,119,6,0.12)", filter: "blur(60px)", pointerEvents: "none" }} />
        <div className={`reveal d1 ${s5.visible ? "in" : ""}`} style={{ maxWidth: 640, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: "#D97706", marginBottom: 20 }}>Every school. Every student.</p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2.4rem,5vw,4rem)", fontWeight: 400, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 20 }}>
            Give your visually impaired students a full voice in their education.
          </h2>
          <p style={{ fontSize: 16, color: "#78716C", lineHeight: 1.75, marginBottom: 44 }}>
            Register your school today. No specialist hardware, no IT support, no per-student accounts required.
            One teacher. One PDF. Three complete learning formats.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/register" style={{ fontSize: 15, fontWeight: 700, color: "#0A0A0A", background: "#D97706", borderRadius: 12, padding: "16px 40px", textDecoration: "none", boxShadow: "0 6px 28px rgba(217,119,6,0.35)" }}>
              Register your school
            </Link>
            <Link href="/login" style={{ fontSize: 15, fontWeight: 600, color: "#78716C", background: "transparent", borderRadius: 12, padding: "16px 24px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)" }}>
              Already registered? Sign in →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#0A0A0A", padding: "28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14 }}>
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "#fff" }}>Amplify<span style={{ color: "#D97706" }}>.</span></span>
        <p style={{ fontSize: 12, color: "#44403C" }}>© {new Date().getFullYear()} Amplify Digital Library · Accessibility for every learner.</p>
        <div style={{ display: "flex", gap: 20, fontSize: 13, color: "#44403C" }}>
          <Link href="/login"         style={{ color: "inherit", textDecoration: "none" }}>Sign in</Link>
          <Link href="/register"      style={{ color: "inherit", textDecoration: "none" }}>Register</Link>
          <Link href="/student/login" style={{ color: "inherit", textDecoration: "none" }}>Student sign in</Link>
        </div>
      </footer>
    </div>
  );
}