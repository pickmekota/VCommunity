// EditProfile.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function EditProfile() {
  const { user, token, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setEmail(user.email);
      setPreview(user.avatar_url || null);
    }
  }, [user]);

  // Drag & Drop обработка
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const saveProfile = async () => {
    setLoading(true);
    setError("");

    try {
      let avatarBase64 = null;
      if (avatar) {
        avatarBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(avatar);
        });
      }

      const response = await fetch("http://localhost:4000/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username,
          email,
          avatar: avatarBase64,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to update profile");
      }

      const updatedUser = await response.json();
      setUser(updatedUser); // обновляем AuthContext
      navigate(`/profile/${updatedUser.id}`);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0712] text-white flex flex-col items-center py-10">
      <div className="w-full max-w-lg p-8 bg-[rgba(10,7,18,0.55)] border border-purple-800/40 rounded-2xl backdrop-blur-md shadow-xl">
        <h2 className="text-3xl font-extrabold mb-6 neon-text text-center">Edit Profile</h2>

        <div
          className="w-32 h-32 mx-auto mb-6 border-4 border-purple-500 rounded-full neon-glow flex items-center justify-center overflow-hidden cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {preview ? (
            <img src={preview} alt="Avatar Preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-purple-400">Drag & Drop</span>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            className="p-3 rounded-lg bg-[#1c1a29] border border-purple-700 outline-none text-white"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            className="p-3 rounded-lg bg-[#1c1a29] border border-purple-700 outline-none text-white"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={saveProfile}
            disabled={loading}
            className="w-full py-3 mt-2 rounded-full bg-purple-500 neon-button font-semibold hover:bg-purple-600 transition-colors"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

          <button
            onClick={() => navigate(`/profile/${user?.id}`)}
            className="w-full py-3 rounded-full bg-gray-700 hover:bg-gray-800 transition-colors font-semibold"
          >
            Back to Profile
          </button>
        </div>
      </div>
    </div>
  );
}
