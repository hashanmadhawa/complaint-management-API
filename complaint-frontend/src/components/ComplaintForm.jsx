import { useState } from "react";
import API from "../services/api";

function ComplaintForm({ fetchComplaints }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    catagory: "",
    location: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/", formData);

      alert("Complaint Submitted Successfully");

      setFormData({
        title: "",
        description: "",
        catagory: "",
        location: "",
      });

      fetchComplaints();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Create Complaint</h2>

      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="catagory"
        placeholder="Category"
        value={formData.catagory}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="location"
        placeholder="Location"
        value={formData.location}
        onChange={handleChange}
        required
      />

      <button type="submit">Submit Complaint</button>
    </form>
  );
}

export default ComplaintForm;
