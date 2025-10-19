// src/components/AddMessButton.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import "../styles/AddMessButton.css";

const AddMessButton = () => {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // ✅ get user from context

  // ✅ Show button only if logged-in user is an owner
  const isOwner = user && user.role === "owner";

  useEffect(() => {
    if (!isOwner) return; // 👈 prevent observer if not owner

    const messSection = document.querySelector("#mess-section");
    const footerSection = document.querySelector("#footer-section");

    if (!messSection || !footerSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const isMessVisible = entries.some(
          (entry) => entry.target.id === "mess-section" && entry.isIntersecting
        );
        const isFooterVisible = entries.some(
          (entry) => entry.target.id === "footer-section" && entry.isIntersecting
        );

        // ✅ Hide when either section visible
        if (isMessVisible || isFooterVisible) {
          setVisible(false);
        } else {
          setVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(messSection);
    observer.observe(footerSection);

    return () => observer.disconnect();
  }, [isOwner]);

  const handleAddMess = () => {
    navigate("/addmess");
  };

  // ✅ Don’t render button at all if user isn’t owner
  if (!isOwner) return null;

  return (
    <button
      className={`add-mess-btn ${visible ? "show" : "hide"}`}
      onClick={handleAddMess}
    >
      + Add Mess
    </button>
  );
};

export default AddMessButton;
