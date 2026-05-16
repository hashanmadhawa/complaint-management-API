import { useState } from "react";
import API from "../services/api";
import StatusBadge from "./StatusBadge";
import { formatDateTime } from "../utils/dateUtils";

export default function ComplaintModal({ complaint, onClose, onUpdated }) {
  const [response, setResponse] = useState(complaint.response ?? "");
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [error,    setError]    = useState("");

  const handleSave = async () => {
    if (!response.trim()) { setError("Response cannot be empty."); return; }
    setSaving(true); setError("");
    try {
      const res = await API.put(`/${complaint._id}/response`, { response: response.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      onUpdated?.(res.data.data);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Could not save response.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="modal-header">
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="modal-title">{complaint.title}</p>
            <div className="modal-meta" style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
              <span>{complaint.catagory}</span>
              <span>·</span>
              <span>{complaint.location}</span>
            </div>
          </div>
          <button className="btn btn-icon" onClick={onClose} aria-label="Close" style={{ flexShrink: 0 }}>
            ✕
          </button>
        </div>

        <div className="modal-body">

          {/* Status + dates row */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <StatusBadge status={complaint.status} />
            <span className="info-pill">
              <span className="info-pill-icon">📅</span>
              Submitted: {formatDateTime(complaint.createdAt)}
            </span>
            {complaint.updatedAt !== complaint.createdAt && (
              <span className="info-pill">
                <span className="info-pill-icon">✏️</span>
                Updated: {formatDateTime(complaint.updatedAt)}
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <p className="field-label">Description</p>
            <p className="field-text">{complaint.description}</p>
          </div>

          {/* Current response if exists */}
          {complaint.response && (
            <div>
              <p className="field-label">Current response</p>
              <div className="response-box">{complaint.response}</div>
            </div>
          )}

          <hr className="modal-divider" />

          {/* Add / update response */}
          <div>
            <p className="field-label">
              {complaint.response ? "Update response" : "Add response"}
            </p>
            <textarea
              className="response-textarea"
              value={response}
              onChange={e => { setResponse(e.target.value); setSaved(false); setError(""); }}
              placeholder="Write your official reply to this complaint…"
              rows={4}
            />
            {error && (
              <p className="card-error" style={{ marginTop: 6 }}>⚠ {error}</p>
            )}
          </div>

          <div className="modal-actions">
            <button className="btn" onClick={onClose}>Cancel</button>
            <button
              className={`btn btn-primary ${saved ? "btn-success" : ""}`}
              onClick={handleSave}
              disabled={saving}
              style={saved ? { background: "var(--green)", borderColor: "var(--green)" } : {}}
            >
              {saving ? "Saving…" : saved ? "✓ Response saved" : "Save response"}
            </button>
          </div>

          {/* Footer meta */}
          <p style={{ fontSize: 11, color: "var(--text-muted)", borderTop: "1px solid var(--border)", paddingTop: "10px" }}>
            Complaint ID: {complaint._id}
          </p>
        </div>
      </div>
    </div>
  );
}
