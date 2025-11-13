import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import LFG from './pages/LFG';
import Training from './pages/Training';
import Home from './pages/Home';

export default function App(){
  const [user, setUser] = useState(null);

  useEffect(()=>{
    const saved = localStorage.getItem('user');
    if(saved) setUser(JSON.parse(saved));
  },[])

  const logout = ()=>{localStorage.removeItem('user');localStorage.removeItem('token');setUser(null)}

  return (
    <Router>
      <div className="min-h-screen text-white">
        <Navbar user={user} logout={logout} />
        <main className="container mx-auto p-6">
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/feed" element={user ? <Feed/> : <Navigate to="/login"/>} />
            <Route path="/profile/:id" element={<Profile/>} />
            <Route path="/lfg" element={<LFG/>} />
            <Route path="/training" element={<Training/>} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}
