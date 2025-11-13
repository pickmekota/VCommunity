import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar({user, logout}){
  const nav = useNavigate();
  return (
    <header className="bg-gradient-to-r from-black/60 via-transparent to-black/60 border-b border-white/5">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl font-extrabold tracking-wider" style={{color:'white'}}>VCommunity</div>
          <div className="hidden md:block text-sm text-white/60">Nocturnum • Social for agents</div>
        </div>

        <nav className="flex items-center gap-3">
          <Link to="/" className="text-sm text-white/70 hover:text-white">Home</Link>
          <Link to="/feed" className="text-sm text-white/70 hover:text-white">Feed</Link>
          <Link to="/lfg" className="text-sm text-white/70 hover:text-white">LFG</Link>
          <Link to="/training" className="text-sm text-white/70 hover:text-white">Training</Link>
          {user ? (
            <>
              <button onClick={()=>{logout();nav('/')}} className="btn-ghost">Sign out</button>
            </>
          ) : (
            <Link to="/login" className="btn-neon">Sign in</Link>
          )}
        </nav>
      </div>
    </header>
  )
}
