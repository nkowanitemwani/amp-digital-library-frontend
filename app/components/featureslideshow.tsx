// components/FeatureSlideshow.tsx
"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { CheckCircle } from "lucide-react";

const DURATION = 25000;

const slides = [
  {
    badge: "Admin Dashboard",
    heading: ["Your school library,", "fully organised."],
    body: "Manage grades, subjects and uploaded PDFs from one clean dashboard. Add a grade in seconds, upload a PDF, and all three formats generate automatically.",
    bullets: ["Grades and subjects side-by-side", "Upload PDF → audio + dialogue + quiz", "See what's ready at a glance"],
    screenshot: "/screenshots/admindash.png",
    accent: "#D97706",
    bg: "linear-gradient(135deg, #1e1a0e 0%, #0f172a 100%)",
  },
  {
    badge: "Audio Lesson",
    heading: ["The textbook,", "heard clearly."],
    body: "Every unit is narrated by a natural-sounding voice at a comfortable pace. Teachers play it through classroom speakers — no reading required, no student equipment needed.",
    bullets: ["Full unit content, verbatim narration", "Pause, rewind, adjust speed", "Works on any browser and speaker"],
    screenshot: "/screenshots/audio.png",
    accent: "#3B82F6",
    bg: "linear-gradient(135deg, #0a1628 0%, #0f172a 100%)",
  },
  {
    badge: "Comprehension Quiz",
    heading: ["Check understanding", "without a pen."],
    body: "Five questions auto-generated from the unit content. Each question is read aloud. Students answer by pressing 1–4 — keyboard-only, fully accessible, instant results.",
    bullets: ["Questions and options read aloud", "Keyboard-only — no writing needed", "Instant score with answer review"],
    screenshot: "/screenshots/quiz.png",
    accent: "#D97706",
    bg: "linear-gradient(135deg, #061a11 0%, #0f172a 100%)",
  },
  {
    badge: "Teaching Dialogue",
    heading: ["Two voices.", "One clear explanation."],
    body: "An AI-generated conversation between Teacher A (explains) and Teacher B (asks questions). The Socratic format helps students understand the why, not just the what.",
    bullets: ["Two distinct voices per unit", "Sparks classroom discussion", "Matches the exact unit content"],
    screenshot: "/screenshots/dialogue.png",
    accent: "#3B82F6",
    bg: "linear-gradient(135deg, #130d1e 0%, #0f172a 100%)",
  },
];

export default function FeatureSlideshow() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  const goTo = useCallback((idx: number) => {
    setVisible(false);
    setTimeout(() => { setCurrent(idx); setVisible(true); setProgress(0); }, 300);
  }, []);

  useEffect(() => {
    cancelAnimationFrame(rafRef.current);
    startRef.current = performance.now();
    const tick = (now: number) => {
      const pct = Math.min(((now - startRef.current!) / DURATION) * 100, 100);
      setProgress(pct);
      if (pct < 100) { rafRef.current = requestAnimationFrame(tick); }
      else { goTo((current + 1) % slides.length); }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [current, goTo]);

  const s = slides[current];

  return (
    <div style={{ background: "#0f172a", borderRadius: 20, overflow: "hidden", maxWidth: 860, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "42% 58%", minHeight: 420 }}>

        {/* Left — text */}
        <div style={{ background: s.bg, padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center", transition: "background 0.5s ease" }}>
          <div style={{ opacity: visible ? 1 : 0, transform: visible ? "translateX(0)" : "translateX(-10px)", transition: "opacity 0.35s ease, transform 0.35s ease" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: s.accent, background: `${s.accent}22`, borderRadius: 100, padding: "5px 14px", marginBottom: 18 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.accent, display: "inline-block" }} />
              {s.badge}
            </span>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, fontWeight: 400, lineHeight: 1.2, color: "#fff", margin: "0 0 14px", letterSpacing: "-0.02em" }}>
              {s.heading[0]}<br /><em style={{ color: s.accent }}>{s.heading[1]}</em>
            </h2>
            <p style={{ fontSize: 14, color: "#94a3b8", lineHeight: 1.75, margin: "0 0 20px" }}>{s.body}</p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px" }}>
              {s.bullets.map(b => (
                <li key={b} style={{ fontSize: 13, color: "#cbd5e1", display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                  <CheckCircle size={14} color={s.accent} style={{ flexShrink: 0, marginTop: 2 }} />{b}
                </li>
              ))}
            </ul>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <button onClick={() => goTo((current - 1 + slides.length) % slides.length)} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)", cursor: "pointer", color: "#94a3b8", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
              <div style={{ display: "flex", gap: 6 }}>
                {slides.map((_, i) => (
                  <div key={i} onClick={() => goTo(i)} style={{ height: 6, width: i === current ? 22 : 6, borderRadius: 3, background: i === current ? s.accent : "rgba(255,255,255,0.2)", cursor: "pointer", transition: "all 0.2s" }} />
                ))}
              </div>
              <button onClick={() => goTo((current + 1) % slides.length)} style={{ width: 36, height: 36, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.06)", cursor: "pointer", color: "#94a3b8", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>
            </div>
          </div>
        </div>

        {/* Right — screenshot */}
        <div style={{ background: s.bg, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "24px", overflow: "hidden", transition: "background 0.5s ease" }}>
          <Image
            src={s.screenshot}
            alt={s.badge}
            width={520}
            height={340}
            style={{ borderRadius: "12px", boxShadow: "0 -8px 40px rgba(0,0,0,0.4)", objectFit: "cover", objectPosition: "center", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(14px)", transition: "opacity 0.4s ease, transform 0.4s ease", maxHeight: 340, width: "100%", height: "auto" }}
          />
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: 2, background: "rgba(255,255,255,0.08)" }}>
        <div style={{ height: "100%", width: `${progress}%`, background: s.accent, transition: "width 0.1s linear" }} />
      </div>
    </div>
  );
}