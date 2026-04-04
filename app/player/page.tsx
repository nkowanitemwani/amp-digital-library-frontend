"use client";

import { useEffect, useRef, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// =============================================================
// TYPES
// =============================================================

type PlayerState = "loading" | "ready" | "playing" | "paused" | "error";

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const;
const SKIP_SECONDS = 15;

// =============================================================
// HELPERS
// =============================================================

// formatTime converts raw seconds to a human-readable string.
// e.g. 125 → "2:05", 3723 → "1:02:03"
function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds) || !isFinite(seconds)) return "0:00";
  const s = Math.floor(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

// =============================================================
// SUB-COMPONENTS
// =============================================================

// ── WaveformBars — animated bars that pulse when playing ─────
function WaveformBars({ playing }: { playing: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3, height: 32 }}>
      {[0.6, 1, 0.75, 0.9, 0.5, 0.85, 0.65, 1, 0.7, 0.55, 0.9, 0.6].map((h, i) => (
        <div
          key={i}
          style={{
            width: 3,
            borderRadius: 2,
            background: "#1D4ED8",
            opacity: playing ? 0.8 : 0.25,
            height: playing ? undefined : `${h * 20}px`,
            animation: playing ? `wave-${i % 4} ${0.8 + (i % 3) * 0.2}s ease-in-out infinite alternate` : "none",
          }}
        />
      ))}
    </div>
  );
}

// ── ProgressBar — custom seekable bar ───────────────────────
function ProgressBar({
  current,
  duration,
  onSeek,
}: {
  current: number;
  duration: number;
  onSeek: (t: number) => void;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [hoverPct, setHoverPct] = useState<number | null>(null);

  const pct = duration > 0 ? Math.min((current / duration) * 100, 100) : 0;

  function posToTime(clientX: number): number {
    const bar = barRef.current;
    if (!bar) return 0;
    const { left, width } = bar.getBoundingClientRect();
    return Math.max(0, Math.min(((clientX - left) / width) * duration, duration));
  }

  function handleMouseDown(e: React.MouseEvent) {
    setDragging(true);
    onSeek(posToTime(e.clientX));
  }

  function handleMouseMove(e: React.MouseEvent) {
    const p = ((e.clientX - (barRef.current?.getBoundingClientRect().left ?? 0)) /
      (barRef.current?.getBoundingClientRect().width ?? 1)) * 100;
    setHoverPct(Math.max(0, Math.min(p, 100)));
    if (dragging) onSeek(posToTime(e.clientX));
  }

  useEffect(() => {
    const up = () => setDragging(false);
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, []);

  return (
    <div
      ref={barRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverPct(null)}
      style={{
        height: 6, background: "#E2E8F0", borderRadius: 3,
        cursor: "pointer", position: "relative",
        // Larger hit area without making the bar visually tall
        padding: "8px 0", margin: "-8px 0",
      }}
    >
      {/* Track */}
      <div style={{ position: "absolute", inset: "8px 0", background: "#E2E8F0", borderRadius: 3 }} />

      {/* Hover preview — lighter fill */}
      {hoverPct !== null && (
        <div style={{
          position: "absolute", top: 8, left: 0, bottom: 8,
          width: `${hoverPct}%`, background: "#93C5FD", borderRadius: 3, opacity: 0.5,
        }} />
      )}

      {/* Progress fill */}
      <div style={{
        position: "absolute", top: 8, left: 0, bottom: 8,
        width: `${pct}%`, background: "#1D4ED8", borderRadius: 3,
        transition: dragging ? "none" : "width 0.25s linear",
      }} />

      {/* Thumb */}
      <div style={{
        position: "absolute",
        top: "50%", left: `${pct}%`,
        transform: "translate(-50%, -50%)",
        width: 14, height: 14, borderRadius: "50%",
        background: "#1D4ED8",
        boxShadow: "0 1px 4px rgba(29,78,216,0.4)",
        opacity: hoverPct !== null || dragging ? 1 : 0,
        transition: "opacity 0.15s",
        pointerEvents: "none",
      }} />
    </div>
  );
}

// =============================================================
// PLAYER PAGE
// =============================================================

// PlayerContent is the actual player — kept separate so it can be
// wrapped in Suspense below. Next.js App Router requires any component
// that calls useSearchParams() to be inside a Suspense boundary.
function PlayerContent() {
  const router      = useRouter();
  const searchParams = useSearchParams();

  const title    = searchParams.get("title")    ?? "Unknown title";
  const audioUrl = searchParams.get("audioUrl") ? decodeURIComponent(searchParams.get("audioUrl")!) : null;

  const audioRef           = useRef<HTMLAudioElement | null>(null);
  const [state, setState]  = useState<PlayerState>("loading");
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speedIdx, setSpeedIdx] = useState(2); // default 1×
  const [volume, setVolume]    = useState(1);
  const [muted, setMuted]      = useState(false);

  const speed = SPEEDS[speedIdx];

  // ── initialise audio element ──────────────────────────────
  useEffect(() => {
    if (!audioUrl) { setState("error"); return; }

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.preload    = "metadata";
    audio.playbackRate = SPEEDS[2]; // 1×

    const onCanPlay  = () => setState("ready");
    const onError    = () => setState("error");
    const onTimeUpdate = () => setCurrent(audio.currentTime);
    const onDuration   = () => setDuration(audio.duration);
    const onEnded      = () => setState("paused");

    audio.addEventListener("canplay",    onCanPlay);
    audio.addEventListener("error",      onError);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("durationchange", onDuration);
    audio.addEventListener("ended",      onEnded);

    return () => {
      audio.pause();
      audio.src = "";
      audio.removeEventListener("canplay",    onCanPlay);
      audio.removeEventListener("error",      onError);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("durationchange", onDuration);
      audio.removeEventListener("ended",      onEnded);
    };
  }, [audioUrl]);

  // ── sync playback rate ────────────────────────────────────
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = speed;
  }, [speed]);

  // ── sync volume / mute ────────────────────────────────────
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted  = muted;
    }
  }, [volume, muted]);

  // ── controls ──────────────────────────────────────────────
  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a || state === "loading" || state === "error") return;
    if (state === "playing") {
      a.pause();
      setState("paused");
    } else {
      a.play().then(() => setState("playing")).catch(() => setState("error"));
    }
  }, [state]);

  const skip = useCallback((delta: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = Math.max(0, Math.min(a.currentTime + delta, a.duration));
  }, []);

  const seek = useCallback((t: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = t;
  }, []);

  const cycleSpeed = useCallback(() => {
    setSpeedIdx(i => (i + 1) % SPEEDS.length);
  }, []);

  // ── keyboard shortcuts ────────────────────────────────────
  // Space = play/pause, ← = skip back, → = skip forward,
  // [ = slower, ] = faster. These let a teacher or student
  // control playback without reaching for the mouse.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Don't fire on inputs
      if (e.target instanceof HTMLInputElement) return;
      if (e.code === "Space")       { e.preventDefault(); togglePlay(); }
      if (e.code === "ArrowLeft")   { e.preventDefault(); skip(-SKIP_SECONDS); }
      if (e.code === "ArrowRight")  { e.preventDefault(); skip(SKIP_SECONDS); }
      if (e.code === "BracketLeft") setSpeedIdx(i => Math.max(0, i - 1));
      if (e.code === "BracketRight") setSpeedIdx(i => Math.min(SPEEDS.length - 1, i + 1));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [togglePlay, skip]);

  const remaining  = duration - current;
  const isPlaying  = state === "playing";
  const isLoading  = state === "loading";
  const isError    = state === "error";

  return (
    <div style={{
      minHeight: "100vh",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      background: "#F8FAFC",
      display: "flex",
      flexDirection: "column",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display&display=swap');

        /* Waveform bar animations — four offset phases */
        @keyframes wave-0 { from { height: 8px  } to { height: 28px } }
        @keyframes wave-1 { from { height: 14px } to { height: 22px } }
        @keyframes wave-2 { from { height: 10px } to { height: 26px } }
        @keyframes wave-3 { from { height: 18px } to { height: 12px } }

        /* Play button pulse when playing */
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.35; }
          100% { transform: scale(1.18); opacity: 0; }
        }
        .pulse-ring {
          position: absolute; inset: -6px; border-radius: 50%;
          border: 2px solid #1D4ED8;
          animation: pulse-ring 1.4s ease-out infinite;
          pointer-events: none;
        }

        /* Control button hover */
        .ctrl-btn:hover { background: #EFF6FF !important; }
        .ctrl-btn:active { transform: scale(0.95); }

        /* Speed pill hover */
        .speed-btn:hover { background: #DBEAFE !important; }
      `}</style>

      {/* ── Top bar ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 24px",
        background: "#fff",
        borderBottom: "1px solid rgba(0,0,0,0.07)",
      }}>
        <button
          onClick={() => router.back()}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "none", border: "none", cursor: "pointer",
            fontSize: 14, fontWeight: 600, color: "#64748B",
          }}
        >
          ← Back
        </button>
        <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "#0A0A0A" }}>
          Amp<span style={{ color: "#1D4ED8" }}>.</span>
        </span>
        <div style={{ width: 60 }} /> {/* spacer to centre logo */}
      </div>

      {/* ── Player card ── */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}>
        <div style={{
          background: "#fff",
          borderRadius: 24,
          border: "1px solid rgba(0,0,0,0.07)",
          boxShadow: "0 4px 6px rgba(0,0,0,0.04), 0 20px 60px rgba(0,0,0,0.08)",
          padding: "40px 40px 36px",
          width: "100%",
          maxWidth: 480,
        }}>

          {/* ── Album art / visualiser ── */}
          <div style={{
            width: 160, height: 160, borderRadius: "50%",
            background: "linear-gradient(135deg, #DBEAFE 0%, #EFF6FF 100%)",
            border: "3px solid #BFDBFE",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            margin: "0 auto 32px",
            position: "relative",
          }}>
            {isPlaying && <div className="pulse-ring" />}
            <span style={{ fontSize: 52 }}>🎧</span>
            <div style={{ marginTop: 8 }}>
              <WaveformBars playing={isPlaying} />
            </div>
          </div>

          {/* ── Title ── */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 24, fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "#0A0A0A",
              marginBottom: 6,
              lineHeight: 1.2,
            }}>
              {title}
            </h1>
            <p style={{ fontSize: 13, color: "#94A3B8" }}>
              {isLoading && "Loading audio…"}
              {isError   && "Could not load audio — check your connection"}
              {!isLoading && !isError && `${formatTime(remaining)} remaining`}
            </p>
          </div>

          {/* ── Progress bar ── */}
          <div style={{ marginBottom: 8 }}>
            <ProgressBar current={current} duration={duration} onSeek={seek} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94A3B8", marginBottom: 32 }}>
            <span>{formatTime(current)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* ── Controls ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 28 }}>

            {/* Speed pill */}
            <button
              className="speed-btn"
              onClick={cycleSpeed}
              style={{
                width: 52, height: 36,
                background: "#EFF6FF", color: "#1D4ED8",
                border: "none", borderRadius: 8,
                fontSize: 13, fontWeight: 700,
                cursor: "pointer",
                transition: "background 0.15s",
              }}
              title="Change playback speed (or press [ / ])"
            >
              {speed}×
            </button>

            {/* Skip back */}
            <button
              className="ctrl-btn"
              onClick={() => skip(-SKIP_SECONDS)}
              disabled={isLoading || isError}
              style={{
                width: 48, height: 48, borderRadius: "50%",
                background: "#F8FAFC", border: "1px solid rgba(0,0,0,0.08)",
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", cursor: "pointer", gap: 1,
                transition: "background 0.15s",
                opacity: isLoading || isError ? 0.4 : 1,
              }}
              title="Skip back 15s (← key)"
            >
              <span style={{ fontSize: 18 }}>⏮</span>
              <span style={{ fontSize: 9, color: "#94A3B8", fontWeight: 600 }}>15s</span>
            </button>

            {/* Play / Pause */}
            <div style={{ position: "relative" }}>
              <button
                onClick={togglePlay}
                disabled={isLoading || isError}
                style={{
                  width: 68, height: 68, borderRadius: "50%",
                  background: isError ? "#FEE2E2" : "#1D4ED8",
                  color: "#fff", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 26, cursor: isLoading || isError ? "not-allowed" : "pointer",
                  boxShadow: isError ? "none" : "0 6px 24px rgba(29,78,216,0.4)",
                  transition: "transform 0.1s, box-shadow 0.15s",
                  opacity: isLoading ? 0.6 : 1,
                }}
                title="Play / Pause (Space)"
              >
                {isLoading ? "⏳" : isError ? "✕" : isPlaying ? "⏸" : "▶"}
              </button>
            </div>

            {/* Skip forward */}
            <button
              className="ctrl-btn"
              onClick={() => skip(SKIP_SECONDS)}
              disabled={isLoading || isError}
              style={{
                width: 48, height: 48, borderRadius: "50%",
                background: "#F8FAFC", border: "1px solid rgba(0,0,0,0.08)",
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", cursor: "pointer", gap: 1,
                transition: "background 0.15s",
                opacity: isLoading || isError ? 0.4 : 1,
              }}
              title="Skip forward 15s (→ key)"
            >
              <span style={{ fontSize: 18 }}>⏭</span>
              <span style={{ fontSize: 9, color: "#94A3B8", fontWeight: 600 }}>15s</span>
            </button>

            {/* Volume / mute */}
            <button
              className="speed-btn"
              onClick={() => setMuted(m => !m)}
              style={{
                width: 52, height: 36,
                background: muted ? "#FEE2E2" : "#EFF6FF",
                color: muted ? "#DC2626" : "#1D4ED8",
                border: "none", borderRadius: 8,
                fontSize: 16, cursor: "pointer",
                transition: "background 0.15s",
              }}
              title="Mute / unmute"
            >
              {muted ? "🔇" : "🔊"}
            </button>
          </div>

          {/* ── Volume slider ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
            <span style={{ fontSize: 14 }}>🔉</span>
            <input
              type="range" min={0} max={1} step={0.05}
              value={muted ? 0 : volume}
              onChange={e => { setVolume(Number(e.target.value)); if (muted) setMuted(false); }}
              style={{ flex: 1, accentColor: "#1D4ED8", height: 4, cursor: "pointer" }}
            />
            <span style={{ fontSize: 14 }}>🔊</span>
          </div>

          {/* ── Keyboard shortcut hint ── */}
          <div style={{
            background: "#F8FAFC", borderRadius: 10,
            padding: "12px 16px",
            display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap",
          }}>
            {[
              ["Space", "Play / Pause"],
              ["← →", "Skip 15s"],
              ["[ ]", "Speed"],
            ].map(([key, label]) => (
              <div key={key} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <kbd style={{
                  background: "#fff", border: "1px solid rgba(0,0,0,0.12)",
                  borderRadius: 5, padding: "2px 7px",
                  fontSize: 11, fontFamily: "monospace", color: "#374151",
                  boxShadow: "0 1px 0 rgba(0,0,0,0.1)",
                }}>{key}</kbd>
                <span style={{ fontSize: 11, color: "#94A3B8" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Default export wraps PlayerContent in Suspense.
// Without this, Next.js App Router throws an error at build time
// because useSearchParams() requires a Suspense boundary — it
// suspends rendering until the URL search params are available.
export default function PlayerPage() {
  return (
    <Suspense fallback={
      <div style={{
        height: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", fontFamily: "'DM Sans', system-ui, sans-serif",
      }}>
        <p style={{ color: "#94A3B8", fontSize: 15 }}>Loading player…</p>
      </div>
    }>
      <PlayerContent />
    </Suspense>
  );
}