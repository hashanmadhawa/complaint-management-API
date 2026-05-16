import { useEffect, useState } from "react";
import API from "./services/api";
import ComplaintForm from "./components/ComplaintForm";
import ComplaintList from "./components/ComplaintList";

function App() {
  const [complaints, setComplaints] = useState([]);
  const [apiError, setApiError] = useState(null);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/");
      const rows = res.data?.data;
      setComplaints(Array.isArray(rows) ? rows : []);
      setApiError(null);
    } catch (error) {
      console.error(error?.response?.data ?? error.message);
      setComplaints([]);
      const unreachable =
        error?.code === "ERR_NETWORK" ||
        error?.message === "Network Error" ||
        (!error?.response && typeof error?.message === "string");

      setApiError(
        unreachable
          ? "Cannot reach the API. Start the backend (MongoDB must connect), or from the repo root run: npm install && npm run dev"
          : error?.response?.data?.message ??
              error?.message ??
              "Failed to load complaints."
      );
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="container">
      <h1>Complaint Management System</h1>

      {apiError && (
        <div className="api-error" role="alert">
          {apiError}
        </div>
      )}

      <ComplaintForm fetchComplaints={fetchComplaints} />

      <ComplaintList
        complaints={complaints}
        fetchComplaints={fetchComplaints}
      />
    </div>
  );
}

export default App;
