import React from "react";
import { motion } from "framer-motion";

export default function PostCard({ post }) {
  if (!post) return null;

  return (
    <motion.div
      className="bg-[rgba(10,5,25,0.6)] border border-[rgba(130,50,250,0.3)] rounded-2xl p-4 shadow-md backdrop-blur-md cursor-pointer"
      whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(130,50,250,0.7)" }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
    >
      <h3 className="text-lg font-bold text-purple-300">{post.author}</h3>
      <p className="text-gray-200 mt-1">{post.content}</p>
      <div className="mt-2 text-xs text-gray-400">#VCommunity</div>
    </motion.div>
  );
}
