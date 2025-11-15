import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";

export default function Profile({ user, logout }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);

  // Имитация загрузки данных профиля
  useEffect(() => {
    // В реальном проекте — fetch(`/api/users/${id}`)
    // Пока mock:
    const mockProfile = {
      id,
      username: id === "1" ? "Victor" : "Player" + id,
      email: "user@example.com",
      avatar: `https://i.pravatar.cc/150?u=${id}`,
      posts: Math.floor(Math.random() * 50),
      lfg: Math.floor(Math.random() * 10),
      trainingScore: Math.floor(Math.random() * 200),
    };
    setProfile(mockProfile);
  }, [id]);

  if (!profile) return null;

  return (
    <div className="relative w-full min-h-screen  text-white overflow-hidden">
      

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto bg-[rgba(10,7,18,0.55)] border border-purple-800/40 rounded-2xl p-8 backdrop-blur-md shadow-xl">
          <div className="flex flex-col items-center gap-4">
            {/* Avatar */}
            <img
              src={profile.avatar}
              alt="Avatar"
              className="w-32 h-32 rounded-full border-4 border-purple-500 neon-glow"
            />

            {/* Username */}
            <h1 className="text-3xl md:text-4xl font-extrabold neon-text">
              {profile.username}
            </h1>

            {/* Email */}
            <p className="text-gray-300">{profile.email}</p>

            {/* Stats */}
            <div className="flex justify-around w-full mt-6 text-center">
              <div>
                <p className="text-purple-400 font-semibold text-xl">
                  {profile.posts}
                </p>
                <p className="text-gray-400 text-sm">Posts</p>
              </div>
              <div>
                <p className="text-purple-400 font-semibold text-xl">
                  {profile.lfg}
                </p>
                <p className="text-gray-400 text-sm">LFG</p>
              </div>
              <div>
                <p className="text-purple-400 font-semibold text-xl">
                  {profile.trainingScore}
                </p>
                <p className="text-gray-400 text-sm">Training</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-6">
              {user && user.id === id && (
                <button
                  onClick={() => navigate("/edit-profile")}
                  className="px-6 py-3 rounded-full bg-purple-500 neon-button font-semibold hover:bg-purple-600 transition-colors"
                >
                  Edit Profile
                </button>
              )}
              <button
                onClick={logout}
                className="px-6 py-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
