import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";
import "../styles/profile.css";

export default function Profile() {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
      return;
    }
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const res = await API.get("/user/profile");
    setUser(res.data);
  };

  // 🖼️ Upload image
  const changeImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    await API.post("/user/profile-image", formData);
    fetchProfile();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("salary");
    navigate("/");
  };

  if (!user) return null;

  return (
    <div>
      <Navbar />

      <div className="profile-container">
        <div className="profile-card">
          {/* Clickable Image */}
          <div
            className="profile-image-wrapper"
            onClick={() => fileRef.current.click()}
          >
            <img
              src={
                user.profile_image
                  ? `http://localhost:5000${user.profile_image}`
                  : "https://i.pravatar.cc/150"
              }
              alt="Profile"
              className="profile-img"
            />
            <span className="edit-overlay">Change</span>
          </div>

          <input
            type="file"
            ref={fileRef}
            accept="image/*"
            onChange={changeImage}
            hidden
          />

          <h2>{user.name}</h2>
          <p>{user.email}</p>

          <div className="profile-divider"></div>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
