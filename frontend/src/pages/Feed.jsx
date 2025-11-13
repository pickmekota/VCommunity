import React from 'react'
import PostCard from '../components/PostCard'

const demo = [
  {id:1, author:'Viktoria', time:'2m ago', content:'Clutch moment on Bind 💥', likes:12},
  {id:2, author:'Echo', time:'20m ago', content:'LF team for ranked', likes:3}
]

export default function Feed(){
  return (
    <div>
      <div className="mb-4">
        <div className="card-nocturnum p-4 rounded-xl">
          <textarea placeholder="Share your highlight..." className="w-full p-3 bg-transparent border border-white/6 rounded mb-2" rows={3}></textarea>
          <div className="flex justify-end"><button className="btn-neon">Post</button></div>
        </div>
      </div>

      <div>
        {demo.map(d=> <PostCard post={d} key={d.id} />)}
      </div>
    </div>
  )
}
