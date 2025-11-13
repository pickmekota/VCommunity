import React,{useState} from 'react'
import LFGCard from '../components/LFGCard'

const demo=[{id:1,username:'Viktoria',role:'Duelist',rank:'Ascendant'}]

export default function LFG(){
  const [profiles,setProfiles]=useState(demo)
  const [u,setU]=useState('')
  const add=()=>{setProfiles(prev=>[...prev,{id:Date.now(),username:u,role:'Any',rank:'Gold'}]);setU('')}

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card-nocturnum p-6 rounded-xl mb-4">
        <h3 className="font-semibold">Create LFG</h3>
        <div className="flex gap-2 mt-3">
          <input value={u} onChange={e=>setU(e.target.value)} className="flex-1 p-3 bg-transparent border border-white/6 rounded" placeholder="Username" />
          <button onClick={add} className="btn-neon">Publish</button>
        </div>
      </div>

      <div className="space-y-3">
        {profiles.map(p=> <LFGCard p={p} key={p.id}/>) }
      </div>
    </div>
  )
}
