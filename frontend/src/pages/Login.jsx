import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return alert(data.message || "Login failed");
      login(data.user, data.token);
      navigate("/feed");
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={submit} className="card-nocturnum p-6 rounded-xl">
        <h2 className="text-2xl font-bold mb-4">Sign in</h2>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
          placeholder="Email"
          required
          className="w-full mb-3 p-3 bg-transparent border border-white/6 rounded"
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
          placeholder="Password"
          required
          className="w-full mb-4 p-3 bg-transparent border border-white/6 rounded"
        />
        <button type="submit" className="btn-neon w-full">Sign in</button>
      </form>
    </div>
  );
}
