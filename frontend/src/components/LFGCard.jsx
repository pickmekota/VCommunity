import React from 'react'

export default function LFGCard({p}){
  return (
    <div className="card-nocturnum p-3 rounded-lg border border-white/6 flex justify-between items-center">
      <div>
        <div className="font-semibold">{p.username}</div>
        <div className="text-xs text-white/60">{p.role} • {p.rank}</div>
      </div>
      <div>
        <button className="btn-neon">Invite</button>
      </div>
    </div>
  )
}
