import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function EditProfile() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => setAvatar(event.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/users/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
        body: JSON.stringify({ username, email, avatar }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      const updatedUser = await res.json();

      setUser((prev) => ({ ...prev, ...updatedUser })); // обновляем AuthContext
      navigate(`/profile/${user.id}`);
    } catch (err) {
      console.error("Save profile error:", err);
    }
  };

  return (
    <div className="container mx-auto p-6 text-white">
      <h2 className="text-3xl font-bold mb-6 neon-text">Edit Profile</h2>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="w-40 h-40 border-4 border-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center neon-glow cursor-pointer"
      >
        {avatar ? <img src={avatar} alt="Avatar" className="w-full h-full rounded-full" /> : "Drag & Drop Avatar"}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="p-3 rounded-lg bg-[rgba(10,7,18,0.55)] border border-purple-800/40 neon-input"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="p-3 rounded-lg bg-[rgba(10,7,18,0.55)] border border-purple-800/40 neon-input"
        />
        <div className="flex gap-4 justify-center mt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-purple-500 rounded-full neon-button font-semibold hover:bg-purple-600 transition-colors"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => navigate(`/profile/${user.id}`)}
            className="px-6 py-3 bg-gray-700 rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}
