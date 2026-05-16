import { useEffect, useState, useCallback } from "react";
import API from "./services/api";
import ComplaintCard from "./components/ComplaintCard";
import ComplaintModal from "./components/ComplaintModal";
import CreateComplaintModal from "./components/CreateComplaintModal";

const FILTERS = ["all", "pending", "in_progress", "resolved"];

const FILTER_LABELS = {
  all:         "All",
  pending:     "Pending",
  in_progress: "In Progress",
  resolved:    "Resolved",
};

export default function App() {
  const [complaints, setComplaints] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [apiError,   setApiError]   = useState(null);
  const [filter,     setFilter]     = useState("all");
  const [search,     setSearch]     = useState("");
  const [selected,   setSelected]   = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const fetchComplaints = useCallback(async () => {
    setLoading(true); setApiError(null);
    try {
      const res = await API.get("/");
      setComplaints(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      const unreachable = err?.code === "ERR_NETWORK" || !err?.response;
      setApiError(
        unreachable
          ? "Cannot reach the API. Make sure the backend is running on port 8000."
          : err?.response?.data?.message ?? "Failed to load complaints."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  const handleUpdated = (updated) =>
    setComplaints(prev => prev.map(c => c._id === updated._id ? updated : c));

  const handleDeleted = (id) =>
    setComplaints(prev => prev.filter(c => c._id !== id));

  const handleCreated = (created) =>
    setComplaints(prev => [created, ...prev]);

  const filtered = complaints
    .filter(c => filter === "all" || c.status === filter)
    .filter(c => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        c.title.toLowerCase().includes(q)       ||
        c.location.toLowerCase().includes(q)    ||
        c.catagory.toLowerCase().includes(q)    ||
        c.description.toLowerCase().includes(q)
      );
    });

  const counts = {
    all:         complaints.length,
    pending:     complaints.filter(c => c.status === "pending").length,
    in_progress: complaints.filter(c => c.status === "in_progress").length,
    resolved:    complaints.filter(c => c.status === "resolved").length,
  };

  const statItems = [
    { label: "Total",       key: "all" },
    { label: "Pending",     key: "pending" },
    { label: "In Progress", key: "in_progress" },
    { label: "Resolved",    key: "resolved" },
  ];

  return (
    <div className="app-shell">

      {/* ── Topbar ── */}
      <header className="topbar">
        <div className="topbar-brand">
          <span className="brand-logo">CM</span>
          Complaint Manager
        </div>
        <div className="topbar-actions">
          <button className="btn btn-ghost" onClick={fetchComplaints}>
            ↻ Refresh
          </button>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            + New complaint
          </button>
        </div>
      </header>

      <main className="main">

        {/* ── Page header ── */}
        <div className="page-header">
          <h1 className="page-title">Complaints Dashboard</h1>
          <p className="page-subtitle">
            {complaints.length} total complaint{complaints.length !== 1 ? "s" : ""} submitted
          </p>
        </div>

        {/* ── Stats ── */}
        <div className="stats-bar">
          {statItems.map(({ label, key }) => (
            <div className="stat-card" key={key}>
              <p className="stat-label">{label}</p>
              <p className="stat-value">{counts[key]}</p>
            </div>
          ))}
        </div>

        {/* ── API Error ── */}
        {apiError && (
          <div className="alert alert-error" style={{ marginBottom: "1rem" }}>
            <span>⚠</span> {apiError}
          </div>
        )}

        {/* ── Toolbar ── */}
        <div className="toolbar">
          <div className="search-wrap">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              type="text"
              placeholder="Search title, category, location…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="filter-tabs">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`filter-tab ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {FILTER_LABELS[f]}
                {counts[f] > 0 && (
                  <span style={{
                    marginLeft: 4,
                    background: filter === f ? "var(--brand)" : "var(--border)",
                    color: filter === f ? "#fff" : "var(--text-secondary)",
                    borderRadius: 20,
                    padding: "1px 7px",
                    fontSize: 11,
                    fontWeight: 600,
                  }}>
                    {counts[f]}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── List ── */}
        {loading ? (
          <div className="loading">Loading complaints…</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p className="empty-title">No complaints found</p>
            <p className="empty-sub">
              {search ? "Try a different search term." : "No complaints in this category yet."}
            </p>
          </div>
        ) : (
          <div className="complaint-list">
            {filtered.map(c => (
              <ComplaintCard
                key={c._id}
                complaint={c}
                onClick={() => setSelected(c)}
                onUpdated={handleUpdated}
                onDeleted={handleDeleted}
              />
            ))}
          </div>
        )}

      </main>

      {/* ── Modals ── */}
      {selected && (
        <ComplaintModal
          complaint={complaints.find(c => c._id === selected._id) ?? selected}
          onClose={() => setSelected(null)}
          onUpdated={handleUpdated}
        />
      )}

      {showCreate && (
        <CreateComplaintModal
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}
