import React, { useState, useContext } from "react";
import "../styles/AddMess.css"; // ✅ Ensure filename matches (not AddMessForm.css)
import api from "../services/api";
import { AuthContext } from "../Context/AuthContext";

const AddMessForm = () => {
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    location: "",
    price_range: "",
    offer: "",
    pancard: null,
    menuPhoto: null,
  });

  const [menuItems, setMenuItems] = useState([
    { name: "", price: "", description: "", isVeg: true },
  ]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Handle general form input
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  // ✅ Handle menu item updates
  const handleMenuChange = (i, field, value) => {
    const updated = [...menuItems];
    updated[i][field] = value;
    setMenuItems(updated);
  };

  // ✅ Add new menu item
  const addMenuItem = () => {
    setMenuItems([
      ...menuItems,
      { name: "", price: "", description: "", isVeg: true },
    ]);
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) data.append(key, formData[key]);
      });

      // ✅ Format menu properly
      data.append("menu", JSON.stringify({ items: menuItems }));

      const res = await api.post("/mess-requests", data, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        setMessage("✅ Mess request submitted successfully!");
        setFormData({
          name: "",
          mobile: "",
          email: "",
          location: "",
          price_range: "",
          offer: "",
          pancard: null,
          menuPhoto: null,
        });
        setMenuItems([{ name: "", price: "", description: "", isVeg: true }]);
      } else {
        setMessage("❌ Failed to submit mess request");
      }
    } catch (err) {
      console.error("❌ Error submitting mess request:", err);
      setMessage("❌ Failed to submit mess request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="addmess-page">
      <div className="addmess-wrapper">
        <h2 className="addmess-title">Add Your Mess</h2>

        <form className="addmess-form" onSubmit={handleSubmit}>
          {/* Row 1 */}
          <div className="form-row">
            <input
              type="text"
              name="name"
              placeholder="Mess Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Row 2 */}
          <div className="form-row">
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            >
              <option value="">Select Location</option>
              <option value="Bhubaneswar">Bhubaneswar</option>
              <option value="Cuttack">Cuttack</option>
              <option value="Puri">Puri</option>
            </select>
            <input
              type="text"
              name="price_range"
              placeholder="₹100 - ₹200"
              value={formData.price_range}
              onChange={handleChange}
            />
            <input
              type="text"
              name="offer"
              placeholder="Offer (optional)"
              value={formData.offer}
              onChange={handleChange}
            />
          </div>

          {/* Menu Section */}
          <div className="menu-section">
            <h4>Menu Items</h4>
            {menuItems.map((item, i) => (
              <div key={i} className="menu-item-row">
                <input
                  type="text"
                  placeholder="Dish Name"
                  value={item.name}
                  onChange={(e) =>
                    handleMenuChange(i, "name", e.target.value)
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) =>
                    handleMenuChange(i, "price", e.target.value)
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) =>
                    handleMenuChange(i, "description", e.target.value)
                  }
                />
                <select
                  value={item.isVeg ? "veg" : "non-veg"}
                  onChange={(e) =>
                    handleMenuChange(i, "isVeg", e.target.value === "veg")
                  }
                >
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non-Veg</option>
                </select>
              </div>
            ))}
            <button type="button" onClick={addMenuItem}>
              ➕ Add Another Dish
            </button>
          </div>

          {/* Uploads */}
          <label>PAN Card Photo</label>
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

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>

          {message && (
            <p className={message.startsWith("✅") ? "success-msg" : "error-msg"}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddMessForm;
