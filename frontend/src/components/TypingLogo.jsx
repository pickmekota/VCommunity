import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function TypingLogo() {
  const text = "VCommunity";
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 120); // скорость печати (меньше = быстрее)

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.h1
      className="text-6xl font-bold text-violet-300 drop-shadow-[0_0_20px_rgba(150,80,255,0.8)] tracking-wide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    >
      {displayed}
      <motion.span
        className="inline-block w-2 h-10 bg-violet-300 ml-1"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
      ></motion.span>
    </motion.h1>
  );
}
