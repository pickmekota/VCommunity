import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ user, logout }) {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (user) navigate("/feed");
    else navigate("/");
  };

  return (
    <nav className="backdrop-blur-md bg-black/30 border-b border-purple-800/40 shadow-lg shadow-purple-900/30">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* ЛОГО БЛОК — СЛЕВА */}
        <button
          onClick={handleLogoClick}
          className="text-3xl font-extrabold tracking-wider text-purple-400 
                     drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]
                     transition duration-300 hover:text-purple-300 
                     hover:drop-shadow-[0_0_15px_rgba(236,72,255,1)]
                     animate-pulse-slow"
        >
          VCommunity
        </button>

        {/* ПРАВАЯ ЧАСТЬ */}
        <div className="flex items-center gap-6 text-lg">

          {/* Если НЕ залогинен */}
          {!user && (
            <>
              <button
                onClick={() => navigate("/login")}
                className="hover:text-purple-300 transition duration-200"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="hover:text-purple-300 transition duration-200"
              >
                Register
              </button>
            </>
          )}

          {/* Если залогинен */}
          {user && (
            <>
              <button
                onClick={() => navigate("/lfg")}
                className="hover:text-purple-300 transition duration-200"
              >
                LFG
              </button>

              <button
                onClick={() => navigate("/training")}
                className="hover:text-purple-300 transition duration-200"
              >
                Training
              </button>

              <button
                onClick={() => navigate(`/profile/${user.id}`)}
                className="hover:text-purple-300 transition duration-200"
              >
                Profile
              </button>

              <button
                onClick={logout}
                className="text-red-400 hover:text-red-300 transition duration-200"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
