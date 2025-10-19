import React, { useState } from "react";
import "../styles/AddMess.css";

const AddMessForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    pancard: null,
    menuPhoto: null,
    location: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✅ Mess request submitted successfully!");
    console.log(formData);
  };

  return (
    <div className="addmess-page">
      <div className="addmess-wrapper">
        <h2 className="addmess-title">Add Your Mess</h2>

        <form className="addmess-form" onSubmit={handleSubmit}>
          <label>Mess Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter Mess Name"
            onChange={handleChange}
            required
          />

          <label>Mobile Number</label>
          <input
            type="text"
            name="mobile"
            placeholder="Enter Mobile Number"
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            onChange={handleChange}
            required
          />

          <label>Pancard Photo</label>
          <input
            type="file"
            name="pancard"
            accept="image/*"
            onChange={handleChange}
          />

          <label>Menu Photo</label>
          <input
            type="file"
            name="menuPhoto"
            accept="image/*"
            onChange={handleChange}
          />

          <label>Mess Location</label>
          <select name="location" onChange={handleChange} required>
            <option value="">Select Location</option>
            <option value="Bhubaneswar">Bhubaneswar</option>
            <option value="Cuttack">Cuttack</option>
            <option value="Puri">Puri</option>
          </select>

          <button type="submit" className="submit-btn">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMessForm;
