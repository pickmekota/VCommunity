import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Feed({ currentUser }) {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");

  const API = import.meta.env.VITE_API_URL || "http://localhost:4000"; // по умолчанию порт 4000

  // === Загрузка постов с backend ===
  useEffect(() => {
    fetch(`${API}/api/posts`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Fetch posts error:", err));
  }, [API]);

  // === Создать новый пост ===
  const createPost = async () => {
    if (!content.trim()) return;

    try {
      const res = await fetch(`${API}/api/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUser?.id,
          content,
        }),
      });
      const newPost = await res.json();
      setPosts([newPost, ...posts]);
      setContent("");
    } catch (err) {
      console.error("Create post error:", err);
    }
  };

  // === Лайк поста ===
  const likePost = async (postId) => {
    try {
      const res = await fetch(`${API}/api/posts/like/${postId}`, { method: "POST" });
      const updated = await res.json();
      setPosts(posts.map((p) => (p.id === postId ? updated : p)));
    } catch (err) {
      console.error("Like post error:", err);
    }
  };

  // === Репост ===
  const repostPost = async (postId) => {
    try {
      const res = await fetch(`${API}/api/posts/repost/${postId}`, { method: "POST" });
      const updated = await res.json();
      setPosts(posts.map((p) => (p.id === postId ? updated : p)));
    } catch (err) {
      console.error("Repost error:", err);
    }
  };

  // === Добавление комментария ===
  const addComment = async (postId, text) => {
    if (!text.trim()) return;

    try {
      const res = await fetch(`${API}/api/posts/comment/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUser?.id,
          text,
        }),
      });
      const updated = await res.json();
      setPosts(posts.map((p) => (p.id === postId ? updated : p)));
    } catch (err) {
      console.error("Add comment error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center pt-6 px-4">

      {/* === ЛЕВАЯ КОЛОНКА === */}
      <aside className="hidden lg:flex flex-col w-64 mr-6 gap-4">
        <div className="p-4 rounded-2xl bg-black/30 border border-purple-700/40 shadow-lg backdrop-blur-lg">
          <div className="flex items-center gap-3">
            <img
              src={currentUser?.avatar || "/avatar.jpg"}
              alt="avatar"
              className="w-12 h-12 rounded-full border border-purple-500"
            />
            <div>
              <h3 className="font-bold text-purple-300">{currentUser?.username}</h3>
              <p className="text-sm text-gray-400">Level {currentUser?.level}</p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-black/30 border border-purple-700/40 shadow-lg backdrop-blur-lg">
          <nav className="flex flex-col gap-3">
            <Link className="hover:text-purple-300 transition">Feed</Link>
            <Link to="/lfg" className="hover:text-purple-300 transition">LFG</Link>
            <Link to="/training" className="hover:text-purple-300 transition">Training</Link>
            <Link to={`/profile/${currentUser?.id}`} className="hover:text-purple-300 transition">Profile</Link>
          </nav>
        </div>
      </aside>

      {/* === СЕРЕДИНА: ЛЕНТА === */}
      <main className="w-full max-w-2xl flex flex-col gap-6">

        {/* Создание поста */}
        <div className="p-4 rounded-2xl bg-black/40 border border-purple-700/40 shadow-lg backdrop-blur-lg">
          <textarea
            className="w-full bg-black/20 p-3 rounded-xl border border-purple-600/30 focus:border-purple-400 outline-none"
            placeholder="Share your thoughts…"
            rows="3"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl transition"
            onClick={createPost}
          >
            Post
          </button>
        </div>

        {/* Посты */}
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 rounded-2xl bg-black/40 border border-purple-700/40 shadow-lg backdrop-blur-lg"
          >
            <div className="flex items-center gap-3 mb-3">
              <img
                src={post.user?.avatar || "/avatar.jpg"}
                className="w-10 h-10 rounded-full border border-purple-500"
              />
              <div>
                <h4 className="font-bold text-purple-300">{post.user?.username}</h4>
                <p className="text-xs text-gray-400">{new Date(post.created_at).toLocaleString()}</p>
              </div>
            </div>

            <p className="text-gray-200 mb-4">{post.content}</p>

            {/* Лайки / Комментарии / Репосты */}
            <div className="flex gap-6 text-gray-400 mb-2">
              <button className="hover:text-purple-300 transition" onClick={() => likePost(post.id)}>
                ❤️ {post.likes}
              </button>

              <span className="hover:text-purple-300 transition">💬 {post.comments?.length || 0}</span>

              <button className="hover:text-purple-300 transition" onClick={() => repostPost(post.id)}>
                🔁 {post.reposts || 0}
              </button>
            </div>

            {/* Комментарии */}
            <div className="flex flex-col gap-2">
              {post.comments?.map((c) => (
                <div key={c.id} className="flex items-start gap-2 text-gray-300 text-sm">
                  <img src={c.user?.avatar || "/avatar.jpg"} className="w-6 h-6 rounded-full border border-purple-500" />
                  <div>
                    <span className="font-bold text-purple-300">{c.user?.username}:</span> {c.text}
                  </div>
                </div>
              ))}
              {/* Добавление комментария */}
              <CommentInput postId={post.id} addComment={addComment} />
            </div>
          </motion.div>
        ))}
      </main>

      {/* === ПРАВАЯ КОЛОНКА === */}
      <aside className="hidden xl:flex flex-col w-72 ml-6 gap-4">
        <div className="p-4 rounded-2xl bg-black/30 border border-purple-700/40 shadow-lg backdrop-blur-lg">
          <h3 className="text-purple-300 font-bold mb-3">Trending</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li className="hover:text-purple-300 cursor-pointer">• Best Agents This Week</li>
            <li className="hover:text-purple-300 cursor-pointer">• Last Night Highlights</li>
            <li className="hover:text-purple-300 cursor-pointer">• Valorant 9.05 Patch</li>
            <li className="hover:text-purple-300 cursor-pointer">• Top Ranked Players</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

// Компонент для ввода комментария
function CommentInput({ postId, addComment }) {
  const [text, setText] = useState("");

  const submit = () => {
    addComment(postId, text);
    setText("");
  };

  return (
    <div className="flex gap-2 mt-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a comment..."
        className="flex-1 bg-black/20 p-2 rounded-xl border border-purple-600/30 outline-none text-sm"
      />
      <button onClick={submit} className="px-2 py-1 bg-purple-600 rounded-xl hover:bg-purple-500 text-sm">
        Post
      </button>
    </div>
  );
}

export default Feed;
