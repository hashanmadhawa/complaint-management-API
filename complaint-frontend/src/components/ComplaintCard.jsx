import { useState } from "react";
import API from "../services/api";
import StatusBadge from "./StatusBadge";
import { formatDate } from "../utils/dateUtils";

const STATUS_OPTIONS = ["pending", "in_progress", "resolved"];

export default function ComplaintCard({ complaint, onClick, onUpdated, onDeleted }) {
  const [status, setStatus] = useState(complaint.status);
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState("");

  const changed = status !== complaint.status;

  const handleUpdate = async (e) => {
    e.stopPropagation();
    setSaving(true); setError("");
    try {
      const res = await API.put(`/${complaint._id}/status`, { status });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      onUpdated?.(res.data.data);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this complaint? This cannot be undone.")) return;
    try {
      await API.delete(`/${complaint._id}`);
      onDeleted?.(complaint._id);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Delete failed.");
    }
  };

  return (
    <div className="complaint-card" onClick={onClick}>

      {/* Header row */}
      <div className="card-header">
        <div style={{ flex: 1, minWidth: 0 }}>
          <p className="card-title">{complaint.title}</p>
          <div className="card-meta">
            <span>{complaint.catagory}</span>
            <span className="card-meta-dot" />
            <span>{complaint.location}</span>
          </div>
        </div>
        <StatusBadge status={complaint.status} />
      </div>

      {/* Description */}
      <p className="card-desc">{complaint.description}</p>

      {/* Footer — actions + date */}
      <div className="card-footer" onClick={e => e.stopPropagation()}>
        <select
          className="status-select"
          value={status}
          onChange={e => { setStatus(e.target.value); setSaved(false); setError(""); }}
        >
          {STATUS_OPTIONS.map(s => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>

        <button
          className={`btn btn-sm ${saved ? "btn-success" : changed ? "btn-primary" : ""}`}
          onClick={handleUpdate}
          disabled={!changed || saving}
        >
          {saving ? "Saving…" : saved ? "✓ Saved" : "Update"}
        </button>

        <button
          className="btn btn-sm btn-danger"
          onClick={handleDelete}
        >
          Delete
        </button>

        <button
          className="btn btn-sm"
          onClick={onClick}
          style={{ marginLeft: "auto" }}
        >
          Details →
        </button>

        {/* Submission date */}
        <span className="card-date">
          <span>🗓</span>
          {formatDate(complaint.createdAt)}
        </span>
      </div>

      {error && <p className="card-error">⚠ {error}</p>}
    </div>
  );
}
