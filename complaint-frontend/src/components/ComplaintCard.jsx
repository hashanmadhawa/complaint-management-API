import { useEffect, useState } from "react";
import API from "../services/api";

function ComplaintCard({ complaint, fetchComplaints }) {
  const [responseDraft, setResponseDraft] = useState(complaint.response ?? "");

  useEffect(() => {
    setResponseDraft(complaint.response ?? "");
  }, [complaint._id, complaint.response]);

  const updateStatus = async (status) => {
    try {
      await API.put(`/${complaint._id}/status`, {
        status,
      });

      fetchComplaints();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteComplaint = async () => {
    try {
      await API.delete(`/${complaint._id}`);

      fetchComplaints();
    } catch (error) {
      console.log(error);
    }
  };

  const saveResponse = async () => {
    try {
      await API.put(`/${complaint._id}/response`, {
        response: responseDraft.trim(),
      });
      alert("Response saved");
      fetchComplaints();
    } catch (error) {
      console.error(error?.response?.data ?? error);
      alert(
        error?.response?.data?.message ??
          "Could not save response. Check console."
      );
    }
  };

  return (
    <div className="card">
      <h3>{complaint.title}</h3>

      <p>{complaint.description}</p>

      <p>
        <strong>Category:</strong> {complaint.catagory}
      </p>

      <p>
        <strong>Location:</strong> {complaint.location}
      </p>

      <p>
        <strong>Status:</strong> {complaint.status}
      </p>

      {complaint.response && (
        <p>
          <strong>Current response:</strong> {complaint.response}
        </p>
      )}

      <div className="response-block">
        <label className="response-label" htmlFor={`response-${complaint._id}`}>
          Add or update response
        </label>
        <textarea
          id={`response-${complaint._id}`}
          className="response-input"
          rows={3}
          placeholder="Type your reply to this complaint…"
          value={responseDraft}
          onChange={(e) => setResponseDraft(e.target.value)}
        />
        <button type="button" onClick={saveResponse}>
          Save response
        </button>
      </div>

      <div className="button-group">
        <button onClick={() => updateStatus("pending")}>
          Pending
        </button>

        <button onClick={() => updateStatus("in_progress")}>
          In Progress
        </button>

        <button onClick={() => updateStatus("resolved")}>
          Resolved
        </button>

        <button onClick={deleteComplaint}>
          Delete
        </button>
      </div>
    </div>
  );
}

export default ComplaintCard;
