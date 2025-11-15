import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import LFGCard from "../components/LFGCard";
import PostCard from "../components/PostCard";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

/**
 * Feed.jsx — Nocturnum style feed page
 */

export default function Feed() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animRef = useRef(null);
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [onlinePlayers, setOnlinePlayers] = useState([]);

  // Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login", { replace: true });
  }, [navigate]);

  // Example fetch posts (replace with real API)
  useEffect(() => {
    setPosts([
      { id: 1, author: "AgentX", content: "Собираю команду на матч!", likes: 12 },
      { id: 2, author: "Viper", content: "Тренировка реакций сегодня в 20:00", likes: 8 },
    ]);

    setOnlinePlayers(["AgentX", "Viper", "Phoenix", "Jett"]);
  }, []);

  // Particles background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let dpr = window.devicePixelRatio || 1;

    function resize() {
      dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createParticles() {
      const area = canvas.clientWidth * canvas.clientHeight;
      const baseCount = Math.round((area / 80000) * 60);
      const count = Math.max(25, Math.min(baseCount, 120));
      particlesRef.current = Array.from({ length: count }).map(() => {
        const size = Math.random() * 2.4 + 0.6;
        return {
          x: Math.random() * canvas.clientWidth,
          y: Math.random() * canvas.clientHeight,
          vx: (Math.random() - 0.5) * 0.26,
          vy: (Math.random() - 0.5) * 0.26,
          size,
          hue: 270 + Math.random() * 60,
          alpha: 0.08 + Math.random() * 0.45,
          phase: Math.random() * Math.PI * 2,
          sway: 0.2 + Math.random() * 0.6,
        };
      });
    }

    function draw(now) {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

      // subtle background gradient
      const g = ctx.createLinearGradient(0, 0, canvas.clientWidth, canvas.clientHeight);
      g.addColorStop(0, "rgba(8,6,20,0.6)");
      g.addColorStop(0.5, "rgba(10,8,18,0.6)");
      g.addColorStop(1, "rgba(6,4,10,0.6)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx + Math.cos((now / 1000) * p.sway + p.phase) * 0.02;
        p.y += p.vy + Math.sin((now / 1200) * p.sway + p.phase) * 0.02;

        if (p.x < -10) p.x = canvas.clientWidth + 10;
        if (p.x > canvas.clientWidth + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.clientHeight + 10;
        if (p.y > canvas.clientHeight + 10) p.y = -10;

        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 8);
        grad.addColorStop(0, `hsla(${p.hue}, 80%, 65%, ${p.alpha})`);
        grad.addColorStop(0.4, `hsla(${p.hue}, 80%, 45%, ${p.alpha * 0.65})`);
        grad.addColorStop(1, `hsla(${p.hue}, 70%, 20%, 0)`);
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 90%, 75%, ${Math.min(1, p.alpha * 2)})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    resize();
    createParticles();
    animRef.current = requestAnimationFrame(draw);
    const onResize = () => {
      resize();
      createParticles();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden ">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10" />

      

      <div className="flex gap-4 px-4 pt-4">
        {/* Sidebar */}
        <aside className="w-64 hidden md:block text-gray-300 space-y-4">
          <div className="p-3 hover:text-purple-400 cursor-pointer rounded-lg transition-colors">Feed</div>
          <div className="p-3 hover:text-purple-400 cursor-pointer rounded-lg transition-colors">LFG</div>
          <div className="p-3 hover:text-purple-400 cursor-pointer rounded-lg transition-colors">Training</div>
          <div className="p-3 hover:text-purple-400 cursor-pointer rounded-lg transition-colors">Players</div>
          <div className="p-3 hover:text-purple-400 cursor-pointer rounded-lg transition-colors">Profile</div>
        </aside>

        {/* Main Feed */}
        <main className="flex-1 space-y-4">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </main>

        {/* Right Panel */}
        <aside className="w-64 hidden lg:block text-gray-300 space-y-4">
          <div className="p-3 text-lg font-semibold">Online Players</div>
          {onlinePlayers.map((p, i) => (
            <div key={i} className="p-2 hover:text-purple-400 transition-colors cursor-pointer rounded">
              {p}
            </div>
          ))}
          <div className="p-3 text-lg font-semibold mt-6">Events</div>
          <div className="p-2 text-gray-400">No upcoming events</div>
        </aside>
      </div>
    </div>
  );
}
