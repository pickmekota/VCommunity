import React,{useState} from 'react'

export default function Training(){
  const [score,setScore]=useState('')
  const [list,setList]=useState([])
  const submit=()=>{ setList(prev=>[{id:Date.now(),score, date:new Date().toLocaleString()},...prev]); setScore('') }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card-nocturnum p-6 rounded-xl mb-4">
        <h3 className="font-semibold">Record training</h3>
        <div className="flex gap-2 mt-3">
          <input value={score} onChange={e=>setScore(e.target.value)} className="flex-1 p-3 bg-transparent border border-white/6 rounded" placeholder="Score" />
          <button onClick={submit} className="btn-neon">Save</button>
        </div>
      </div>

      <div className="space-y-3">
        {list.map(item=> (
          <div key={item.id} className="card-nocturnum p-3 rounded-lg">{item.score} — <span className="text-xs text-white/60">{item.date}</span></div>
        ))}
      </div>
    </div>
  )
}
