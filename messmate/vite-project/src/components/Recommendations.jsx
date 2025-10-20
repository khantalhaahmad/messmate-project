// src/components/Recommendations.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const { user } = useContext(AuthContext); // user._id should be available

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(
          `https://messmate-backend.onrender.com/recommendations/${user._id}`
        );
        setRecommendations(res.data.data);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      }
    };
    if (user?._id) fetchRecommendations();
  }, [user]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">
        🍽️ Recommended for You
      </h2>

      {recommendations.length === 0 ? (
        <p className="text-gray-500">No recommendations available yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {recommendations.map((mess) => (
            <div
              key={mess._id}
              className="bg-white rounded-2xl shadow-md p-3 hover:scale-105 transition-transform"
            >
              <img
                src={mess.imageUrl || "/default-food.jpg"}
                alt={mess.name}
                className="rounded-xl w-full h-36 object-cover mb-2"
              />
              <h3 className="font-semibold text-lg">{mess.name}</h3>
              <p className="text-gray-500 text-sm">{mess.location}</p>
              <p className="text-sm mt-1">
                ⭐ {mess.rating || "4.0"} | {mess.menu?.length || 0} Items
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Recommendations;
