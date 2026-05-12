"use client";

import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// =============================================================
// TYPES
// =============================================================

interface Question {
  id: string;
  question_text: string;
  options: string[];
  order_index: number;
  question_audio_url?: string;
}

interface AttemptResult {
  score: number;
  total: number;
  answers: number[];
  correct: number[];
  passed: boolean;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

// =============================================================
// QUIZ CONTENT
// =============================================================

function QuizContent() {
  const router      = useRouter();
  const params      = useSearchParams();
  const bookId      = params.get("bookId") ?? "";
  const title       = params.get("title") ?? "Quiz";

  const [token, setToken]             = useState("");
  const [questions, setQuestions]     = useState<Question[]>([]);
  const [current, setCurrent]         = useState(0);
  const [answers, setAnswers]         = useState<number[]>([]);
  const [result, setResult]           = useState<AttemptResult | null>(null);
  const [phase, setPhase]             = useState<"loading" | "intro" | "question" | "submitting" | "result" | "error">("loading");
  const [errorMsg, setErrorMsg]       = useState("");
  const [selectedKey, setSelectedKey] = useState<number | null>(null);

  // Audio ref for playing question audio automatically.
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ── Load token and questions on mount ─────────────────────
  useEffect(() => {
    const stored = localStorage.getItem("amp_token");
    if (!stored) { router.push("/student/login"); return; }
    setToken(stored);
  }, [router]);

  useEffect(() => {
    if (!token || !bookId) return;

    fetch(`${API_BASE}/student/books/${bookId}/questions`, {
      headers: authHeaders(token),
    })
      .then(r => r.json())
      .then(data => {
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions);
          setPhase("intro");
        } else {
          setErrorMsg("Quiz questions are not ready yet. Please try again shortly.");
          setPhase("error");
        }
      })
      .catch(() => {
        setErrorMsg("Could not load quiz. Please check your connection.");
        setPhase("error");
      });
  }, [token, bookId]);

  // ── Auto-play question audio when question changes ─────────
  useEffect(() => {
    if (phase !== "question") return;
    const q = questions[current];
    if (!q?.question_audio_url) return;

    // Small delay so the UI renders before audio starts — avoids the
    // audio cutting off the first syllable.
    const t = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      const audio = new Audio(q.question_audio_url);
      audioRef.current = audio;
      audio.play().catch(() => {});
    }, 300);

    return () => {
      clearTimeout(t);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [current, phase, questions]);

  // ── Keyboard handler ────────────────────────────────────────
  // Press 1-4 to answer, Enter to confirm, R to replay audio.
  // This is the primary interaction model — the student never
  // needs to click or read anything.
  const handleKey = useCallback((e: KeyboardEvent) => {
    if (phase === "intro" && e.code === "Enter") {
      setPhase("question");
      return;
    }

    if (phase === "question") {
      const num = parseInt(e.key);
      if (num >= 1 && num <= 4) {
        setSelectedKey(num - 1); // highlight selection
        return;
      }
      // Enter confirms the highlighted selection
      if (e.code === "Enter" && selectedKey !== null) {
        confirmAnswer(selectedKey);
        return;
      }
      // R replays the question audio
      if (e.key === "r" || e.key === "R") {
        const q = questions[current];
        if (q?.question_audio_url) {
          if (audioRef.current) audioRef.current.pause();
          const audio = new Audio(q.question_audio_url);
          audioRef.current = audio;
          audio.play().catch(() => {});
        }
      }
    }

    if (phase === "result" && e.code === "Enter") {
      router.back();
    }
  }, [phase, selectedKey, current, questions, router]);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  // ── Confirm answer and advance ──────────────────────────────
  function confirmAnswer(answerIdx: number) {
    const newAnswers = [...answers, answerIdx];
    setAnswers(newAnswers);
    setSelectedKey(null);

    if (current + 1 < questions.length) {
      setCurrent(i => i + 1);
    } else {
      submitQuiz(newAnswers);
    }
  }

  // ── Submit quiz ─────────────────────────────────────────────
  async function submitQuiz(finalAnswers: number[]) {
    setPhase("submitting");
    try {
      const res = await fetch(`${API_BASE}/student/books/${bookId}/attempts`, {
        method: "POST",
        headers: authHeaders(token),
        body: JSON.stringify({ answers: finalAnswers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "submission failed");
      setResult(data);
      setPhase("result");
    } catch (err: any) {
      setErrorMsg(err.message ?? "Failed to submit quiz");
      setPhase("error");
    }
  }

  const q = questions[current];
  const progressPct = questions.length > 0 ? ((current / questions.length) * 100) : 0;

  // ── Shared container style ──────────────────────────────────
  const container: React.CSSProperties = {
    minHeight: "100vh",
    fontFamily: "'DM Sans', system-ui, sans-serif",
    background: "#F8FAFC",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  };

  const card: React.CSSProperties = {
    background: "#fff",
    borderRadius: 20,
    border: "1px solid rgba(0,0,0,0.07)",
    boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 20px 50px rgba(0,0,0,0.08)",
    padding: "40px 36px",
    width: "100%",
    maxWidth: 560,
  };

  // ── LOADING ──────────────────────────────────────────────────
  if (phase === "loading") {
    return (
      <div style={container}>
        <p style={{ color: "#94A3B8", fontSize: 15 }}>Loading quiz…</p>
      </div>
    );
  }

  // ── ERROR ────────────────────────────────────────────────────
  if (phase === "error") {
    return (
      <div style={container}>
        <div style={card}>
          <p style={{ fontSize: 24, marginBottom: 12 }}>⚠️</p>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Quiz unavailable</h2>
          <p style={{ fontSize: 14, color: "#64748B", marginBottom: 24 }}>{errorMsg}</p>
          <button
            onClick={() => router.back()}
            style={{ background: "#1D4ED8", color: "#fff", border: "none", borderRadius: 10, padding: "12px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
          >
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  // ── INTRO ────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div style={container}>
        <div style={card}>
          {/* Back */}
          <button
            onClick={() => router.back()}
            style={{ background: "none", border: "none", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 24, padding: 0 }}
          >
            ← Back to library
          </button>

          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>✏️</div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 8 }}>
              Quiz time
            </h1>
            <p style={{ fontSize: 15, color: "#64748B", marginBottom: 6 }}>{title}</p>
            <p style={{ fontSize: 14, color: "#94A3B8", marginBottom: 32 }}>
              {questions.length} questions — listen to each question then press a number key to answer
            </p>

            {/* Keyboard guide */}
            <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "16px 20px", marginBottom: 32, textAlign: "left" }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>How to answer</p>
              {[
                ["1 2 3 4", "Select your answer"],
                ["Enter", "Confirm your selection"],
                ["R", "Replay the question audio"],
              ].map(([key, label]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <kbd style={{
                    background: "#fff", border: "1px solid rgba(0,0,0,0.12)",
                    borderRadius: 6, padding: "3px 9px",
                    fontSize: 12, fontFamily: "monospace", color: "#374151",
                    boxShadow: "0 1px 0 rgba(0,0,0,0.08)", minWidth: 48, textAlign: "center",
                  }}>{key}</kbd>
                  <span style={{ fontSize: 13, color: "#64748B" }}>{label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setPhase("question")}
              style={{
                width: "100%", height: 52,
                background: "#1D4ED8", color: "#fff",
                border: "none", borderRadius: 12,
                fontSize: 16, fontWeight: 700, cursor: "pointer",
                boxShadow: "0 4px 16px rgba(29,78,216,0.3)",
              }}
            >
              Start quiz — Press Enter
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── SUBMITTING ───────────────────────────────────────────────
  if (phase === "submitting") {
    return (
      <div style={container}>
        <div style={{ ...card, textAlign: "center" }}>
          <p style={{ fontSize: 32, marginBottom: 16 }}>⏳</p>
          <p style={{ fontSize: 16, color: "#64748B" }}>Saving your answers…</p>
        </div>
      </div>
    );
  }

  // ── RESULT ───────────────────────────────────────────────────
  if (phase === "result" && result) {
    const pct = Math.round((result.score / result.total) * 100);

    return (
      <div style={container}>
        <div style={card}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>
              {result.passed ? "🎉" : "📖"}
            </div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, fontWeight: 400, letterSpacing: "-0.02em", marginBottom: 8 }}>
              {result.passed ? "Well done!" : "Keep practising!"}
            </h1>
            <p style={{ fontSize: 15, color: "#64748B", marginBottom: 4 }}>
              You got <strong>{result.score}</strong> out of <strong>{result.total}</strong> correct
            </p>
            <p style={{ fontSize: 28, fontWeight: 800, color: result.passed ? "#15803D" : "#EA580C" }}>
              {pct}%
            </p>
          </div>

          {/* Per-question review */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
              Review
            </p>
            {questions.map((q, i) => {
              const isCorrect = result.answers[i] === result.correct[i];
              return (
                <div
                  key={q.id}
                  style={{
                    background: isCorrect ? "#F0FDF4" : "#FEF2F2",
                    border: `1px solid ${isCorrect ? "#BBF7D0" : "#FECACA"}`,
                    borderRadius: 10, padding: "12px 16px", marginBottom: 8,
                  }}
                >
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 16, flexShrink: 0 }}>{isCorrect ? "✅" : "❌"}</span>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "#0A0A0A", marginBottom: 4 }}>
                        Q{i + 1}. {q.question_text}
                      </p>
                      <p style={{ fontSize: 12, color: isCorrect ? "#15803D" : "#B91C1C" }}>
                        Your answer: {q.options[result.answers[i]]}
                      </p>
                      {!isCorrect && (
                        <p style={{ fontSize: 12, color: "#15803D", marginTop: 2 }}>
                          Correct: {q.options[result.correct[i]]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => router.back()}
            style={{
              width: "100%", height: 48,
              background: "#1D4ED8", color: "#fff",
              border: "none", borderRadius: 12,
              fontSize: 15, fontWeight: 700, cursor: "pointer",
            }}
          >
            ← Back to library — Press Enter
          </button>
        </div>
      </div>
    );
  }

  // ── QUESTION ─────────────────────────────────────────────────
  return (
    <div style={container}>
      <div style={{ width: "100%", maxWidth: 560 }}>

        {/* Progress bar */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94A3B8", marginBottom: 6 }}>
            <span>Question {current + 1} of {questions.length}</span>
            <span>{title}</span>
          </div>
          <div style={{ height: 4, background: "#E2E8F0", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${progressPct}%`, background: "#1D4ED8", borderRadius: 2, transition: "width 0.3s ease" }} />
          </div>
        </div>

        <div style={card}>
          {/* Replay audio hint */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <button
              onClick={() => {
                if (q?.question_audio_url && audioRef.current) {
                  audioRef.current.currentTime = 0;
                  audioRef.current.play().catch(() => {});
                }
              }}
              style={{ background: "#EFF6FF", color: "#1D4ED8", border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
            >
              🔊 Replay (R)
            </button>
          </div>

          {/* Question */}
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
            fontWeight: 400, lineHeight: 1.3,
            letterSpacing: "-0.015em",
            color: "#0A0A0A", marginBottom: 28,
          }}>
            {q?.question_text}
          </h2>

          {/* Options — four clear buttons, numbered 1-4 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {q?.options.map((option, idx) => {
              const isSelected = selectedKey === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedKey(idx)}
                  style={{
                    display: "flex", alignItems: "center", gap: 14,
                    background: isSelected ? "#EFF6FF" : "#F8FAFC",
                    border: `2px solid ${isSelected ? "#1D4ED8" : "rgba(0,0,0,0.08)"}`,
                    borderRadius: 12, padding: "14px 18px",
                    fontSize: 14, fontWeight: isSelected ? 600 : 400,
                    color: isSelected ? "#1D4ED8" : "#374151",
                    cursor: "pointer", textAlign: "left",
                    transition: "all 0.15s ease",
                  }}
                >
                  <kbd style={{
                    width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                    background: isSelected ? "#1D4ED8" : "#E2E8F0",
                    color: isSelected ? "#fff" : "#64748B",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, fontWeight: 700, fontFamily: "monospace",
                    border: "none",
                  }}>
                    {idx + 1}
                  </kbd>
                  {option}
                </button>
              );
            })}
          </div>

          {/* Confirm button — only active when an option is selected */}
          <button
            onClick={() => selectedKey !== null && confirmAnswer(selectedKey)}
            disabled={selectedKey === null}
            style={{
              width: "100%", height: 50,
              background: selectedKey !== null ? "#1D4ED8" : "#E2E8F0",
              color: selectedKey !== null ? "#fff" : "#94A3B8",
              border: "none", borderRadius: 12,
              fontSize: 15, fontWeight: 700, cursor: selectedKey !== null ? "pointer" : "not-allowed",
              transition: "all 0.15s ease",
            }}
          >
            {selectedKey !== null ? "Confirm answer — Press Enter" : "Press 1, 2, 3, or 4 to select"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Suspense wrapper required for useSearchParams in Next.js App Router.
export default function QuizPage() {
  return (
    <Suspense fallback={
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui" }}>
        <p style={{ color: "#94A3B8" }}>Loading…</p>
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}
