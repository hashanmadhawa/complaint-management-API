import ComplaintCard from "./ComplaintCard";

function ComplaintList({ complaints, fetchComplaints }) {
  return (
    <div>
      <h2>All Complaints</h2>

      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        complaints.map((complaint) => (
          <ComplaintCard
            key={complaint._id}
            complaint={complaint}
            fetchComplaints={fetchComplaints}
          />
        ))
      )}
    </div>
  );
}

export default ComplaintList;
