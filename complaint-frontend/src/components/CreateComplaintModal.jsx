import { useState } from "react";
import API from "../services/api";

const CATEGORIES = ["Infrastructure", "Safety", "Noise", "Environment", "Sanitation", "Other"];
const EMPTY = { title: "", description: "", catagory: "", location: "" };

export default function CreateComplaintModal({ onClose, onCreated }) {
  const [form,    setForm]    = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const set = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.title || !form.catagory || !form.location || !form.description) {
      setError("All fields are required.");
      return;
    }
    setLoading(true); setError("");
    try {
      const res = await API.post("/", form);
      onCreated?.(res.data.data);
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message ?? "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <div>
            <p className="modal-title">Submit a complaint</p>
            <p className="modal-meta">All fields are required</p>
          </div>
          <button className="btn btn-icon" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="modal-body">
          <div className="form-grid">

            {/* Title — full width */}
            <div className="form-group span-2">
              <label className="field-label">Title</label>
              <input
                className="form-input"
                name="title"
                value={form.title}
                onChange={set}
                placeholder="Brief title of the complaint"
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="field-label">Category</label>
              <select className="form-select" name="catagory" value={form.catagory} onChange={set}>
                <option value="">Select…</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Location */}
            <div className="form-group">
              <label className="field-label">Location</label>
              <input
                className="form-input"
                name="location"
                value={form.location}
                onChange={set}
                placeholder="Where did this occur?"
              />
            </div>

            {/* Description — full width */}
            <div className="form-group span-2">
              <label className="field-label">Description</label>
              <textarea
                className="form-textarea"
                name="description"
                value={form.description}
                onChange={set}
                placeholder="Describe the issue in detail…"
                rows={4}
              />
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              <span>⚠</span> {error}
            </div>
          )}

          <div className="modal-actions">
            <button className="btn" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting…" : "Submit complaint"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
