import React from 'react'

export default function Players(){
  const demo=[{id:1,name:'Viktoria'},{id:2,name:'Echo'}]
  return (
    <div className="max-w-3xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {demo.map(p=> (
          <div key={p.id} className="card-nocturnum p-4 rounded-lg">
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-white/60">Rank: Immortal</div>
          </div>
        ))}
      </div>
    </div>
  )
}
