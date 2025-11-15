import React from "react";
import { motion } from "framer-motion";

export default function LFGCard({ lfg }) {
  if (!lfg) return null;

  return (
    <motion.div
      className="bg-[rgba(5,10,20,0.55)] border border-[rgba(150,70,255,0.2)] rounded-2xl p-4 shadow-lg backdrop-blur-md cursor-pointer"
      whileHover={{ scale: 1.03, boxShadow: "0 0 25px rgba(150,70,255,0.6)" }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-purple-400 font-semibold">{lfg.username}</h3>
        <span className="text-sm text-gray-400">{lfg.role}</span>
      </div>
      <p className="text-gray-200">{lfg.description}</p>
    </motion.div>
  );
}
