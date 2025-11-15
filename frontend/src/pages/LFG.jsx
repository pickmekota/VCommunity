import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

// пример данных постов (позже будут с бэкенда)
const mockPosts = [
  {
    id: 1,
    author: "ShadowFox",
    role: "Duelist",
    level: 45,
    text: "Ищу команду для Ranked. Голосовой канал обязателен!",
  },
  {
    id: 2,
    author: "NightOwl",
    role: "Controller",
    level: 30,
    text: "Играю ночью, ищу тиммейтов для практики.",
  },
  {
    id: 3,
    author: "ViperQueen",
    role: "Sentinel",
    level: 55,
    text: "Скилы хорошие, ищу стабильную команду.",
  },
];

export default function LFG({ user, logout }) {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // загружаем посты (пока mock)
    setPosts(mockPosts);
  }, []);

  const handleJoin = (author) => {
    alert(`Вы присоединились к ${author}`);
  };

  return (
    <div className="relative w-full min-h-screen  text-white overflow-hidden">
      

      {/* Фон с частицами или subtle gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#08060f] via-[#0a0812] to-[#06040a]" />

      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl md:text-5xl font-extrabold text-purple-400 mb-8 text-center neon-text">
          LFG — Ищи тиммейтов
        </h1>

        {/* Лента постов */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className=" border border-purple-700/20 rounded-2xl p-6 shadow-xl backdrop-blur-md transition-transform transform hover:scale-105 hover:shadow-purple-900/50"
            >
              <h2 className="text-xl font-bold text-purple-300 mb-2 neon-text">
                {post.author}
              </h2>
              <p className="text-gray-300 mb-2">
                Роль: <span className="text-purple-400">{post.role}</span> | Уровень:{" "}
                <span className="text-purple-400">{post.level}</span>
              </p>
              <p className="text-gray-200 mb-4">{post.text}</p>
              <button
                onClick={() => handleJoin(post.author)}
                className="bg-purple-500 hover:bg-purple-600 transition-colors text-white px-4 py-2 rounded-full neon-button"
              >
                Присоединиться
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
