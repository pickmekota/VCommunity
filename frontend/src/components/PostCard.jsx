import React from 'react'

export default function PostCard({post}){
  return (
    <article className="card-nocturnum p-4 rounded-xl border border-white/6 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold">{post.author || 'Anonymous'}</div>
          <div className="text-xs text-white/60">{post.time || 'just now'}</div>
        </div>
        <div className="text-sm text-white/60">Likes: {post.likes || 0}</div>
      </div>

      <p className="mt-3 text-white/90">{post.content}</p>

      <div className="mt-3 flex gap-2">
        <button className="btn-ghost">Reply</button>
        <button className="btn-neon">Like</button>
      </div>
    </article>
  )
}
