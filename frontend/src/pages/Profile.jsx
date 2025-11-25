import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = Number(id) || user?.id; // безопасно обрабатываем id

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`http://localhost:4000/api/users/${userId}`);
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [userId]);

  if (loading) return <p className="text-white text-center mt-20">Loading profile...</p>;
  if (!profile) return <p className="text-red-500 text-center mt-20">User not found</p>;

  return (
    <div className="relative w-full min-h-screen text-white overflow-hidden">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto bg-[rgba(10,7,18,0.55)] border border-purple-800/40 rounded-2xl p-8 backdrop-blur-md shadow-xl">
          <div className="flex flex-col items-center gap-4">
            <img
              src={profile.avatar || `https://i.pravatar.cc/150?u=${profile.id}`}
              alt="Avatar"
              className="w-32 h-32 rounded-full border-4 border-purple-500 neon-glow"
            />
            <h1 className="text-3xl md:text-4xl font-extrabold neon-text">{profile.username}</h1>
            <p className="text-gray-300">{profile.email}</p>

            <div className="flex justify-around w-full mt-6 text-center">
              <div>
                <p className="text-purple-400 font-semibold text-xl">{profile.posts || 0}</p>
                <p className="text-gray-400 text-sm">Posts</p>
              </div>
              <div>
                <p className="text-purple-400 font-semibold text-xl">{profile.lfg || 0}</p>
                <p className="text-gray-400 text-sm">LFG</p>
              </div>
              <div>
                <p className="text-purple-400 font-semibold text-xl">{profile.trainingScore || 0}</p>
                <p className="text-gray-400 text-sm">Training</p>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              {user && user.id === profile.id && (
                <button
                  onClick={() => navigate("/edit-profile")}
                  className="px-6 py-3 rounded-full bg-purple-500 neon-button font-semibold hover:bg-purple-600 transition-colors"
                >
                  Edit Profile
                </button>
              )}
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-3 rounded-full bg-gray-700 hover:bg-gray-800 transition-colors font-semibold"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
