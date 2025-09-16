// src/pages/JoinSocietiesPage.js
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "../axios";
import "./JoinSocietiesPage.css";

/* =======================
   Demo data (module scope)
   ======================= */
const DEMO_UNIS = [
  {
    name: "University of Kelaniya",
    societies: [
      {
        id: 1,
        name: "Information Technology Students’ Association",
        slug: "itsa",
        university_name: "University of Kelaniya",
        description: "Community of IT students at UoK",
        logo_url: "/react/assets/societies/itsa.png",
        join_link: "#",
      },
      {
        id: 2,
        name: "Computer Science Students’ Association",
        slug: "cssa",
        university_name: "University of Kelaniya",
        description: "Community of CS students at UoK",
        logo_url: "/react/assets/societies/cssa.png",
        join_link: "#",
      },
      {
        id: 3,
        name: "Engineering Technology Students’ Association",
        slug: "etsa",
        university_name: "University of Kelaniya",
        description: "Promoting entrepreneurship & technology",
        logo_url: "/react/assets/societies/etsa.png",
        join_link: "#",
      },
    ],
  },
];

/* ---------- Small components ---------- */

function ChipsScroller({ items = [], onSelect }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onwheel = (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };

    el.addEventListener("wheel", onwheel, { passive: false });
    return () => el.removeEventListener("wheel", onwheel);
  }, []);

  return (
    <div className="chips" ref={ref} aria-label="Societies list">
      {items.map((chip) => (
        <button
          key={chip.value}
          className="chip"
          onClick={() => onSelect?.(chip)}
          title={chip.label}
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}

function SocietyCard({ society, canEdit, onEditClick }) {
  return (
    <div className="soc-card">
      <div className="soc-card__content">
        <div className="soc-card__left">
          <h5 className="soc-card__title">{society.name}</h5>

          {society.description && (
            <p className="soc-card__desc">{society.description}</p>
          )}

          {society.join_link && (
            <a
              className="soc-card__cta-link"
              href={society.join_link}
              target="_blank"
              rel="noreferrer"
            >
              Register / Join
            </a>
          )}

          {canEdit && (
            <div style={{ marginTop: 10 }}>
              <button className="btn-outline" onClick={() => onEditClick(society)}>
                Edit
              </button>
            </div>
          )}
        </div>

        <div className="soc-card__logoWrap">
          {society.logo_url ? (
            <img
              src={society.logo_url}
              alt={`${society.name} logo`}
              className="soc-card__logo"
            />
          ) : (
            <div className="soc-card__logo soc-card__logo--placeholder">Logo</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Inline Editor for super users ---------- */
function SocietyEditor({ initial, onCancel, onSaved }) {
  const [form, setForm] = useState({
    name: initial.name || "",
    description: initial.description || "",
    join_link: initial.join_link || "",
    logo_url: initial.logo_url || "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const save = async () => {
    setSaving(true);
    setErr("");
    try {
      const { data } = await axios.put(`/societies/${initial.id}`, form);
      onSaved(data.society ?? data);
    } catch (e) {
      console.error(e);
      setErr("Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="soc-card" style={{ borderStyle: "dashed" }}>
      <div
        className="soc-card__content"
        style={{ flexDirection: "column", alignItems: "stretch" }}
      >
        <label className="form-row">
          <span>Name</span>
          <input name="name" value={form.name} onChange={onChange} />
        </label>
        <label className="form-row">
          <span>Description</span>
          <textarea
            name="description"
            rows={3}
            value={form.description}
            onChange={onChange}
          />
        </label>
        <label className="form-row">
          <span>Registration link</span>
          <input name="join_link" value={form.join_link} onChange={onChange} />
        </label>
        <label className="form-row">
          <span>Logo URL</span>
          <input name="logo_url" value={form.logo_url} onChange={onChange} />
        </label>

        {err && <div style={{ color: "crimson" }}>{err}</div>}

        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <button className="btn-outline" onClick={onCancel} disabled={saving}>
            Cancel
          </button>
          <button className="chip" onClick={save} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

export default function JoinSocietiesPage() {
  const [loading, setLoading] = useState(true);
  const [universities, setUniversities] = useState([]);
  const [isSuperUser, setIsSuperUser] = useState(false); // super users, not admins
  const [editMode, setEditMode] = useState(false);       // 👈 NEW: toggle for supers
  const [editingId, setEditingId] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const uniParam = searchParams.get("university") || "";
  const viewParam = searchParams.get("view") || "";
  const focusParam = searchParams.get("focus") || "";
  const [focusedSlug, setFocusedSlug] = useState(focusParam);
  const showAll =
    viewParam === "all" || viewParam === "1" || Boolean(focusedSlug);

  // check current user (Sanctum) for super-user flag
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("/user");
        const superish =
          !!data?.is_super_user ||
          data?.user_type === "super" ||
          data?.user_type === "super_user" || // ✅ added
          data?.role === "super_user" ||
          data?.role === "super";
        setIsSuperUser(Boolean(superish));
      } catch {
        setIsSuperUser(false);
      }
    })();
  }, []);

  // Optional: allow ?edit=1 to auto-enable edit mode
  useEffect(() => {
    if (searchParams.get("edit") === "1") setEditMode(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // load societies
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const { data } = await axios.get("/societies");
        if (cancelled) return;

        const arr = Array.isArray(data) ? data : [];
        const byUni = new Map();
        arr.forEach((s) => {
          const uniName =
            (s.university_name ||
              s.university?.name ||
              "Unknown").toString().trim();
          if (!byUni.has(uniName)) byUni.set(uniName, []);
          byUni.get(uniName).push(s);
        });

        const grouped = Array.from(byUni, ([name, societies]) => ({
          name,
          societies,
        }));

        setUniversities(grouped.length === 0 ? DEMO_UNIS : grouped);
      } catch (e) {
        console.error("Failed to load societies:", e);
        setUniversities(DEMO_UNIS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const chipsFor = (societies) =>
    societies.map((s) => ({
      label: (s.code || s.slug || s.name).toString().toUpperCase(),
      value: s.slug,
      id: s.id,
    }));

  const visibleThree = (societies) => societies.slice(0, 3);

  const handleChipSelect = (chip, uni) => {
    setFocusedSlug(chip.value);
    setSearchParams({
      university: uni.name,
      view: "all",
      focus: chip.value,
    });
  };

  const handleViewAll = (uni) => {
    setFocusedSlug("");
    setSearchParams({
      university: uni.name,
      view: "all",
    });
  };

  // Sync focus from URL
  useEffect(() => {
    setFocusedSlug(focusParam || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusParam]);

  // Auto-scroll focused card
  useEffect(() => {
    if (!focusedSlug) return;
    const el = document.querySelector(`[data-slug="${focusedSlug}"]`);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
    }
  }, [focusedSlug, universities]);

  const norm = (s) => (s || "").toLowerCase().trim();
  const groupsToRender = uniParam
    ? universities.filter((u) => norm(u.name) === norm(uniParam))
    : universities;

  // Replace a society in state after save
  const applyUpdateInState = (updated) => {
    setUniversities((prev) =>
      prev.map((u) => ({
        ...u,
        societies: u.societies.map((s) =>
          s.id === updated.id ? { ...s, ...updated } : s
        ),
      }))
    );
  };

  return (
    <div className="join-page">
      <div
        className="join-header"
        style={{
          backgroundColor: "#F39D0C",
          height: 140,
          display: "flex",
          alignItems: "center",
          color: "#fff",
        }}
      >
        <h1
          style={{
            fontFamily: "Playfair Display, serif",
            fontSize: "24px",
            padding: "0.5rem 1rem",
            margin: 0,
            marginLeft: 50,
          }}
        >
          JOIN US
        </h1>
      </div>

      {/* Edit-mode toggle — visible only to super users */}
      {isSuperUser && (
        <div style={{ display: "flex", justifyContent: "flex-end", margin: "12px 24px 0" }}>
          <button
            className="btn-outline"
            onClick={() => setEditMode((v) => !v)}
            title="Toggle edit mode for societies"
          >
            {editMode ? "✅ Editing Enabled" : "✏️ Enable Editing"}
          </button>
        </div>
      )}

      <div id="register" />

      <main className="join-body">
        <h3 style={{ fontSize: 16, margin: "0 0 12px", fontWeight: 700 }}>
          All Societies
        </h3>

        {loading && <p className="center muted">Loading societies…</p>}

        {!loading &&
          groupsToRender.map((uni) => {
            // reorder so focused card appears first
            const ordered = [...uni.societies];
            if (focusedSlug) {
              ordered.sort((a, b) =>
                a.slug === focusedSlug ? -1 : b.slug === focusedSlug ? 1 : 0
              );
            }

            return (
              <section key={uni.name} className="uni-block">
                <h4 className="uni-title">{uni.name.toUpperCase()}</h4>

                <ChipsScroller
                  items={chipsFor(uni.societies)}
                  onSelect={(chip) => handleChipSelect(chip, uni)}
                />

                <div className="cards-grid">
                  {(showAll ? ordered : visibleThree(ordered)).map((s) => {
                    // Show edit only when super user enabled edit mode
                    const canEdit = isSuperUser && editMode;
                    return (
                      <div key={s.id || s.slug} data-slug={s.slug}>
                        {canEdit && editingId === s.id ? (
                          <SocietyEditor
                            initial={s}
                            onCancel={() => setEditingId(null)}
                            onSaved={(updated) => {
                              applyUpdateInState(updated);
                              setEditingId(null);
                            }}
                          />
                        ) : (
                          <SocietyCard
                            society={s}
                            canEdit={canEdit}
                            onEditClick={(soc) => setEditingId(soc.id)}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                {!showAll && (
                  <div className="uni-actions">
                    <button
                      className="btn-outline"
                      onClick={() => handleViewAll(uni)}
                    >
                      View all societies
                    </button>
                  </div>
                )}

                <hr className="uni-sep" />
              </section>
            );
          })}

        {!loading && groupsToRender.length === 0 && (
          <p className="center muted">No societies found.</p>
        )}
      </main>
    </div>
  );
}
