import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/AdminDataPage.css";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    api
      .get("/admin-extra/students", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setStudents(res.data))
      .catch((err) => console.error("❌ Failed to fetch students:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-data-page">
      <header className="admin-header-bar">
        <h1>🎓 All Registered Students</h1>
        <button className="back-btn" onClick={() => window.history.back()}>
          Back to Dashboard
        </button>
      </header>

      {loading ? (
        <div className="loading">Loading students...</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {students.length > 0 ? (
              students.map((s) => (
                <tr key={s._id}>
                  <td>{s._id}</td>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-data">
                  No students found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminStudents;
