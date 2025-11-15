import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import TypingLogo from "../components/TypingLogo";


export default function Home() {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animRef = useRef(null);
  const navigate = useNavigate();

  // Redirect if already logged in -> feed
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/feed", { replace: true });
  }, [navigate]);

  // Init particles canvas
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

    // create particles
    function createParticles() {
      const area = canvas.clientWidth * canvas.clientHeight;
      const baseCount = Math.round((area / 80000) * 60); // scale with screen
      const count = Math.max(25, Math.min(baseCount, 120));
      particlesRef.current = Array.from({ length: count }).map(() => {
        const size = Math.random() * 2.4 + 0.6; // small particles
        return {
          x: Math.random() * canvas.clientWidth,
          y: Math.random() * canvas.clientHeight,
          vx: (Math.random() - 0.5) * 0.26,
          vy: (Math.random() - 0.5) * 0.26,
          size,
          hue: 270 + Math.random() * 60, // purple → pink → blue range
          alpha: 0.08 + Math.random() * 0.45,
          phase: Math.random() * Math.PI * 2,
          sway: 0.2 + Math.random() * 0.6,
        };
      });
    }

    function draw(now) {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

      // subtle background gradient glow
      const g = ctx.createLinearGradient(0, 0, canvas.clientWidth, canvas.clientHeight);
      g.addColorStop(0, "rgba(8,6,20,0.6)");
      g.addColorStop(0.5, "rgba(10,8,18,0.6)");
      g.addColorStop(1, "rgba(6,4,10,0.6)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);

      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        // gentle drift + sinus sway
        p.x += p.vx + Math.cos((now / 1000) * p.sway + p.phase) * 0.02;
        p.y += p.vy + Math.sin((now / 1200) * p.sway + p.phase) * 0.02;

        // wrap around edges softly
        if (p.x < -10) p.x = canvas.clientWidth + 10;
        if (p.x > canvas.clientWidth + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.clientHeight + 10;
        if (p.y > canvas.clientHeight + 10) p.y = -10;

        // glow effect
        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 8);
        grad.addColorStop(0, `hsla(${p.hue}, 80%, 65%, ${p.alpha})`);
        grad.addColorStop(0.4, `hsla(${p.hue}, 80%, 45%, ${p.alpha * 0.65})`);
        grad.addColorStop(1, `hsla(${p.hue}, 70%, 20%, 0)`);
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
        ctx.fill();

        // tiny core
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 90%, 75%, ${Math.min(1, p.alpha * 2)})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // faint connected lines for nearby particles (very subtle)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.06;
            ctx.strokeStyle = `hsla(${(a.hue + b.hue) / 2},60%,60%,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    }

    // initial setup
    resize();
    createParticles();
    animRef.current = requestAnimationFrame(draw);

    // handle resize
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

  // Enter click -> navigate to /login (or /feed if logged)
  const handleEnter = () => {
    const token = localStorage.getItem("token");
    if (token) navigate("/feed");
    else navigate("/login");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden select-none">
      {/* Canvas for particles */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full -z-10"
        style={{ display: "block" }}
      />

      {/* Soft vignetting overlay */}
      <div
        aria-hidden
        className="absolute inset-0 -z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 30%, rgba(40,10,60,0.12), rgba(0,0,0,0.6) 45%, rgba(0,0,0,0.9) 100%)",
        }}
      />

      {/* Logo — slightly above center */}
      <div className="absolute left-1/2 -translate-x-1/2 top-40 md:top-32 z-20 pointer-events-none">
        <h1 className="neon-logo text-5xl md:text-7xl font-extrabold tracking-wider text-white text-center">
          <TypingLogo />
        </h1>
      </div>

      {/* Centered static block with welcome + enter */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-full max-w-xl px-6">
        <div className="mx-auto  border border-[rgba(150,70,255,0.12)] rounded-2xl backdrop-blur-md p-8 shadow-xl">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-100 mb-2 text-center">
            Добро пожаловать в VCommunity
          </h2>
          <p className="text-sm md:text-base text-gray-300 text-center mb-6">
            Сообщество игроков — тренировок, команд и событий. Войдите или зарегистрируйтесь, чтобы начать.
          </p>

          <div className="flex justify-center">
            <button
              onClick={handleEnter}
              className="enter-neon inline-flex items-center gap-3 px-6 py-3 rounded-full font-semibold text-white transition-transform duration-300"
              aria-label="Enter VCommunity"
            >
              <span className="enter-glow mr-2" />
              ENTER VCOMMUNITY
            </button>
          </div>
        </div>
      </div>

      {/* bottom hint */}
      <div className="absolute left-0 right-0 bottom-8 text-center z-20 text-xs text-gray-400">
        Press ENTER to continue — or click the button
      </div>
    </div>
  );
}
