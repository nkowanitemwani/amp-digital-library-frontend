"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// =============================================================
// TYPES
// =============================================================

interface Grade {
  id: string;
  name: string;
  username: string;
  is_active: boolean;
  created_at: string;
}

interface Category {
  id: string;
  grade_id: string;
  name: string;
  created_at: string;
}

interface Book {
  id: string;
  grade_id: string;
  category_id: string;
  title: string;
  author: string;
  unit_number: number;
  status: "pending" | "processing" | "ready" | "failed";
  audio_url?: string;
  created_at: string;
}

interface TokenPayload {
  school_id: string;
  subject_id: string;
  role: "admin" | "grade";
  exp: number;
}

// =============================================================
// HELPERS
// =============================================================

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

function parseJWT(token: string): TokenPayload | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

// =============================================================
// SUB-COMPONENTS
// =============================================================

function StatusBadge({ status }: { status: Book["status"] }) {
  if (status === "ready") {
    return (
      <span style={{ background: "#DCFCE7", color: "#15803D", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6 }}>
        ✓ Ready
      </span>
    );
  }
  if (status === "processing") {
    return (
      <span style={{ background: "#FEF9C3", color: "#854D0E", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6 }}>
        ⏳ Processing
      </span>
    );
  }
  if (status === "pending") {
    return (
      <span style={{ background: "#F1F5F9", color: "#64748B", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6 }}>
        ↑ Uploading
      </span>
    );
  }
  return (
    <span style={{ background: "#FEE2E2", color: "#991B1B", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6 }}>
      ✗ Failed
    </span>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 100, padding: 24,
    }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: "#94A3B8" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// =============================================================
// ADMIN DASHBOARD
// =============================================================

interface BookProgress {
  book_id: string;
  title: string;
  unit_number: number;
  attempts: number;
  best_score: number;
  total_questions: number;
  avg_score: number;
}

interface GradeProgress {
  grade_id: string;
  grade_name: string;
  books: BookProgress[];
}

function AdminDashboard({ token, schoolID }: { token: string; schoolID: string }) {
  const router = useRouter();
  const [grades, setGrades]               = useState<Grade[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<Grade | null>(null);
  const [categories, setCategories]       = useState<Category[]>([]);
  const [selectedCat, setSelectedCat]     = useState<Category | null>(null);
  const [books, setBooks]                 = useState<Book[]>([]);
  const [activeTab, setActiveTab]         = useState<"library" | "progress">("library");
  const [adminTab, setAdminTab]           = useState<"books" | "progress">("books");
  const [progress, setProgress]           = useState<GradeProgress | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(false);

  // Modal state
  const [showAddGrade, setShowAddGrade] = useState(false);
  const [showAddCat, setShowAddCat]     = useState(false);
  const [showUpload, setShowUpload]     = useState(false);

  // Form state
  const [gradeName, setGradeName]   = useState("");
  const [gradeUser, setGradeUser]   = useState("");
  const [gradePass, setGradePass]   = useState("");
  const [catName, setCatName]       = useState("");
  const [bookTitle, setBookTitle]   = useState("");
  const [bookAuthor, setBookAuthor] = useState("");
  const [bookUnit, setBookUnit]     = useState("");
  const [bookFile, setBookFile]     = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState("");

  // ── load grades ────────────────────────────────────────────
  const loadGrades = useCallback(async () => {
    const res = await fetch(`${API_BASE}/admin/grades`, { headers: authHeaders(token) });
    const data = await res.json();
    if (res.ok) setGrades(data.grades ?? []);
  }, [token]);

  useEffect(() => { loadGrades(); }, [loadGrades]);

  // Load categories when grade selected, reset tabs and progress.
  useEffect(() => {
    if (!selectedGrade) {
      setCategories([]); setSelectedCat(null); setBooks([]); setProgress(null);
      return;
    }
    setActiveTab("library");
    setProgress(null);
    fetch(`${API_BASE}/admin/grades/${selectedGrade.id}/categories`, { headers: authHeaders(token) })
      .then(r => r.json())
      .then(d => { setCategories(d.categories ?? []); setSelectedCat(null); setBooks([]); });
  }, [selectedGrade, token]);

  // ── load books when category is selected ──────────────────
  const loadBooks = useCallback(async () => {
    if (!selectedCat || !selectedGrade) return;
    const res = await fetch(
      `${API_BASE}/admin/categories/${selectedCat.id}/books?grade_id=${selectedGrade.id}`,
      { headers: authHeaders(token) }
    );
    const data = await res.json();
    if (res.ok) setBooks(data.books ?? []);
  }, [selectedCat, selectedGrade, token]);

  useEffect(() => { loadBooks(); }, [loadBooks]);

  // ── load progress ──────────────────────────────────────────
  const loadProgress = useCallback(async () => {
    if (!selectedGrade) return;
    setLoadingProgress(true);
    const res = await fetch(`${API_BASE}/admin/grades/${selectedGrade.id}/progress`, { headers: authHeaders(token) });
    const data = await res.json();
    if (res.ok) setProgress(data);
    setLoadingProgress(false);
  }, [selectedGrade, token]);

  useEffect(() => {
    if (activeTab === "progress") loadProgress();
  }, [activeTab, loadProgress]);

  // ── submit: add grade ─────────────────────────────────────
  async function submitGrade() {
    setSubmitting(true); setError("");
    const res = await fetch(`${API_BASE}/admin/grades`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ name: gradeName, username: gradeUser, password: gradePass }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setSubmitting(false); return; }
    await loadGrades();
    setShowAddGrade(false); setGradeName(""); setGradeUser(""); setGradePass("");
    setSubmitting(false);
  }

  // ── submit: add category ──────────────────────────────────
  async function submitCategory() {
    if (!selectedGrade) return;
    setSubmitting(true); setError("");
    const res = await fetch(`${API_BASE}/admin/categories`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ grade_id: selectedGrade.id, name: catName }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setSubmitting(false); return; }
    const catRes = await fetch(`${API_BASE}/admin/grades/${selectedGrade.id}/categories`, { headers: authHeaders(token) });
    const catData = await catRes.json();
    setCategories(catData.categories ?? []);
    setShowAddCat(false); setCatName("");
    setSubmitting(false);
  }

  // ── submit: upload book ───────────────────────────────────
  async function submitUpload() {
    if (!selectedGrade || !selectedCat || !bookFile) return;
    setSubmitting(true); setError("");

    const form = new FormData();
    form.append("file",        bookFile);
    form.append("grade_id",    selectedGrade.id);
    form.append("category_id", selectedCat.id);
    form.append("title",       bookTitle);
    form.append("author",      bookAuthor);
    form.append("unit_number", bookUnit);

    const res = await fetch(`${API_BASE}/admin/books`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setSubmitting(false); return; }
    await loadBooks();
    setShowUpload(false); setBookTitle(""); setBookAuthor(""); setBookUnit(""); setBookFile(null);
    setSubmitting(false);
  }

  // ── delete grade ──────────────────────────────────────────
  async function deleteGrade(grade: Grade) {
    if (!confirm(`Delete "${grade.name}" and all its books? This cannot be undone.`)) return;
    await fetch(`${API_BASE}/admin/grades/${grade.id}`, { method: "DELETE", headers: authHeaders(token) });
    if (selectedGrade?.id === grade.id) setSelectedGrade(null);
    await loadGrades();
  }

  // ── delete category ───────────────────────────────────────
  async function deleteCat(cat: Category) {
    if (!confirm(`Delete category "${cat.name}"? All books in it will also be deleted.`)) return;
    await fetch(`${API_BASE}/admin/categories/${cat.id}?grade_id=${cat.grade_id}`, { method: "DELETE", headers: authHeaders(token) });
    if (selectedCat?.id === cat.id) setSelectedCat(null);
    const catRes = await fetch(`${API_BASE}/admin/grades/${cat.grade_id}/categories`, { headers: authHeaders(token) });
    const catData = await catRes.json();
    setCategories(catData.categories ?? []);
  }

  // ── delete book ───────────────────────────────────────────
  async function deleteBook(book: Book) {
    if (!confirm(`Delete "${book.title}"?`)) return;
    await fetch(`${API_BASE}/admin/books/${book.id}?grade_id=${book.grade_id}`, { method: "DELETE", headers: authHeaders(token) });
    await loadBooks();
  }

  const inp: React.CSSProperties = {
    width: "100%", height: 44, border: "1.5px solid rgba(0,0,0,0.12)",
    borderRadius: 8, padding: "0 12px", fontSize: 14,
    fontFamily: "'DM Sans', system-ui, sans-serif", outline: "none", marginBottom: 12,
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", background: "#F8FAFC" }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: 240, background: "#fff", borderRight: "1px solid rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "#0A0A0A" }}>
            Amp<span style={{ color: "#1D4ED8" }}>.</span>
          </span>
          <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 2, fontWeight: 500 }}>Admin Dashboard</p>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "12px 0" }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em", padding: "0 16px", marginBottom: 6 }}>
            Grades
          </p>
          {grades.length === 0 && (
            <p style={{ fontSize: 13, color: "#94A3B8", padding: "8px 16px" }}>No grades yet</p>
          )}
          {grades.map(g => (
            <div
              key={g.id}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "9px 16px", cursor: "pointer",
                background: selectedGrade?.id === g.id ? "#EFF6FF" : "transparent",
                borderLeft: selectedGrade?.id === g.id ? "3px solid #1D4ED8" : "3px solid transparent",
              }}
              onClick={() => setSelectedGrade(g)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: g.is_active ? "#22C55E" : "#CBD5E1", flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: selectedGrade?.id === g.id ? 600 : 400, color: selectedGrade?.id === g.id ? "#1D4ED8" : "#374151" }}>
                  {g.name}
                </span>
              </div>
              <button
                onClick={e => { e.stopPropagation(); deleteGrade(g); }}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#CBD5E1", padding: 0 }}
                title="Delete grade"
              >✕</button>
            </div>
          ))}
        </div>

        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <button
            onClick={() => setShowAddGrade(true)}
            style={{
              width: "100%", height: 38, background: "#1D4ED8", color: "#fff",
              border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            + Add Grade
          </button>
        </div>
      </aside>

      {/* ── Main panel ── */}
      <main style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {!selectedGrade ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#94A3B8" }}>
            <span style={{ fontSize: 48, marginBottom: 16 }}>🏫</span>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#374151" }}>Select a grade to get started</p>
            <p style={{ fontSize: 14, marginTop: 4 }}>Or create a new grade using the button in the sidebar</p>
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* ── Top-level tab bar (Library / Progress) ── */}
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "10px 16px",
              background: "#fff", borderBottom: "1px solid rgba(0,0,0,0.07)",
              flexShrink: 0,
            }}>
              {([["library", "📚 Library"], ["progress", "📊 Progress"]] as const).map(([tab, label]) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: "6px 14px", borderRadius: 8, border: "none",
                    background: activeTab === tab ? "#EFF6FF" : "transparent",
                    color: activeTab === tab ? "#1D4ED8" : "#64748B",
                    fontSize: 13, fontWeight: activeTab === tab ? 700 : 500,
                    cursor: "pointer",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* ── Progress tab ── */}
            {activeTab === "progress" && (
              <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div>
                    <h2 style={{ fontSize: 16, fontWeight: 700 }}>Quiz Progress — {selectedGrade.name}</h2>
                    <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>
                      Shows scores from all quiz attempts by this grade
                    </p>
                  </div>
                  <button
                    onClick={loadProgress}
                    style={{ height: 36, padding: "0 14px", background: "#F1F5F9", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#374151" }}
                  >
                    ↻ Refresh
                  </button>
                </div>

                {loadingProgress ? (
                  <div style={{ textAlign: "center", paddingTop: 60, color: "#94A3B8" }}>
                    <p style={{ fontSize: 14 }}>Loading…</p>
                  </div>
                ) : !progress || progress.books.length === 0 ? (
                  <div style={{ textAlign: "center", paddingTop: 60, color: "#94A3B8" }}>
                    <span style={{ fontSize: 40, display: "block", marginBottom: 12 }}>✏️</span>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#374151" }}>No quiz attempts yet</p>
                    <p style={{ fontSize: 13, marginTop: 4 }}>Quiz results will appear here once students complete a quiz</p>
                  </div>
                ) : (
                  progress.books
                    .sort((a, b) => a.unit_number - b.unit_number)
                    .map(bp => {
                      const avgPct  = bp.total_questions > 0 ? Math.round((bp.avg_score  / bp.total_questions) * 100) : 0;
                      const bestPct = bp.total_questions > 0 ? Math.round((bp.best_score / bp.total_questions) * 100) : 0;
                      return (
                        <div
                          key={bp.book_id}
                          style={{
                            background: "#fff", border: "1px solid rgba(0,0,0,0.07)",
                            borderRadius: 12, padding: "18px 20px", marginBottom: 12,
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                            <div>
                              <p style={{ fontSize: 14, fontWeight: 700, color: "#0A0A0A" }}>
                                Unit {bp.unit_number} — {bp.title}
                              </p>
                              <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>
                                {bp.attempts} attempt{bp.attempts !== 1 ? "s" : ""} · {bp.total_questions} questions
                              </p>
                            </div>
                            <span style={{
                              background: bestPct >= 75 ? "#DCFCE7" : bestPct >= 50 ? "#FEF9C3" : "#FEE2E2",
                              color: bestPct >= 75 ? "#15803D" : bestPct >= 50 ? "#854D0E" : "#991B1B",
                              fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 7,
                            }}>
                              Best: {bestPct}%
                            </span>
                          </div>
                          <div>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#94A3B8", marginBottom: 4 }}>
                              <span>Average score</span>
                              <span>{avgPct}%</span>
                            </div>
                            <div style={{ height: 6, background: "#F1F5F9", borderRadius: 3, overflow: "hidden" }}>
                              <div style={{
                                height: "100%", width: `${avgPct}%`,
                                background: avgPct >= 75 ? "#22C55E" : avgPct >= 50 ? "#EAB308" : "#EF4444",
                                borderRadius: 3, transition: "width 0.6s ease",
                              }} />
                            </div>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            )}

            {/* ── Library tab ── */}
            {activeTab === "library" && (
              <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

                {/* ── Category panel ── */}
                <div style={{ width: 220, borderRight: "1px solid rgba(0,0,0,0.07)", background: "#fff", display: "flex", flexDirection: "column" }}>
                  <div style={{ padding: "16px 16px 12px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#0A0A0A" }}>{selectedGrade.name}</p>
                    <p style={{ fontSize: 10, color: "#94A3B8", marginTop: 1 }}>@{selectedGrade.username}</p>
                  </div>
                  <div style={{ flex: 1, overflowY: "auto", padding: "10px 0" }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em", padding: "0 14px", marginBottom: 6 }}>
                      Subjects
                    </p>
                    {categories.length === 0 && (
                      <p style={{ fontSize: 12, color: "#94A3B8", padding: "8px 14px" }}>No subjects yet</p>
                    )}
                    {categories.map(cat => (
                      <div
                        key={cat.id}
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "space-between",
                          padding: "8px 14px", cursor: "pointer",
                          background: selectedCat?.id === cat.id ? "#EFF6FF" : "transparent",
                          borderLeft: selectedCat?.id === cat.id ? "3px solid #1D4ED8" : "3px solid transparent",
                        }}
                        onClick={() => setSelectedCat(cat)}
                      >
                        <span style={{ fontSize: 13, fontWeight: selectedCat?.id === cat.id ? 600 : 400, color: selectedCat?.id === cat.id ? "#1D4ED8" : "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {cat.name}
                        </span>
                        <button
                          onClick={e => { e.stopPropagation(); deleteCat(cat); }}
                          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: "#CBD5E1", padding: 0, flexShrink: 0 }}
                        >✕</button>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: "10px 12px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                    <button
                      onClick={() => setShowAddCat(true)}
                      style={{ width: "100%", height: 34, background: "#F1F5F9", color: "#374151", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                    >
                      + Add Subject
                    </button>
                  </div>
                </div>

                {/* ── Books panel ── */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  {!selectedCat ? (
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#94A3B8" }}>
                      <span style={{ fontSize: 36, marginBottom: 12 }}>📂</span>
                      <p style={{ fontSize: 15, fontWeight: 600, color: "#374151" }}>Select a subject</p>
                      <p style={{ fontSize: 13, marginTop: 4 }}>Books will appear here</p>
                    </div>
                  ) : (
                    <>
                      {/* Header */}
                      <div style={{
                        padding: "16px 24px",
                        borderBottom: "1px solid rgba(0,0,0,0.07)",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        background: "#fff",
                      }}>
                        <div>
                          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0A0A0A" }}>{selectedCat.name}</h2>
                          <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>
                            {books.length} book{books.length !== 1 ? "s" : ""} · {selectedGrade.name}
                          </p>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <div style={{ display: "flex", background: "#F1F5F9", borderRadius: 8, padding: 3, gap: 2 }}>
                            <button
                              onClick={() => setAdminTab("books")}
                              style={{
                                padding: "5px 12px", borderRadius: 6, border: "none", cursor: "pointer",
                                fontSize: 12, fontWeight: 600,
                                background: adminTab === "books" ? "#fff" : "transparent",
                                color: adminTab === "books" ? "#0A0A0A" : "#64748B",
                                boxShadow: adminTab === "books" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                              }}
                            >📚 Books</button>
                            <button
                              onClick={() => setAdminTab("progress")}
                              style={{
                                padding: "5px 12px", borderRadius: 6, border: "none", cursor: "pointer",
                                fontSize: 12, fontWeight: 600,
                                background: adminTab === "progress" ? "#fff" : "transparent",
                                color: adminTab === "progress" ? "#0A0A0A" : "#64748B",
                                boxShadow: adminTab === "progress" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                              }}
                            >📊 Progress</button>
                          </div>
                          <button
                            onClick={loadBooks}
                            style={{ height: 36, padding: "0 14px", background: "#F1F5F9", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#374151" }}
                          >↻ Refresh</button>
                          {adminTab === "books" && (
                            <button
                              onClick={() => setShowUpload(true)}
                              style={{ height: 36, padding: "0 16px", background: "#1D4ED8", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
                            >+ Upload PDF</button>
                          )}
                        </div>
                      </div>

                      {/* Books list */}
                      <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
                        {books.length === 0 && (
                          <div style={{ textAlign: "center", paddingTop: 60, color: "#94A3B8" }}>
                            <span style={{ fontSize: 40, display: "block", marginBottom: 12 }}>📄</span>
                            <p style={{ fontSize: 15, fontWeight: 600, color: "#374151" }}>No books yet</p>
                            <p style={{ fontSize: 13, marginTop: 4 }}>Upload a PDF to add the first unit</p>
                          </div>
                        )}
                        {books
                          .sort((a, b) => a.unit_number - b.unit_number)
                          .map(book => (
                            <div
                              key={book.id}
                              style={{
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                background: "#fff", border: "1px solid rgba(0,0,0,0.07)",
                                borderRadius: 10, padding: "14px 18px", marginBottom: 10,
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                                <div style={{
                                  width: 40, height: 40, borderRadius: 10,
                                  background: book.status === "ready" ? "#DBEAFE" : book.status === "failed" ? "#FEE2E2" : "#F1F5F9",
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  fontSize: 18, flexShrink: 0,
                                }}>
                                  {book.status === "ready" ? "🔊" : book.status === "failed" ? "⚠️" : "⏳"}
                                </div>
                                <div>
                                  <p style={{ fontSize: 14, fontWeight: 600, color: "#0A0A0A" }}>
                                    Unit {book.unit_number} — {book.title}
                                  </p>
                                  <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>
                                    {book.author || "No author"} · {
                                      book.status === "pending"    ? "Uploading…" :
                                      book.status === "processing" ? "Converting to audio…" :
                                      book.status === "ready"      ? "Audio ready" :
                                      "Processing failed"
                                    }
                                  </p>
                                </div>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <StatusBadge status={book.status} />
                                {book.status === "ready" && book.audio_url && (
                                  <button
                                    onClick={() => router.push(
                                      `/player?title=${encodeURIComponent(book.title)}&audioUrl=${encodeURIComponent(book.audio_url!)}`
                                    )}
                                    style={{
                                      background: "#EFF6FF", color: "#1D4ED8",
                                      border: "1px solid #BFDBFE", borderRadius: 7,
                                      padding: "5px 12px", fontSize: 12, fontWeight: 600,
                                      cursor: "pointer", whiteSpace: "nowrap",
                                    }}
                                    title="Preview audio"
                                  >
                                    ▶ Preview
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteBook(book)}
                                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#CBD5E1", padding: 0 }}
                                  title="Delete book"
                                >✕</button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ── Add Grade Modal ── */}
      {showAddGrade && (
        <Modal title="Add Grade" onClose={() => { setShowAddGrade(false); setError(""); }}>
          {error && <p style={{ color: "#EF4444", fontSize: 13, marginBottom: 12 }}>{error}</p>}
          <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Grade name</label>
          <input style={inp} placeholder="e.g. Grade 3" value={gradeName} onChange={e => setGradeName(e.target.value)} />
          <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Login username</label>
          <input style={inp} placeholder="e.g. grade3" value={gradeUser} onChange={e => setGradeUser(e.target.value)} />
          <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Password</label>
          <input style={{ ...inp, marginBottom: 20 }} type="password" placeholder="At least 6 characters" value={gradePass} onChange={e => setGradePass(e.target.value)} />
          <button
            onClick={submitGrade} disabled={submitting || !gradeName || !gradeUser || !gradePass}
            style={{ width: "100%", height: 44, background: "#1D4ED8", color: "#fff", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? "Creating…" : "Create Grade"}
          </button>
        </Modal>
      )}

      {/* ── Add Category Modal ── */}
      {showAddCat && (
        <Modal title={`Add subject to ${selectedGrade?.name}`} onClose={() => { setShowAddCat(false); setError(""); }}>
          {error && <p style={{ color: "#EF4444", fontSize: 13, marginBottom: 12 }}>{error}</p>}
          <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Subject name</label>
          <input style={{ ...inp, marginBottom: 20 }} placeholder="e.g. Mathematics" value={catName} onChange={e => setCatName(e.target.value)} />
          <button
            onClick={submitCategory} disabled={submitting || !catName}
            style={{ width: "100%", height: 44, background: "#1D4ED8", color: "#fff", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? "Creating…" : "Create Subject"}
          </button>
        </Modal>
      )}

      {/* ── Upload Book Modal ── */}
      {showUpload && (
        <Modal title={`Upload PDF to ${selectedCat?.name}`} onClose={() => { setShowUpload(false); setError(""); }}>
          {error && <p style={{ color: "#EF4444", fontSize: 13, marginBottom: 12 }}>{error}</p>}
          <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Title</label>
          <input style={inp} placeholder="e.g. Numbers to 1000" value={bookTitle} onChange={e => setBookTitle(e.target.value)} />
          <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Author <span style={{ fontWeight: 400, color: "#94A3B8" }}>(optional)</span></label>
          <input style={inp} placeholder="e.g. Ministry of Education" value={bookAuthor} onChange={e => setBookAuthor(e.target.value)} />
          <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>Unit number</label>
          <input style={inp} type="number" min={1} placeholder="e.g. 1" value={bookUnit} onChange={e => setBookUnit(e.target.value)} />
          <label style={{ fontSize: 12, fontWeight: 600, color: "#374151", display: "block", marginBottom: 4 }}>PDF file</label>
          <div
            style={{
              border: "2px dashed #BFDBFE", borderRadius: 10, padding: "20px",
              textAlign: "center", background: "#EFF6FF", marginBottom: 20, cursor: "pointer",
            }}
            onClick={() => document.getElementById("pdf-upload")?.click()}
          >
            <input id="pdf-upload" type="file" accept=".pdf" style={{ display: "none" }} onChange={e => setBookFile(e.target.files?.[0] ?? null)} />
            {bookFile ? (
              <p style={{ fontSize: 13, fontWeight: 600, color: "#1D4ED8" }}>📄 {bookFile.name}</p>
            ) : (
              <>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#1D4ED8" }}>Click to select PDF</p>
                <p style={{ fontSize: 12, color: "#93C5FD", marginTop: 4 }}>Max 50MB</p>
              </>
            )}
          </div>
          <button
            onClick={submitUpload} disabled={submitting || !bookTitle || !bookUnit || !bookFile}
            style={{ width: "100%", height: 44, background: "#1D4ED8", color: "#fff", border: "none", borderRadius: 9, fontSize: 14, fontWeight: 700, cursor: "pointer", opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? "Uploading…" : "Upload & Convert to Audio"}
          </button>
        </Modal>
      )}
    </div>
  );
}

// =============================================================
// STUDENT (GRADE) DASHBOARD
// =============================================================

function StudentDashboard({ token, gradeID, schoolID }: { token: string; gradeID: string; schoolID: string }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetch(`${API_BASE}/student/grades/${gradeID}/categories`, { headers: authHeaders(token) })
      .then(r => r.json())
      .then(d => setCategories(d.categories ?? []));
  }, [gradeID, token]);

  const loadBooks = useCallback(async () => {
    if (!selectedCat) return;
    const res = await fetch(`${API_BASE}/student/categories/${selectedCat.id}/books`, { headers: authHeaders(token) });
    const data = await res.json();
    if (res.ok) setBooks(data.books ?? []);
  }, [selectedCat, token]);

  useEffect(() => { loadBooks(); }, [loadBooks]);

  function handleSignOut() {
    localStorage.removeItem("amp_token");
    router.push("/student/login");
  }

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif", background: "#F8FAFC" }}>

      {/* ── Sidebar ── */}
      <aside style={{ width: 240, background: "#fff", borderRight: "1px solid rgba(0,0,0,0.07)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "#0A0A0A" }}>
            Amp<span style={{ color: "#1D4ED8" }}>.</span>
          </span>
          <p style={{ fontSize: 11, color: "#94A3B8", marginTop: 2, fontWeight: 500 }}>My Library</p>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "12px 0" }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em", padding: "0 16px", marginBottom: 6 }}>
            Subjects
          </p>
          {categories.length === 0 && (
            <p style={{ fontSize: 13, color: "#94A3B8", padding: "8px 16px" }}>No subjects yet</p>
          )}
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => setSelectedCat(cat)}
              style={{
                padding: "10px 16px", cursor: "pointer",
                background: selectedCat?.id === cat.id ? "#EFF6FF" : "transparent",
                borderLeft: selectedCat?.id === cat.id ? "3px solid #1D4ED8" : "3px solid transparent",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: selectedCat?.id === cat.id ? 600 : 400, color: selectedCat?.id === cat.id ? "#1D4ED8" : "#374151" }}>
                {cat.name}
              </span>
            </div>
          ))}
        </div>

        <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(0,0,0,0.06)" }}>
          <button
            onClick={handleSignOut}
            style={{ width: "100%", height: 36, background: "#F1F5F9", color: "#64748B", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main panel ── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {!selectedCat ? (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#94A3B8" }}>
            <span style={{ fontSize: 48, marginBottom: 16 }}>🎧</span>
            <p style={{ fontSize: 16, fontWeight: 600, color: "#374151" }}>Choose a subject to start listening</p>
            <p style={{ fontSize: 14, marginTop: 4 }}>Select a subject from the sidebar</p>
          </div>
        ) : (
          <>
            <div style={{
              padding: "16px 28px",
              borderBottom: "1px solid rgba(0,0,0,0.07)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              background: "#fff",
            }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0A0A0A" }}>{selectedCat.name}</h2>
                <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>
                  {books.filter(b => b.status === "ready").length} of {books.length} units ready
                </p>
              </div>
              <button
                onClick={loadBooks}
                style={{ height: 36, padding: "0 14px", background: "#F1F5F9", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#374151" }}
              >
                ↻ Refresh
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
              {books.length === 0 && (
                <div style={{ textAlign: "center", paddingTop: 60, color: "#94A3B8" }}>
                  <span style={{ fontSize: 40, display: "block", marginBottom: 12 }}>📚</span>
                  <p style={{ fontSize: 15, fontWeight: 600, color: "#374151" }}>No books in this subject yet</p>
                </div>
              )}
              {books
                .sort((a, b) => a.unit_number - b.unit_number)
                .map(book => (
                  <div
                    key={book.id}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      background: "#fff", border: "1px solid rgba(0,0,0,0.07)",
                      borderRadius: 12, padding: "18px 22px", marginBottom: 12,
                      opacity: book.status !== "ready" ? 0.65 : 1,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 11,
                        background: book.status === "ready" ? "#DBEAFE" : "#F1F5F9",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>
                        <span style={{ fontSize: book.status === "ready" ? 20 : 18 }}>
                          {book.status === "ready" ? "🔊" : book.status === "failed" ? "⚠️" : "⏳"}
                        </span>
                      </div>
                      <div>
                        <p style={{ fontSize: 15, fontWeight: 700, color: "#0A0A0A" }}>
                          Unit {book.unit_number} — {book.title}
                        </p>
                        <p style={{ fontSize: 12, color: "#94A3B8", marginTop: 3 }}>
                          {book.author || ""}
                          {book.status === "processing" && " · Converting to audio…"}
                          {book.status === "failed" && " · Processing failed — ask your teacher"}
                        </p>
                      </div>
                    </div>

                    {book.status === "ready" && book.audio_url ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 7, flexShrink: 0 }}>
                        <button
                          onClick={() => router.push(`/player?title=${encodeURIComponent(book.title)}&audioUrl=${encodeURIComponent(book.audio_url!)}&mode=standard`)}
                          style={{
                            display: "flex", alignItems: "center", gap: 6,
                            background: "#1D4ED8", color: "#fff",
                            border: "none", borderRadius: 8, padding: "8px 14px",
                            fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
                          }}
                        >
                          ▶ Listen
                        </button>
                        <button
                          onClick={() => router.push(`/player?title=${encodeURIComponent(book.title)}&bookId=${book.id}&mode=dialogue`)}
                          style={{
                            display: "flex", alignItems: "center", gap: 6,
                            background: "#7C3AED", color: "#fff",
                            border: "none", borderRadius: 8, padding: "8px 14px",
                            fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
                          }}
                        >
                          💬 Discussion
                        </button>
                        <button
                          onClick={() => router.push(`/quiz?bookId=${book.id}&title=${encodeURIComponent(book.title)}`)}
                          style={{
                            display: "flex", alignItems: "center", gap: 6,
                            background: "#EA580C", color: "#fff",
                            border: "none", borderRadius: 8, padding: "8px 14px",
                            fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
                          }}
                        >
                          ✏ Quiz
                        </button>
                      </div>
                    ) : (
                      <StatusBadge status={book.status} />
                    )}
                  </div>
                ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// =============================================================
// DASHBOARD PAGE — role-based entry point
// =============================================================

export default function DashboardPage() {
  const router = useRouter();
  const [token, setToken]     = useState<string | null>(null);
  const [payload, setPayload] = useState<TokenPayload | null>(null);
  const [ready, setReady]     = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("amp_token");

    if (!stored) {
      router.push("/login");
      return;
    }

    const parsed = parseJWT(stored);

    if (!parsed || parsed.exp * 1000 < Date.now()) {
      localStorage.removeItem("amp_token");
      router.push("/login");
      return;
    }

    setToken(stored);
    setPayload(parsed);
    setReady(true);
  }, [router]);

  if (!ready || !token || !payload) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
        <p style={{ color: "#94A3B8", fontSize: 15 }}>Loading…</p>
      </div>
    );
  }

  if (payload.role === "admin") {
    return <AdminDashboard token={token} schoolID={payload.school_id} />;
  }

  if (payload.role === "grade") {
    return <StudentDashboard token={token} gradeID={payload.subject_id} schoolID={payload.school_id} />;
  }

  localStorage.removeItem("amp_token");
  router.push("/login");
  return null;
}